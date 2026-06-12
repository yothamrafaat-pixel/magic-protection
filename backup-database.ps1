# Database Backup Script

$dbPath = "C:\Users\dell\magic-protection\prisma\magic-protection.db"
$backupDir = "C:\Users\dell\magic-protection\backups"
$backupFile = "$backupDir\magic-protection.db.backup"

# Create backups folder if not exists
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

# Delete old backup if exists
if (Test-Path $backupFile) {
    Remove-Item $backupFile -Force
    Write-Host "Old backup deleted"
}

# Copy new backup
if (Test-Path $dbPath) {
    Copy-Item $dbPath -Destination $backupFile -Force
    Write-Host "Backup created successfully"
    Write-Host "Location: $backupFile"
    Write-Host "Time: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    
    $fileSize = (Get-Item $backupFile).Length / 1MB
    Write-Host "Size: $([Math]::Round($fileSize, 2)) MB"
}
else {
    Write-Host "Error: Database not found at $dbPath"
}

Read-Host "Press Enter to close"
