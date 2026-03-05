@echo off
REM Moltbot Gateway Auto-Start Script
REM This script starts the Moltbot gateway on Windows startup

cd /d "C:\Users\admin\Downloads\Jarvis-main"

REM Wait 5 seconds for network to be ready
timeout /t 5 /nobreak

REM Start the gateway in a separate window (minimized)
start /min "Moltbot Gateway" node scripts/run-node.mjs gateway

REM Create a log file entry
echo [%date% %time%] Moltbot Gateway started >> "%LOCALAPPDATA%\Moltbot\startup.log"
