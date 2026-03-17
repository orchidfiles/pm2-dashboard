# pm2-dashboard

[![npm version](https://img.shields.io/npm/v/pm2-dashboard)](https://www.npmjs.com/package/pm2-dashboard)
[![npm downloads per month](https://img.shields.io/npm/dm/pm2-dashboard)](https://www.npmjs.com/package/pm2-dashboard)
[![node version](https://img.shields.io/node/v/pm2-dashboard)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/pm2-dashboard)](./LICENSE)
[![last commit](https://img.shields.io/github/last-commit/orchidfiles/pm2-dashboard)](https://github.com/orchidfiles/pm2-dashboard)

Self-hosted web dashboard for PM2. Open source alternative to PM2 Plus. Installs as a single npm package, runs on the same server as PM2. No cloud, no subscriptions, no external dependencies. No separate database server: stores data in a local SQLite file.

> Until version 1.0.0, this project is under active development. Production use is possible, but expect breaking changes and missing features.

## What works today

- [x] Process list with CPU, RAM, status
- [x] Start, stop, restart
- [x] Uptime and restart counters
- [x] Authentication
- [x] First-run setup link with initial admin account creation
- [x] Single npm package with API and static web UI

## What is next

- [ ] Real-time process updates
- [ ] Log viewer with real-time tail
- [ ] Metrics history with graphs
- [ ] Alerts
- [ ] Environment variables management from the UI
- [ ] Cluster management

## First run

1. Start the dashboard with `npx pm2-dashboard`, or install it globally with `npm install -g pm2-dashboard` and then run `pm2-dashboard`.
2. Copy the setup URL printed by the CLI.
3. Open the link and create the initial admin account.
4. Log in to access the dashboard.

## Requirements

- Node.js >= 22
- PM2 running on the same server

## Installation

```bash
# One-time run
npx pm2-dashboard

# Global install
npm install -g pm2-dashboard
pm2-dashboard
```

Starts on `http://localhost:3000` by default.

## Run with PM2

```bash
pm2 start pm2-dashboard
```

## Configuration

```bash
pm2-dashboard --host=127.0.0.1 --port=4000 --db=~/.pm2-dashboard/data.db
```

```bash
HOST=127.0.0.1 PORT=4000 DB_PATH=~/.pm2-dashboard/data.db pm2-dashboard
```

Config priority: CLI flags, environment variables, defaults.

Defaults:

- Host: `127.0.0.1`
- Port: `3000`
- Database: `~/.pm2-dashboard/data.db`

Use `127.0.0.1` to restrict access to localhost.

Use `pm2-dashboard --help` to see available CLI options.

## Security

The package binds to `127.0.0.1:3000` by default.

On the first launch, the CLI prints a setup URL with a one-time token. After the initial account is created, access requires login.

For public access, place the dashboard behind a trusted reverse proxy or inside a private network.

## Architecture

- API: NestJS + TypeScript
- UI: Svelte 5 + TypeScript + Tailwind 4 + Skeleton
- Database: SQLite via Drizzle ORM
- Authentication: setup token for first run, session-based login after setup
- Packaging: single npm package serving API and static web UI
- Runtime model: runs on the same server as PM2

## Project structure

- `apps/api`: backend API, auth, PM2 integration, SQLite storage
- `apps/web`: browser UI built with Svelte 5
- `packages/shared`: code shared between API and frontend
- `packages/pm2-dashboard`: published npm package and CLI entrypoint

## Reverse proxy (nginx)

Run the dashboard on localhost and proxy it through nginx:

```nginx
server {
    listen 80;
    server_name dashboard.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Run certbot separately for TLS.

## Why

PM2 ships with a terminal interface. When you need browser access without SSH, the official option is PM2 Plus (paid SaaS).

Every open source alternative is either abandoned or built without structure: plain JS files, no modules, no clear architecture.

`pm2-dashboard` is a TypeScript monorepo with a NestJS backend, Svelte 5 frontend, and a shared package layer. It is built to be maintained and extended over time.

Open source alternatives:

| Project | Description | Language | Stars | Last commit | Status |
|---------|-------------|----------|-------|-------------|--------|
| [pm2-webui](https://github.com/modulsx/pm2-webui) | Opensource Alternative to PM2 Plus. Minimalistic App Manager and Log Viewer | JS, HTML, CSS | 550 | 2022 | inactive |
| [pm2-web](https://github.com/achingbrain/pm2-web) | A web based monitor for PM2 | JS, CSS, HTML | 540 | 2015 | inactive |
| [pm2panel](https://github.com/4xmen/pm2panel) | PM2 web control panel to manage processes | JS, HTML, CSS | 528 | 2020 | inactive |
| [pm2.web](https://github.com/oxdev03/pm2.web) | Monitor processes, view logs, access controls | TypeScript, JS, CSS | 168 | 2024 | inactive |
| [pm2-web-ui](https://github.com/olexnzarov/pm2-web-ui) | (Not so) modern web interface for PM2 | Next.js, CSS, Sass | 148 | 2023 | inactive |
| [pm2-ui](https://github.com/thenickygee/pm2-ui) | PM2 Web UI built with Next.js and TailwindCSS | JS, CSS | 20 | 2023 | inactive |
| [pm-web-panel](https://github.com/milosz08/pm-web-panel) | Real-time PM2 manager with user management | Java, TypeScript, Docker | 5 | 2025 | active |

## Contributing

Issues and pull requests are welcome. The project is actively maintained.

## License

MIT

---

Made by the author of [orchidfiles.com](https://orchidfiles.com) — essays from inside startups.  
If you found `pm2-dashboard` useful, you'll probably enjoy the essays.
