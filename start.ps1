$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root
$port = 5500
$url = "http://localhost:$port/"

function Find-Node {
  $cmd = Get-Command node -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $paths = @(
    "$env:ProgramFiles\nodejs\node.exe",
    "${env:ProgramFiles(x86)}\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
  )
  foreach ($item in $paths) {
    if (Test-Path $item) { return $item }
  }
  return $null
}

$node = Find-Node
if ($node) {
  Write-Host "Starting JavaScript backend at $url"
  Start-Process $url
  & $node "backend\server.js"
  exit $LASTEXITCODE
}

Write-Host "Node.js not found. Starting built-in local server at $url"
Add-Type -AssemblyName System.Web
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($url)
try {
  $listener.Start()
} catch {
  Write-Host "Could not start server on port $port. Close the other app using this port and try again."
  exit 1
}

Start-Process $url
Write-Host "Open $url in your browser. Press Ctrl+C to stop."

$mime = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
}

function Read-Db {
  Get-Content (Join-Path $root "backend\db.json") -Raw | ConvertFrom-Json
}

function Write-JsonFile($path, $data) {
  $data | ConvertTo-Json -Depth 8 | Set-Content -Path $path -Encoding UTF8
}

function Send-Json($res, $status, $obj) {
  $json = $obj | ConvertTo-Json -Depth 8
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $res.StatusCode = $status
  $res.ContentType = "application/json; charset=utf-8"
  $res.Headers.Add("Access-Control-Allow-Origin", "*")
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
  $res.Close()
}

function Read-Body($req) {
  $reader = New-Object System.IO.StreamReader($req.InputStream, $req.ContentEncoding)
  $raw = $reader.ReadToEnd()
  $reader.Close()
  if ([string]::IsNullOrWhiteSpace($raw)) { return @{} }
  return $raw | ConvertFrom-Json
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $req = $ctx.Request
    $res = $ctx.Response
    $path = [System.Web.HttpUtility]::UrlDecode($req.Url.AbsolutePath)

    try {
      if ($path.StartsWith("/api/")) {
        if ($req.HttpMethod -eq "OPTIONS") {
          $res.StatusCode = 204
          $res.Headers.Add("Access-Control-Allow-Origin", "*")
          $res.Headers.Add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
          $res.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
          $res.Close()
          continue
        }

        $db = Read-Db
        $route = $path.TrimEnd("/")

        if ($req.HttpMethod -eq "GET" -and $route -eq "/api/site") {
          $payload = @{
            name = $db.site.name
            shortName = $db.site.shortName
            tagline = $db.site.tagline
            phone = $db.site.phone
            phoneAlt = $db.site.phoneAlt
            email = $db.site.email
            address = $db.site.address
            inquiryWhatsapp = $db.site.inquiryWhatsapp
            socials = $db.site.socials
            hero = $db.hero
            about = $db.about
            features = $db.features
          }
          Send-Json $res 200 $payload
          continue
        }
        if ($req.HttpMethod -eq "GET" -and $route -eq "/api/courses") {
          Send-Json $res 200 $db.courses
          continue
        }
        if ($req.HttpMethod -eq "GET" -and $route.StartsWith("/api/courses/")) {
          $slug = $route.Split("/")[-1]
          $course = $db.courses | Where-Object { $_.slug -eq $slug } | Select-Object -First 1
          if ($null -eq $course) { Send-Json $res 404 @{ message = "Course not found" } } else { Send-Json $res 200 $course }
          continue
        }
        if ($req.HttpMethod -eq "GET" -and $route -eq "/api/colleges") { Send-Json $res 200 $db.colleges; continue }
        if ($req.HttpMethod -eq "GET" -and $route -eq "/api/testimonials") { Send-Json $res 200 $db.testimonials; continue }
        if ($req.HttpMethod -eq "GET" -and $route -eq "/api/stats") { Send-Json $res 200 $db.stats; continue }
        if ($req.HttpMethod -eq "GET" -and $route -eq "/api/why-choose") { Send-Json $res 200 $db.whyChoose; continue }

        if ($req.HttpMethod -eq "POST" -and $route -eq "/api/inquiries") {
          $body = Read-Body $req
          if (-not $body.name -or -not $body.phone -or -not $body.email -or -not $body.course) {
            Send-Json $res 400 @{ message = "Please fill name, email, phone and course." }
            continue
          }
          $file = Join-Path $root "backend\inquiries.json"
          $items = @()
          if (Test-Path $file) { $items = @(Get-Content $file -Raw | ConvertFrom-Json) }
          $inquiry = @{
            id = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
            name = $body.name
            phone = $body.phone
            email = $body.email
            course = $body.course
            message = $body.message
            createdAt = (Get-Date).ToString("o")
          }
          $items += $inquiry
          Write-JsonFile $file $items
          Send-Json $res 201 @{ message = "Thank you. Our counsellor will contact you soon."; inquiry = $inquiry }
          continue
        }

        if ($req.HttpMethod -eq "POST" -and $route -eq "/api/newsletter") {
          $body = Read-Body $req
          if (-not $body.phone) {
            Send-Json $res 400 @{ message = "Please enter a valid phone number." }
            continue
          }
          $file = Join-Path $root "backend\subscribers.json"
          $items = @()
          if (Test-Path $file) { $items = @(Get-Content $file -Raw | ConvertFrom-Json) }
          if (-not ($items | Where-Object { $_.phone -eq $body.phone })) {
            $items += @{ phone = $body.phone; createdAt = (Get-Date).ToString("o") }
            Write-JsonFile $file $items
          }
          Send-Json $res 201 @{ message = "Number WhatsApp par bheja ja raha hai." }
          continue
        }

        Send-Json $res 404 @{ message = "API route not found" }
        continue
      }

      if ($path -eq "/") { $path = "/index.html" }
      $relative = $path.TrimStart("/").Replace("/", [IO.Path]::DirectorySeparatorChar)
      $full = [IO.Path]::GetFullPath((Join-Path $root $relative))
      if (-not $full.StartsWith($root)) {
        $res.StatusCode = 403
        $res.Close()
        continue
      }
      if (-not (Test-Path $full)) {
        $res.StatusCode = 404
        $bytes = [Text.Encoding]::UTF8.GetBytes("Not found")
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
        $res.Close()
        continue
      }
      $ext = [IO.Path]::GetExtension($full).ToLower()
      $bytes = [IO.File]::ReadAllBytes($full)
      $res.StatusCode = 200
      $res.ContentType = $(if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" })
      $res.OutputStream.Write($bytes, 0, $bytes.Length)
      $res.Close()
    } catch {
      Send-Json $res 500 @{ message = $_.Exception.Message }
    }
  }
} finally {
  $listener.Stop()
}
