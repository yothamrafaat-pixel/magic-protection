# Create Desktop Shortcut
$shell = New-Object -ComObject WScript.Shell
$desktopPath = [System.IO.Path]::Combine([Environment]::GetFolderPath("Desktop"), "BackupDatabase.lnk")
$scriptPath = "C:\Users\dell\magic-protection\backup-database.ps1"

$shortcut = $shell.CreateShortcut($desktopPath)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""
$shortcut.WorkingDirectory = "C:\Users\dell\magic-protection"
$shortcut.IconLocation = "C:\Windows\System32\shell32.dll,265"
$shortcut.Description = "Backup Database"
$shortcut.Save()

Write-Host "Done - Shortcut created on Desktop"
Start-Sleep -Seconds 2
