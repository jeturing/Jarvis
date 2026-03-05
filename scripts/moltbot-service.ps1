#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Moltbot Gateway Service Launcher
    Automatically starts the Moltbot gateway on Windows startup

.DESCRIPTION
    This script starts the Moltbot gateway and keeps it running.
    It is designed to run as a Windows scheduled task at system startup.
#>

param(
    [switch]$Install = $false,
    [switch]$Uninstall = $false,
    [switch]$Run = $false
)

$gatewayDir = "C:\Users\admin\Downloads\Jarvis-main"
$logDir = "$env:LOCALAPPDATA\Moltbot\Logs"
$logFile = "$logDir\gateway-service.log"
$pidFile = "$env:LOCALAPPDATA\Moltbot\gateway.pid"
$taskName = "MoltbotGateway"

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] $Message"
    Write-Host $logMessage
    Add-Content -Path $logFile -Value $logMessage -Force
}

function Start-MoltbotGateway {
    Write-Log "Starting Moltbot Gateway..."
    
    # Create log directory if it doesn't exist
    if (-not (Test-Path $logDir)) {
        New-Item -ItemType Directory -Path $logDir -Force | Out-Null
    }
    
    try {
        Push-Location $gatewayDir
        
        # Start the gateway process
        $process = Start-Process -FilePath "node" `
            -ArgumentList "scripts/run-node.mjs gateway" `
            -PassThru `
            -NoNewWindow `
            -RedirectStandardOutput "$logDir\gateway-stdout.log" `
            -RedirectStandardError "$logDir\gateway-stderr.log"
        
        # Save PID
        if (-not (Test-Path "$env:LOCALAPPDATA\Moltbot")) {
            New-Item -ItemType Directory -Path "$env:LOCALAPPDATA\Moltbot" -Force | Out-Null
        }
        $process.Id | Out-File -FilePath $pidFile -Force
        
        Write-Log "Gateway started with PID $($process.Id)"
        
        # Wait for gateway to finish (this runs forever)
        Wait-Process -Id $process.Id
        
        Write-Log "Gateway process exited with code $($process.ExitCode)"
    }
    catch {
        Write-Log "ERROR: $_"
        exit 1
    }
    finally {
        Pop-Location
    }
}

function Install-Task {
    Write-Log "Installing scheduled task..."
    
    # Get the path to this script
    $scriptPath = $PSCommandPath
    
    # Create the action
    $action = New-ScheduledTaskAction -Execute "powershell.exe" `
        -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`" -Run"
    
    # Create the trigger (At startup, with a 10-second delay)
    $trigger = New-ScheduledTaskTrigger -AtStartup
    $trigger.Delay = "PT10S"
    
    # Create task settings
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable `
        -ExecutionTimeLimit (New-TimeSpan -Hours 0)
    
    # Register the task
    try {
        Register-ScheduledTask -TaskName $taskName `
            -Action $action `
            -Trigger $trigger `
            -Settings $settings `
            -RunLevel Highest `
            -Force | Out-Null
        
        Write-Log "Scheduled task installed successfully"
        Write-Host "`n✅ Moltbot Gateway will now start automatically on system startup!"
        Write-Host "   Task name: $taskName"
        Write-Host "   Logs: $logDir"
    }
    catch {
        Write-Log "ERROR installing task: $_"
        exit 1
    }
}

function Uninstall-Task {
    Write-Log "Uninstalling scheduled task..."
    
    try {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction SilentlyContinue | Out-Null
        Write-Log "Scheduled task uninstalled"
        Write-Host "✅ Moltbot Gateway auto-start disabled"
    }
    catch {
        Write-Log "ERROR uninstalling task: $_"
    }
}

# Main execution
if ($Install) {
    Install-Task
}
elseif ($Uninstall) {
    Uninstall-Task
}
elseif ($Run) {
    Start-MoltbotGateway
}
else {
    Write-Host "Moltbot Gateway Service Launcher"
    Write-Host ""
    Write-Host "Usage:"
    Write-Host "  -Install    Install auto-start task"
    Write-Host "  -Uninstall  Remove auto-start task"
    Write-Host "  -Run        Start the gateway (called by scheduled task)"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  powershell -ExecutionPolicy Bypass -File $PSCommandPath -Install"
    Write-Host "  powershell -ExecutionPolicy Bypass -File $PSCommandPath -Uninstall"
}
