# PowerShell Static Web Server
$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "=================================================="
    Write-Host " SERVER ONLINE: http://localhost:$port/"
    Write-Host " Press Ctrl+C to stop the server"
    Write-Host "=================================================="
} catch {
    Write-Host "Failed to start listener on port $port. Check if port is in use."
    Exit
}

$basePath = "C:\Users\xeon5\.gemini\antigravity\scratch\satellite-globe"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath
        Write-Host "Incoming Request: $($request.HttpMethod) $urlPath"
        
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Clean path and join
        $urlPath = $urlPath -replace '/', '\'
        if ($urlPath.StartsWith('\')) {
            $urlPath = $urlPath.Substring(1)
        }
        $filePath = Join-Path $basePath $urlPath
        
        # If not found at root, check inside the public folder (matches Vite's behavior)
        if (-not (Test-Path $filePath -PathType Leaf)) {
            $publicFilePath = Join-Path $basePath "public\$urlPath"
            if (Test-Path $publicFilePath -PathType Leaf) {
                $filePath = $publicFilePath
            }
        }
        
        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Identify MIME types
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "application/octet-stream"
            
            if ($ext -eq ".html") { $contentType = "text/html; charset=utf-8" }
            elseif ($ext -eq ".css") { $contentType = "text/css; charset=utf-8" }
            elseif ($ext -eq ".js") { $contentType = "application/javascript; charset=utf-8" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            elseif ($ext -eq ".jpg" -or $ext -eq ".jpeg") { $contentType = "image/jpeg" }
            elseif ($ext -eq ".json") { $contentType = "application/json; charset=utf-8" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            
            # CORS headers
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Cache-Control", "no-cache")
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "Response: 200 OK - $urlPath ($contentType)"
        } else {
            $response.StatusCode = 404
            $errText = "404 - File Not Found: $urlPath"
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes($errText)
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            Write-Host "Response: 404 Not Found - $urlPath"
        }
        $response.OutputStream.Close()
    } catch {
        # Silent fail for request aborts
    }
}
