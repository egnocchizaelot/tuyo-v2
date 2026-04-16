# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TuyoTools Frontend — an AngularJS 1.x SPA for Tuyo.uy, a collaborative donation platform based in Uruguay. Built with Grunt, Bower, and npm. Generated from `yo angular generator 0.12.0`.

## Commands

```bash
# Setup
npm install
npx bower install

# Development server (port 9000, livereload on 35729)
grunt serve

# Production build (output in dist/)
grunt build

# Unit tests (Karma + Jasmine)
grunt test

# Linting (JSHint, also runs during grunt build)
grunt jshint
```

**Requirements**: Node 8 (managed via nvm in CI), Ruby Compass for SCSS compilation.

## Environment Configuration

Edit `app/deploy_config.js` to switch environments. Set the `EVIRONMENT` variable to one of:
- `ENVTS.DEVELOPMENT_LOCAL` — localhost:8000 backend
- `ENVTS.DEVELOPMENT_OUT` — devapi.tuyo.uy
- `ENVTS.TEST` — testapi.tuyo.uy
- `ENVTS.PRODUCCION` — api.tuyo.uy

Each environment configures: `BASE_URL`, `HELP_URL`, `MEDIA_URL`, `SOCKET_SERVER`, `FACEBOOK_APP_ID`.

## Architecture

### Module System

Root module `TuyoTools` (defined in `app/app/app.js`) composes ~21 feature modules. Each module follows the pattern:
- `.module.js` — module declaration
- `.controller.js` — controllers
- `.directive.js` — directives
- `.service.js` — services
- `.template.html` — templates

### Routing

UI Router (`ui.router`) with `app` as abstract parent state. Routes defined in `app/app/routers.js`. Protected routes are the default; public routes set `data: { requireLogin: false }`.

### Key Services

- **`appService`** (`app/app/app.service.js`) — global state, auth login/logout flow, Facebook SDK integration, user data management via `$localStorage`
- **`API`** (`app/app/scripts/services/api.js`) — centralized HTTP wrapper with `registerEndpoint()`, built-in rate limiting (500ms between calls per endpoint), and request deduplication
- **`Auth`** (`app/app/scripts/services/auth.js`) — authentication service (login, register, logout, token management)
- **`socketService`** (`app/app/socket.service.js`) — Socket.IO wrapper for real-time updates (donations, chat, forums, notifications)

### Authentication Flow

Token-based auth stored in cookies (`Authorization: Token <token>`, `X-CSRFToken`). `AuthInterceptor` catches 401 responses and redirects to landing. Facebook OAuth available as alternative login. User data stored in `$localStorage`.

### Styling

SCSS source in `app/assets/scss/`, compiled via Compass to `app/assets/css/`. Bootstrap 3 + Font Awesome. Grunt watch auto-compiles and autoprefixes during development.

## CI/CD

GitLab CI (`.gitlab-ci.yml`) with branch-based deployments:
- `devel` branch → dev environment
- `test` branch → test environment
- `master` branch → production

Build output is copied to `/var/www/tuyo_tools/www/` on the target server.

## Dependency Management

Frontend libraries are managed via Bower (`bower.json`), not npm. The `app/index.html` file loads all scripts — new JS files must be added there (or wired via `grunt-wiredep` for Bower components).

## Skill Triggers

When the user asks to understand, map, or explore this codebase's architecture, automatically invoke the `/cartographer` skill. Trigger phrases include: "map this codebase", "explore the architecture", "what does this project do", "build KB", "update the knowledge base", "visualize the graph", "check readiness", "validate my spec". The cartographer skill lives at `.claude/skills/cartographer/` and builds a graph-based knowledge base at `.cartographer/knowledge-base/`.
