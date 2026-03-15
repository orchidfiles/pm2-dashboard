# pm2-dashboard

[![npm version](https://img.shields.io/npm/v/pm2-dashboard)](https://www.npmjs.com/package/pm2-dashboard)
[![npm downloads per month](https://img.shields.io/npm/dm/pm2-dashboard)](https://www.npmjs.com/package/pm2-dashboard)
[![node version](https://img.shields.io/node/v/pm2-dashboard)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/pm2-dashboard)](./LICENSE)

Self-hosted web dashboard for PM2. Installs as an npm package, runs on the same server as PM2. No cloud, no subscriptions.

> Until version 1.0.0, this project is under active development. Use it locally for evaluation, not on production servers.

## Current status

- [x] Process list with CPU, RAM, status
- [x] Start, stop, restart
- [x] Uptime and restart counters
- [x] Single npm package with API and static web UI
- [ ] Authentication
- [ ] Real-time process updates
- [ ] Log viewer with real-time tail
- [ ] Metrics history with graphs

## Security

Current builds have no authentication yet.

The published package binds to `127.0.0.1:3000` by default. If you expose it publicly through a reverse proxy, anyone who can reach it can control PM2 processes.

Use it locally, inside a private network, or behind a trusted reverse proxy and access control.

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

Starts on `http://127.0.0.1:3000` by default.

## Configuration

```bash
pm2-dashboard --port 4000 --host 127.0.0.1
```

```bash
PORT=4000 HOST=127.0.0.1 pm2-dashboard
```

Config priority: CLI flags, `PORT` and `HOST`, defaults.

Use `127.0.0.1` to restrict access to localhost.

Use `pm2-dashboard --help` to see available CLI options.

## Stack today

- API: Express + TypeScript
- UI: Svelte 5 + TypeScript + Tailwind 4 + Skeleton
- Single npm package, one process, one port

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

PM2 ships with a terminal interface. When you need browser access, multiple servers, or a team without SSH, the official option is PM2 Plus (paid SaaS).

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

## License

MIT

---

Made by the author of [orchidfiles.com](https://orchidfiles.com) — essays from inside startups.  
If you found `pm2-dashboard` useful, you'll probably enjoy the essays.
