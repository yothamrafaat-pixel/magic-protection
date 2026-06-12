# Create Restore Shortcut
$shell = New-Object -ComObject WScript.Shell
$desktopPath = [System.IO.Path]::Combine([Environment]::GetFolderPath("Desktop"), "RestoreDatabase.lnk")
$scriptPath = "C:\Users\dell\magic-protection\restore-database.ps1"

$shortcut = $shell.CreateShortcut($desktopPath)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""
$shortcut.WorkingDirectory = "C:\Users\dell\magic-protection"
$shortcut.IconLocation = "C:\Windows\System32\shell32.dll,262"
$shortcut.Description = "Restore Database"
$shortcut.Save()

Write-Host "Done - Restore shortcut created on Desktop"
Start-Sleep -Seconds 2
