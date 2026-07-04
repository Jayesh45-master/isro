param(
    [string]$Token
)

$owner = "Jayesh45-master"
$repo = "isro"

Write-Host "=================================================="
Write-Host " GitHub Direct Repository Pusher (PowerShell)"
Write-Host " Target Repo: https://github.com/$owner/$repo"
Write-Host "=================================================="

if ([string]::IsNullOrEmpty($Token)) {
    $Token = Read-Host -Prompt "Enter your GitHub Personal Access Token (PAT)"
}
$token = $Token.Trim()

if ([string]::IsNullOrEmpty($token)) {
    Write-Error "Error: GitHub Personal Access Token is required!"
    exit 1
}

$headers = @{
    "Authorization" = "token $token"
    "User-Agent"    = "PowerShell-GitHub-Pusher"
    "Accept"        = "application/vnd.github.v3+json"
}

# 1. Check if Repo exists first
$repoExists = $false
try {
    $checkRepo = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo" -Method Get -Headers $headers
    $repoExists = $true
    Write-Host "Repository already exists. Proceeding to push updates."
} catch {
    if ($_.Exception.Message -match "404") {
        Write-Host "Repository does not exist. Attempting to create it..."
    } else {
        Write-Host "Warning checking repository: $_"
    }
}

if (-not $repoExists) {
    try {
        $body = @{
            name = $repo
            description = "3D Earth Globe & Sentinel Satellites Simulator"
            private = $false
        } | ConvertTo-Json
        
        $result = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        Write-Host "Successfully created repository: https://github.com/$owner/$repo"
    } catch {
        if ($_.Exception.Message -match "422") {
            Write-Host "Repository already exists. Proceeding to push updates."
        } else {
            Write-Error "Repository check/creation failed: $_"
            Write-Host "Please ensure your GitHub Personal Access Token has the necessary 'repo' scopes, or create the repository manually on GitHub first."
            exit 1
        }
    }
}

# 2. Collect files recursively, excluding node_modules, .git, and helper scripts
$files = Get-ChildItem -Path . -Recurse -File | Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\\.git\\" -and
    $_.Name -ne "push_to_github.js" -and
    $_.Name -ne "push_to_github.ps1"
}

Write-Host "`n[2/5] Preparing $($files.Count) files to upload..."

$treeItems = @()

foreach ($file in $files) {
    # Get relative path with forward slashes
    $relPath = Resolve-Path -Path $file.FullName -Relative
    $relPath = $relPath -replace "^\.\\", "" -replace "\\", "/"
    
    Write-Host " -> Uploading blob: $relPath"
    
    # Read file content as Base64 (supporting binary assets like textures)
    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $base64Content = [System.Convert]::ToBase64String($bytes)
    
    # Create Blob
    $blobBody = @{
        content = $base64Content
        encoding = "base64"
    } | ConvertTo-Json
    
    try {
        $blobResult = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/git/blobs" -Method Post -Headers $headers -Body $blobBody -ContentType "application/json"
        
        $treeItems += @{
            path = $relPath
            mode = "100644"
            type = "blob"
            sha  = $blobResult.sha
        }
    } catch {
        Write-Error "Failed to upload blob for ${relPath}: $_"
        exit 1
    }
}

Write-Host "`n[3/5] Constructing remote Git tree..."
$treeBody = @{
    tree = $treeItems
} | ConvertTo-Json -Depth 10

try {
    $treeResult = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/git/trees" -Method Post -Headers $headers -Body $treeBody -ContentType "application/json"
} catch {
    Write-Error "Failed to create tree: $_"
    exit 1
}

Write-Host "`n[4/5] Packaging commit message..."
$commitBody = @{
    message = "Deploy: 3D Earth Globe and Sentinel Satellites Simulator"
    tree = $treeResult.sha
} | ConvertTo-Json

try {
    $commitResult = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/git/commits" -Method Post -Headers $headers -Body $commitBody -ContentType "application/json"
} catch {
    Write-Error "Failed to create commit: $_"
    exit 1
}

Write-Host "`n[5/5] Updating branch head to point to new commit..."
$refBody = @{
    sha = $commitResult.sha
    force = $true
} | ConvertTo-Json

try {
    # Try updating main branch reference (if it exists)
    $refResult = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/git/refs/heads/main" -Method Patch -Headers $headers -Body $refBody -ContentType "application/json"
} catch {
    # If main branch doesn't exist, create it
    Write-Host "Branch main does not exist. Creating reference..."
    $refCreateBody = @{
        ref = "refs/heads/main"
        sha = $commitResult.sha
    } | ConvertTo-Json
    
    try {
        $refResult = Invoke-RestMethod -Uri "https://api.github.com/repos/$owner/$repo/git/refs" -Method Post -Headers $headers -Body $refCreateBody -ContentType "application/json"
    } catch {
        Write-Error "Failed to update main branch: $_"
        exit 1
    }
}

Write-Host "`n=================================================="
Write-Host " SUCCESS: Repository updated and deployed!"
Write-Host " View here: https://github.com/$owner/$repo"
Write-Host "=================================================="
