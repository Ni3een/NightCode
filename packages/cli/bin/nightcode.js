#!/usr/bin/env bun
import { config } from "dotenv";
import { join } from "node:path";
import { homedir } from "node:os";

// Load .env from user's home config dir: ~/.ainightcode/.env
// This lets installed users override any defaults.
config({
  path: join(homedir(), ".ainightcode", ".env"),
  quiet: true,
});

await import("../dist/index.js");