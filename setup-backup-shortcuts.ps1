# Setup Database Backup and Restore Shortcuts
# Run this script once to create both shortcuts on your desktop

Write-Host "Setting up database backup and restore shortcuts..."
Write-Host ""

# Create Backup Shortcut
$shell = New-Object -ComObject WScript.Shell
$backupShortcut = [System.IO.Path]::Combine([Environment]::GetFolderPath("Desktop"), "BackupDatabase.lnk")
$backupScript = "C:\Users\dell\magic-protection\backup-database.ps1"

$shortcut = $shell.CreateShortcut($backupShortcut)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$backupScript`""
$shortcut.WorkingDirectory = "C:\Users\dell\magic-protection"
$shortcut.IconLocation = "C:\Windows\System32\shell32.dll,265"
$shortcut.Description = "Backup Database"
$shortcut.Save()

Write-Host "Created: BackupDatabase.lnk"

# Create Restore Shortcut
$restoreShortcut = [System.IO.Path]::Combine([Environment]::GetFolderPath("Desktop"), "RestoreDatabase.lnk")
$restoreScript = "C:\Users\dell\magic-protection\restore-database.ps1"

$shortcut = $shell.CreateShortcut($restoreShortcut)
$shortcut.TargetPath = "powershell.exe"
$shortcut.Arguments = "-NoProfile -ExecutionPolicy Bypass -File `"$restoreScript`""
$shortcut.WorkingDirectory = "C:\Users\dell\magic-protection"
$shortcut.IconLocation = "C:\Windows\System32\shell32.dll,262"
$shortcut.Description = "Restore Database"
$shortcut.Save()

Write-Host "Created: RestoreDatabase.lnk"
Write-Host ""
Write-Host "Setup complete! Both shortcuts are now on your desktop."
Write-Host ""
Write-Host "Usage:"
Write-Host "  BackupDatabase.lnk  - Click to create a backup"
Write-Host "  RestoreDatabase.lnk - Click to restore from backup"
Write-Host ""

Read-Host "Press Enter to close"
