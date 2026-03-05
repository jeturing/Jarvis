$WshShell = New-Object -ComObject WScript.Shell
$startupDir = $env:APPDATA + "\Microsoft\Windows\Start Menu\Programs\Startup"
$shortcutPath = $startupDir + "\Moltbot-Gateway.lnk"
$shortcut = $WshShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "C:\Users\admin\Downloads\Jarvis-main\scripts\start-gateway.bat"
$shortcut.WindowStyle = 7
$shortcut.WorkingDirectory = "C:\Users\admin\Downloads\Jarvis-main"
$shortcut.Description = "Moltbot Gateway Auto-Start"
$shortcut.Save()
Write-Host "✅ Shortcut created: $shortcutPath"
