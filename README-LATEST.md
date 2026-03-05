# Jarvis - Moltbot Gateway Dashboard

Advanced multi-agent autonomous system with real-time WebSocket control panel, integrated CI/CD pipeline, and instant response capabilities via GitHub Copilot GPT-5-mini.

## ✨ Recent Updates & Improvements (March 2026)

### 🔐 Authentication System
- **Secure Login Interface**: All-new authentication layer with modern, responsive UI
- **Default Credentials**: `username: turing` | `password: jeturing`
- **Token-Based Access** Auto-login on first visit, persistent across sessions
- **Logout Protection**: Secure session management with one-click logout button

### 🤖 Real-time Agents Dashboard
- **Tasks Board** (Kanban) - Visualize sessions in Pending → In Progress → Done → Failed columns
- **Content Pipeline** - Track work through Ideation → Creation → Review → Publishing stages
- **Calendar View** - Schedule cron jobs, see next run times, and trigger manually
- **Agent Monitor** - Real-time stats on all connected agents (CPU, uptime, active sessions)
- **Live WebSocket Updates** - Dashboard refreshes automatically when agents run

### 🚀 Auto-Start Service (Windows)
- **Automatic Gateway Launch** - Service starts on Windows reboot without user action
- **Minimized Window** - Runs in background; easily manage via system tray
- **Installation Script** - One-command setup: `scripts/create-startup-shortcut.ps1 -Run`

### 🧠 AI Model Support
- **Primary**: GitHub Copilot GPT-5-mini (~1 second response time)
- **Fallback 1**: Qwen 2.5 Coder 7B (local vLLM)
- **Fallback 2**: Claude 3.5 Haiku (OpenRouter)
- **Optional**: DeepSeek Coder 33B, Phi-4 (local)

### 📱 Multi-Channel Integration
- **Telegram Bot** (@Jeturing_bot) - Connected & responding
- **Web Dashboard** - Real-time control at `https://192.168.2.110`
- **WebSocket Gateway** - `wss://0.0.0.0:443` with TLS
- **Canvas Interface** - Visualization & debugging tools

---

## 🚀 Quick Start

### Prerequisites
- Windows 10/11
- Node.js 22+
- pnpm package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jeturing/Jarvis.git Jarvis-main
   cd Jarvis-main
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build the project**
   ```bash
   pnpm run build
   ```

4. **Configure Moltbot**
   - Edit `~/.moltbot/moltbot.json` or use: `moltbot config set ...`
   - Set your preferred AI model
   - Configure Telegram bot token (if needed)

5. **Start the gateway**
   ```bash
   node scripts/run-node.mjs gateway
   ```

6. **Access the dashboard**
   - Open: `https://192.168.2.110`
   - Login: `turing` / `jeturing`

### Auto-Start Setup (Optional)

Install Windows auto-start:

```powershell
powershell -ExecutionPolicy Bypass -File "scripts/create-startup-shortcut.ps1"
```

This creates a shortcut in your Startup folder that automatically launches the gateway on reboot.

---

## 📋 Project Structure

```
Jarvis-main/
├── src/                          # Backend  (Node.js/TypeScript)
│   ├── gateway/                  # WebSocket & HTTP gateway
│   ├── providers/                # AI/LLM integrations (Copilot, Ollama, OpenRouter)
│   ├── channels/                 # Multi-channel support (Telegram, Discord, etc.)
│   ├── agents/                   # Agent orchestration & execution
│   ├── routing/                  # Request routing & session management
│   └── ...
├── ui/                           # Frontend (Vue/TypeScript)
│   ├── src/
│   │   ├── ui/
│   │   │   ├── app.ts            # Main application logic
│   │   │   ├── app-render.ts     # UI rendering pipeline
│   │   │   ├── views/
│   │   │   │   ├── chat.ts       # Chat interface
│   │   │   │   ├── dashboard.ts  # **NEW: Real-time agents dashboard**
│   │   │   │   ├── login.ts      # **NEW: Authentication screen**
│   │   │   │   ├── config.ts     # Configuration panel
│   │   │   │   ├── cron.ts       # Job scheduler
│   │   │   │   └── ...
│   │   │   ├── controllers/
│   │   │   │   ├── agents.ts     # **NEW: Agent data loading**
│   │   │   │   └── ...
│   │   │   └── storage.ts        # Local storage & token management
│   │   └── styles/               # CSS styling
│   └── dist/                     # Built assets
├── docs/                         # Documentation
├── scripts/
│   ├── run-node.mjs              # Gateway launcher
│   ├── ui.js                     # UI build script
│   ├── start-gateway.bat         # **NEW: Windows batch starter**
│   ├── create-startup-shortcut.ps1 # **NEW: Startup installer**
│   └── ...
├── apps/                         # Platform-specific (iOS, Android, macOS)
├── packages/                     # Workspace packages
├── pnpm-workspace.yaml           # Monorepo config
└── moltbot.mjs                   # Gateway CLI entry point
```

---

## 🔧 Configuration

### Default Config Location
`~/.moltbot/moltbot.json` (or `C:\Users\<username>\.moltbot\moltbot.json` on Windows)

### Key Settings

```json
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "github-copilot/gpt-5-mini"
      }
    }
  },
  "gateway": {
    "port": 443,
    "bind": "lan",
    "tls": {
      "enabled": true,
      "autoGenerate": true
    },
    "controlUi": {
      "dangerouslyDisableDeviceAuth": true
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "YOUR_BOT_TOKEN"
    }
  }
}
```

---

## 🖥️ Dashboard Features

### Authentication
- **Login Screen**: Enter `turing` / `jeturing` on first access
- **Token Storage**: Credentials saved in browser localStorage
- **Automatic Login**: Returns to dashboard on subsequent visits
- **Logout Button**: Top-right corner of navbar

### Tabs & Navigation

#### Chat
- Direct WebSocket chat with the agent
- Real-time message streaming
- Tool execution logs
- Thinking mode visualization

#### Control → Dashboard
- **Tasks Board**: Kanban view of sessions
- **Content Pipeline**: Multi-stage workflow tracker
- **Calendar**: Cron job scheduler
- **Agent Monitor**: System metrics & health

#### Control → Channels
- Telegram configuration
- Channel status & connectivity

#### Control → Sessions
- Active agent sessions
- Session history
- Debug logs

#### Control → Cron Jobs
- Scheduled task management
- Next run times
- Run history

#### Agent → Skills
- **NEW**: Skill management interface
- Install/enable CLI tools automatically
- Check skill dependencies

#### Settings
- Theme toggle (light/dark)
- Model selection
- Advanced configuration
- Raw JSON config editor

---

## 🚦 Running Locally

### Start Gateway
```bash
cd Jarvis-main
node scripts/run-node.mjs gateway
```

Output example:
```
🦞 Moltbot 2026.1.27-beta.1
[gateway] agent model: github-copilot/gpt-5-mini
[gateway] listening on wss://0.0.0.0:443 (PID 12464)
[telegram] [default] starting provider (@Jeturing_bot)
```

### Access Dashboard
- **URL**: `https://192.168.2.110`
- **Login**: `turing` / `jeturing`
- Accept SSL/TLS warning (self-signed certificate)

### Connect from Another Device
- **Same WiFi**: `https://192.168.2.110:443`
- **Tailscale Network**: `https://100.x.x.x` (install Tailscale first)

---

## 🛠️ Development

### Build & Run

```bash
# Install dependencies
pnpm install

# Type-check & compile
pnpm run build

# Run UI dev server
pnpm -F ui build

# Start gateway
node scripts/run-node.mjs gateway

# Run tests
pnpm run test
```

### Key Files Modified for New Features

#### Authentication
- `ui/src/ui/views/login.ts` - Login UI component
- `ui/src/ui/app.ts` - Login state management (`isLoggedIn`, `handleLogin`)
- `ui/src/ui/app-render.ts` - Login screen routing

#### Real-time Dashboard
- `ui/src/ui/views/dashboard.ts` - **NEW**: Agents dashboard with 4 sub-views
- `ui/src/ui/controllers/dashboard.ts` - **NEW**: Data fetching for agents/sessions/cron
- `ui/src/ui/navigation.ts` - Added `"dashboard"` tab to Agent group
- `ui/src/ui/app-gateway.ts` - Real-time updates on agent events

#### Auto-Start Service
- `scripts/create-startup-shortcut.ps1` - **NEW**: PowerShell startup installer
- `scripts/start-gateway.bat` - **NEW**: Batch launcher script
- Registers shortcut in Windows Startup folder

---

## 🔐 Security Considerations

⚠️ **For Development/Local Use Only**

- Default credentials are hardcoded (`turing` / `jeturing`)
- Self-signed TLS certificates
- Device auth bypass disabled (`dangerouslyDisableDeviceAuth: true`)
- Gateway exposed on `0.0.0.0` (all interfaces)

**Production Recommendations:**
- Use strong, unique passwords
- Deploy behind reverse proxy (nginx/Caddy)
- Use Let's Encrypt for real SSL certificates
- Restrict gateway to private networks
- Enable proper device authentication
- Use API keys & OAuth for integrations

---

## 🤝 Contributing

1. Clone the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes & test
4. Commit: `git commit -am 'Add new feature'`
5. Push: `git push origin feature/your-feature`
6. Open a PR

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📝 Changelog

### v2026.1.27-beta.1 (Latest)

**New Features**
- ✨ Authentication system with login screen
- ✨ Real-time Agents Dashboard (Tasks, Pipeline, Calendar, Monitor)
- ✨ Auto-start Windows service
- ✨ Skill management interface
- ✨ Auto-token injection from gateway
- ✨ Logout functionality

**Improvements**
- Refactored UI rendering pipeline
- Improved WebSocket connection stability
- Better error handling & logging
- Optimized agent data fetching
- Added real-time event streaming

**Bug Fixes**
- Fixed device auth bypass
- Fixed missing hooks configuration
- Resolved token injection timing
- Fixed skills list loading

---

## 📚 Additional Resources

- **Docs**: `/docs` folder
  - [Installation Guide](./docs/install.md)
  - [Configuration Reference](./docs/configuration.md)
  - [API Reference](./docs/api.md)
  - [Troubleshooting](./docs/troubleshooting.md)

- **Channels Documentation**: `/docs/channels`
  - Telegram setup
  - Discord integration
  - Slack configuration
  - etc.

- **Official Moltbot Docs**: https://docs.molt.bot

---

## 🔗 Links

- **GitHub Repo**: https://github.com/jeturing/Jarvis
- **Moltbot Docs**: https://docs.molt.bot
- **GitHub Copilot**: https://github.com/copilot
- **Telegram Bot**: @Jeturing_bot

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Thanks

Built with ❤️ using:
- [Moltbot](https://molt.bot) - Multi-channel agent framework
- [Lit](https://lit.dev) - Lightweight web components
- [TypeScript](https://www.typescriptlang.org/)
- [GitHub Copilot](https://github.com/copilot)
- [OpenRouter](https://openrouter.ai) - Multi-model LLM API

---

**Questions?** Open an issue or contact [@jeturing](https://github.com/jeturing)

Last updated: **March 5, 2026**
