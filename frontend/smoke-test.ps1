$ErrorActionPreference = 'Stop'
$api = 'http://localhost:5000'
$email = "smoketest+$([System.Guid]::NewGuid().ToString().Substring(0,8))@example.com"
$pass = 'Secret123!'
Write-Host "Using API: $api"
Write-Host "Signup with email: $email"
try {
    $signup = Invoke-RestMethod -Method Post -Uri "$api/api/auth/signup" -ContentType 'application/json' -Body (@{ email = $email; password = $pass } | ConvertTo-Json)
    Write-Host "Signup: OK"
} catch {
    Write-Host "Signup failed: $_"
}

try {
    $login = Invoke-RestMethod -Method Post -Uri "$api/api/auth/login" -ContentType 'application/json' -Body (@{ email = $email; password = $pass } | ConvertTo-Json)
    $token = $login.token
    Write-Host "Login: received token length" ($token.Length)
} catch {
    Write-Host "Login failed: $_"
    exit 1
}

$hdr = @{ Authorization = "Bearer $token" }

try {
    $create = Invoke-RestMethod -Method Post -Uri "$api/api/vault" -Headers $hdr -ContentType 'application/json' -Body (@{ title = 'Smoke Item'; username = 'alice'; password = 'ENCRYPTED_STRING'; url = 'https://example.com'; notes = 'smoke' } | ConvertTo-Json)
    $id = $create._id
    Write-Host "Created item id: $id"
} catch {
    Write-Host "Create failed: $_"
    exit 1
}

try {
    $all = Invoke-RestMethod -Method Get -Uri "$api/api/vault" -Headers $hdr
    $count = 0
    if ($all -is [System.Array]) { $count = $all.Length } elseif ($all) { $count = 1 }
    Write-Host "Vault items count: $count"
} catch {
    Write-Host "Get items failed: $_"
}

try {
    $updates = @{ title = 'Smoke Item Updated'; password = 'NEW_ENC' }
    $updated = Invoke-RestMethod -Method Put -Uri "$api/api/vault/$id" -Headers $hdr -ContentType 'application/json' -Body ($updates | ConvertTo-Json)
    Write-Host "Updated item title: $($updated.title)"
} catch {
    Write-Host "Update failed: $_"
}

try {
    $del = Invoke-RestMethod -Method Delete -Uri "$api/api/vault/$id" -Headers $hdr
    Write-Host "Delete response: $($del | ConvertTo-Json)"
} catch {
    Write-Host "Delete failed: $_"
}

Write-Host "Smoke test finished"
