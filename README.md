# Butler Monorepo

This monorepo contains:

- **[apps/desktop](./apps/desktop)**: The Electron/React Windows Launcher Application
- **[apps/web](./apps/web)**: The Marketing Landing Page (Next.js)

## Development

### Prerequisites
- Node.js 18+
- npm 9+ (workspaces support)

### Setup

```bash
npm install
```

### Running

```bash
# Run Desktop App
npm run desktop

# Run Landing Page
npm run web
```

## Deployment

See [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md) for details on how to deploy the landing page and desktop app.
