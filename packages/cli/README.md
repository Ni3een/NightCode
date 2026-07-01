# ainightcode

> AI-powered coding assistant for your terminal — powered by [NightCode](https://github.com/Ni3een/NightCode)

`ainightcode` is a beautiful, terminal-native AI coding assistant. Think of it as your always-on pair programmer, right inside your shell.

---

## Requirements

- **[Bun](https://bun.sh) ≥ 1.0** — This CLI runs on Bun (not Node.js)

## Installation

```bash
# Install globally with npm
npm install -g ainightcode

# Or with bun
bun install -g ainightcode
```

After installation, the `ainightcode` command will be available in your terminal.

## Usage

```bash
ainightcode
```

That's it! The CLI will launch an interactive terminal UI.

## Configuration (Optional)

By default the CLI connects to the NightCode cloud service. No configuration is needed to get started — just install and run.

If you need to override settings (e.g. point to a self-hosted server), create a config file at:

```
~/.ainightcode/.env
```

Available environment variables:

| Variable | Description | Default |
|---|---|---|
| `API_URL` | NightCode backend URL | `https://nightcode-production-8ace.up.railway.app` |
| `CLERK_FRONTEND_API` | Clerk OAuth frontend URL | _(set by NightCode)_ |
| `CLERK_OAUTH_CLIENT_ID` | Clerk OAuth client ID | _(set by NightCode)_ |

Example `~/.ainightcode/.env`:

```env
API_URL=http://localhost:3000
```

## Authentication

On first run you'll be prompted to log in. The CLI opens your browser for OAuth authentication via Clerk. Your session token is stored securely in `~/.nightcode/auth.json`.

## Updating

```bash
npm update -g ainightcode
```

## Uninstalling

```bash
npm uninstall -g ainightcode
```

## License

MIT © NightCode
