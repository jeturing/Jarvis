# 🦞 Moltbot Skills Setup Guide

**Current Status:** 2/49 skills ready

## ✅ Ready Skills (2)
1. **📦 BlueBubbles** - External channel plugin for iMessage
2. *More coming as dependencies are installed*

## 🔧 Installation Instructions

### Windows Setup

#### Step 1: Install GitHub CLI
```bash
winget install GitHub.cli
```
Then reload your terminal for PATH changes.

#### Step 2: Install Python Tools (Optional)
```bash
# For Whisper (speech-to-text)
pip install openai-whisper

# For email management
pip install himalaya

# For image tools
pip install pillow
```

#### Step 3: Install ffmpeg (Required for Whisper)
```bash
winget install ffmpeg
```

#### Step 4: Run Skills Setup
```bash
bash skills.sh
```

---

## 📋 Available Skills by Platform

### Windows-Compatible Skills

| Skill | Status | Installation |
|-------|--------|--------------|
| 🐙 **github** | ❌ Missing `gh` | `winget install GitHub.cli` |
| 📦 **mcporter** | ❌ Missing | Already in npm |
| 🎙️ **openai-whisper** | ❌ Missing `whisper` | `pip install openai-whisper` |
| 🎮 **gog** | ❌ Missing | Manual setup required |
| 📄 **nano-pdf** | ❌ Missing | Manual setup required |
| 💎 **obsidian** | ❌ Missing | Manual setup required |
| 📝 **notion** | ❌ Missing | Manual setup required |

### macOS-Only Skills
- 📝 **apple-notes** - Requires `memo` CLI
- ⏰ **apple-reminders** - Requires `remindctl` CLI
- 📨 **imsg** - Requires iMessage CLI
- 🐻 **bear-notes** - Requires Bear app

### Linux-Compatible Skills
- 📧 **himalaya** - CLI email client
- 🐙 **github** - GitHub CLI (gh)

---

## 🚀 Quick Start

1. **View all skills:**
   ```bash
   moltbot skills
   ```

2. **Install specific skill dependencies:**
   ```bash
   # GitHub CLI
   winget install GitHub.cli

   # ffmpeg (for audio/video)
   winget install ffmpeg
   ```

3. **Reload terminal and check status:**
   ```bash
   moltbot skills | grep -E "✓|✗"
   ```

---

## 💡 Recommended Skills for Your Setup

### For Development
- ✅ **github** (gh CLI) - Manage issues, PRs, workflows
- ✅ **coding-agent** - Run agent scripts programmatically
- ✅ **mcporter** - Control MCP servers

### For Productivity
- ✅ **notion** - Manage Notion workspace
- ✅ **obsidian** - Work with Markdown vault
- ✅ **himalaya** - CLI email management

### For Media
- ✅ **openai-whisper** - Speech to text
- ✅ **openai-image-gen** - Generate images

---

## 🔄 Automatic Setup Script

Run this to install recommended tools:

```bash
# Windows
bash skills.sh

# Or manually:
winget install GitHub.cli ffmpeg
pip install openai-whisper himalaya
npm install -g @modelcontextprotocol/inspector
```

---

## 📊 Skills Status Dashboard

Check your Moltbot dashboard (https://192.168.2.110) under **Agent → Skills** to see:
- ✓ Ready skills (enabled)
- ✗ Missing dependencies
- Skill descriptions and capabilities

---

## ⚙️ Environment Setup

Add to your shell profile (~/.bashrc, ~/.zshrc, or $PROFILE on PowerShell):

```bash
# Add Moltbot to PATH
export PATH="/c/Program Files/GitHub CLI:$PATH"

# Python tools
export PATH="$HOME/.local/bin:$PATH"
```

---

## 🆘 Troubleshooting

### "gh: command not found" after winget install
- Close and reopen terminal
- Check PATH: `echo $PATH`
- Reinstall: `winget install GitHub.cli --force`

### Skills not detected after installation
- Reload Moltbot: `taskkill /PID <gateway-pid> /F`
- Restart gateway: `moltbot gateway --bind lan`

### Python tools not found
- Verify pip: `pip --version`
- Install: `python -m pip install --upgrade pip`

---

**Last Updated:** 2026-03-05
**Moltbot Version:** 2026.1.27-beta.1
