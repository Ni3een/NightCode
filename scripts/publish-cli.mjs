/**
 * publish-cli.mjs
 *
 * Copies the CLI package files to a temporary directory OUTSIDE the Bun
 * workspace before running `npm publish`. This is necessary because npm v11's
 * arborist crashes when it encounters Bun's workspace symlinks.
 *
 * Also writes the bin shim with guaranteed LF line endings (CRLF from Windows
 * editors would break the shebang on Unix, causing npm to remove the bin entry).
 */

import { cpSync, mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..");
const CLI_DIR = join(ROOT, "packages", "cli");
const TMP_DIR = join(tmpdir(), `ainightcode-publish-${Date.now()}`);

console.log("📦 Preparing ainightcode for npm publish...");
console.log(`   Source: ${CLI_DIR}`);
console.log(`   Temp:   ${TMP_DIR}`);

// Create temp dir
mkdirSync(TMP_DIR, { recursive: true });

try {
  // Copy the dist folder (contains bundled index.js + wasm assets)
  const filesToCopy = ["dist", "package.json", "README.md", ".npmignore"];

  for (const file of filesToCopy) {
    const src = join(CLI_DIR, file);
    const dest = join(TMP_DIR, file);
    if (existsSync(src)) {
      cpSync(src, dest, { recursive: true });
      console.log(`   ✓ Copied ${file}`);
    } else {
      console.warn(`   ⚠ Skipped ${file} (not found)`);
    }
  }

  // Verify and fix the shebang on dist/index.js in the temp dir
  // npm requires the bin file to start with exactly "#!/usr/bin/env <interpreter>"
  // with LF (not CRLF) line endings.
  const distIndex = join(TMP_DIR, "dist", "index.js");
  let content = readFileSync(distIndex, "utf8");

  // Normalize CRLF → LF
  content = content.replace(/\r\n/g, "\n");

  // Ensure shebang is the very first line (no BOM, no leading whitespace)
  if (!content.startsWith("#!/usr/bin/env node\n")) {
    // Remove any existing broken shebang or @bun marker then prepend clean one
    content = content.replace(/^[^\n]*\n/, "");
    content = "#!/usr/bin/env node\n" + content;
    console.log("   ✓ Fixed shebang in dist/index.js");
  } else {
    console.log("   ✓ Shebang already correct in dist/index.js");
  }

  writeFileSync(distIndex, content, { encoding: "utf8", mode: 0o755 });
  console.log("   ✓ Set dist/index.js as executable (chmod 755)");

  console.log("\n🚀 Running npm publish...");

  // Use Bun.spawn to avoid the node/bin remap issue
  // On Windows, need to use cmd.exe to find npm
  // Disable strict SSL to work around certificate verification issues
  const isWindows = process.platform === "win32";
  const proc = Bun.spawn(
    isWindows 
      ? ["cmd", "/c", "npm", "publish", "--strict-ssl=false"] 
      : ["npm", "publish", "--strict-ssl=false"],
    {
      cwd: TMP_DIR,
      stdio: ["inherit", "inherit", "inherit"],
    }
  );

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    console.error(`\n❌ npm publish failed with exit code ${exitCode}`);
    process.exit(exitCode);
  }

  console.log("\n✅ Published successfully!");
  console.log("   Users can now install with: npm install -g ainightcode");
} finally {
  // Clean up temp dir
  rmSync(TMP_DIR, { recursive: true, force: true });
  console.log("🧹 Cleaned up temp directory.");
}
