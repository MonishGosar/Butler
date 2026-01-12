# Butler

<div align="center">
  <img src="apps/web/public/logo_2.png" alt="Butler Logo" width="120" />
  
  **A fast, keyboard-first Windows launcher**
  
  [![Download](https://img.shields.io/badge/Download-Butler.exe-blue?style=for-the-badge)](https://github.com/MonishGosar/Butler/releases/latest/download/Butler.exe)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

## ⚡ Quick Download

**[➡️ Download Butler.exe](https://github.com/MonishGosar/Butler/releases/latest/download/Butler.exe)** (Portable - Just run it!)

Or visit the [Releases Page](https://github.com/MonishGosar/Butler/releases) for all versions.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Instant Search** | Find and launch apps instantly as you type |
| 📋 **Clipboard History** | Access your clipboard history with `Alt+V` |
| 🖼️ **Native Icons** | Shows real Windows application icons |
| ⌨️ **Keyboard First** | Navigate everything with keyboard shortcuts |
| 🎨 **Minimal UI** | Clean, distraction-free dark interface |
| ⚡ **Fast** | Opens in milliseconds, uses <1% CPU |

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Launcher | `Alt + Space` or `F1` |
| Clipboard History | `Alt + V` or `F2` |
| Navigate Results | `↑` `↓` Arrow Keys |
| Open Selected | `Enter` |
| Close | `Esc` |

---

## 🖥️ Screenshot

<div align="center">
  <img src="https://via.placeholder.com/600x150/1a1a1a/ffffff?text=Butler+Search+Bar" alt="Butler Screenshot" />
</div>

---

## 🛠️ Development

This is a monorepo containing:

| App | Path | Description |
|-----|------|-------------|
| Desktop App | `apps/desktop` | Electron + React launcher |
| Landing Page | `apps/web` | Next.js marketing site |

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/MonishGosar/Butler.git
cd Butler

# Install dependencies
npm install

# Run Desktop App (development)
npm run desktop

# Run Landing Page
npm run web
```

### Build Desktop App

```bash
cd apps/desktop
npm run dist
```

The built `Butler.exe` will be in `apps/desktop/release/win-unpacked/`.

---

## 📄 License

MIT © [Monish Gosar](https://github.com/MonishGosar)

---

<div align="center">
  <sub>Built with ❤️ using Electron, React, and TypeScript</sub>
</div>
