#!/bin/bash
# Moltbot Skills Installation Script
# Installs CLI tools and dependencies for Moltbot skills

set -e

echo "🦞 Moltbot Skills Setup"
echo "========================"

# Detect OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
    INSTALLER="winget"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
    INSTALLER="brew"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
    INSTALLER="apt"
else
    OS="unknown"
fi

echo "Detected OS: $OS"

# Function to install via winget (Windows)
install_winget() {
    local package=$1
    local name=$2
    echo "📦 Installing $name via winget..."
    if command -v winget &> /dev/null; then
        winget install "$package" --accept-source-agreements --accept-package-agreements || echo "⚠️  Failed to install $name"
    else
        echo "❌ winget not found. Please install Windows Package Manager."
    fi
}

# Function to install via brew (macOS)
install_brew() {
    local package=$1
    local name=$2
    echo "📦 Installing $name via brew..."
    if command -v brew &> /dev/null; then
        brew install "$package" || echo "⚠️  Failed to install $name"
    else
        echo "❌ brew not found. Install Homebrew first: https://brew.sh"
    fi
}

# Function to install npm package globally
install_npm() {
    local package=$1
    local name=$2
    echo "📦 Installing $name via npm..."
    npm install -g "$package" || echo "⚠️  Failed to install $name"
}

# Install based on OS
if [ "$OS" = "windows" ]; then
    echo ""
    echo "🪟 Windows Installation"
    echo "----------------------"

    # GitHub CLI
    if ! command -v gh &> /dev/null; then
        install_winget "GitHub.cli" "GitHub CLI (gh)"
    else
        echo "✅ GitHub CLI already installed"
    fi

    # Node.js (if not installed)
    if ! command -v node &> /dev/null; then
        install_winget "OpenJS.NodeJS" "Node.js"
    else
        echo "✅ Node.js already installed"
    fi

    # Git
    if ! command -v git &> /dev/null; then
        install_winget "Git.Git" "Git"
    else
        echo "✅ Git already installed"
    fi

    # VS Code
    if ! command -v code &> /dev/null; then
        echo "ℹ️  VS Code not installed (optional). Install with:"
        echo "   winget install Microsoft.VisualStudioCode"
    else
        echo "✅ VS Code already installed"
    fi

elif [ "$OS" = "macos" ]; then
    echo ""
    echo "🍎 macOS Installation"
    echo "--------------------"

    # Homebrew
    if ! command -v brew &> /dev/null; then
        echo "📦 Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    fi

    # GitHub CLI
    if ! command -v gh &> /dev/null; then
        install_brew "gh" "GitHub CLI"
    else
        echo "✅ GitHub CLI already installed"
    fi

    # Apple Notes (memo CLI)
    if ! command -v memo &> /dev/null; then
        install_brew "memo" "Apple Notes CLI"
    else
        echo "✅ Apple Notes CLI already installed"
    fi

    # iMessage CLI
    if ! command -v imsg &> /dev/null; then
        echo "ℹ️  iMessage CLI not available via brew (requires manual setup)"
    else
        echo "✅ iMessage CLI already installed"
    fi

elif [ "$OS" = "linux" ]; then
    echo ""
    echo "🐧 Linux Installation"
    echo "---------------------"

    # Update package manager
    sudo apt-get update || true

    # GitHub CLI
    if ! command -v gh &> /dev/null; then
        echo "📦 Installing GitHub CLI..."
        curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages focal main" | sudo tee /etc/apt/sources.list.d/github-cli.sources > /dev/null
        sudo apt-get update
        sudo apt-get install gh
    else
        echo "✅ GitHub CLI already installed"
    fi

    # Git
    if ! command -v git &> /dev/null; then
        sudo apt-get install -y git
    else
        echo "✅ Git already installed"
    fi
fi

# npm packages (all platforms)
echo ""
echo "📚 Installing npm packages..."
echo "----------------------------"

# mcporter
if ! command -v mcporter &> /dev/null; then
    install_npm "@modelcontextprotocol/inspector" "MCP Inspector"
else
    echo "✅ MCP Inspector already installed"
fi

# Other useful npm tools
# install_npm "whisper-cli" "OpenAI Whisper"  # Optional: for speech-to-text
# install_npm "codexbar" "CodexBar"  # Optional: for cost tracking

echo ""
echo "✅ Skills installation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Verify installations: moltbot skills"
echo "2. Some skills may require authentication (GitHub, MCP servers, etc.)"
echo "3. For full feature support, check the skill descriptions"
echo ""
