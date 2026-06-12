# Database Restore Script

$backupFile = "C:\Users\dell\magic-protection\backups\magic-protection.db.backup"
$dbPath = "C:\Users\dell\magic-protection\prisma\magic-protection.db"

Write-Host "Database Restore Tool"
Write-Host "====================="
Write-Host ""

if (-not (Test-Path $backupFile)) {
    Write-Host "ERROR: Backup file not found at $backupFile"
    Read-Host "Press Enter to close"
    exit
}

Write-Host "This will OVERWRITE the current database with the backup."
Write-Host "Backup location: $backupFile"
Write-Host ""
$confirm = Read-Host "Are you sure? Type 'YES' to proceed"

if ($confirm -eq "YES") {
    try {
        Copy-Item $backupFile -Destination $dbPath -Force
        Write-Host ""
        Write-Host "SUCCESS: Database restored from backup"
        Write-Host "Location: $dbPath"
        Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    }
    catch {
        Write-Host ""
        Write-Host "ERROR: Failed to restore database"
        Write-Host "Error: $_"
    }
}
else {
    Write-Host "Restore cancelled"
}

Read-Host "Press Enter to close"
