# Quick Start Script for School Management Mobile App
# PowerShell version for Windows

Write-Host ""
Write-Host "🎓 School Management Mobile App - Quick Start" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Please run this script from the mobile-app directory" -ForegroundColor Red
    Write-Host "Usage: cd e:\SchoolSoftware\mobile-app" -ForegroundColor Yellow
    Write-Host "       .\quick-start.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Step 1: Checking dependencies..." -ForegroundColor Green

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔧 Step 2: Configuration check..." -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Configure your API URL" -ForegroundColor Yellow
Write-Host "   1. Find your computer's IP:" -ForegroundColor White
Write-Host "      ipconfig" -ForegroundColor Cyan
Write-Host "   2. Edit src/config/api.js" -ForegroundColor White
Write-Host "   3. Set BASE_URL to: http://YOUR_IP:5000/api" -ForegroundColor White
Write-Host ""
Write-Host "Example: BASE_URL: 'http://192.168.1.100:5000/api'" -ForegroundColor Magenta
Write-Host ""

# Get computer's IP
try {
    $ip = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Select-Object -First 1).IPAddress
    if ($ip) {
        Write-Host "💡 Your IP appears to be: $ip" -ForegroundColor Green
        Write-Host "   Use: http://${ip}:5000/api" -ForegroundColor Cyan
        Write-Host ""
    }
} catch {
    # Silently continue if can't detect IP
}

$response = Read-Host "Have you configured the API URL? (y/n)"

if ($response -ne "y" -and $response -ne "Y") {
    Write-Host ""
    Write-Host "Please configure API URL first, then run this script again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Step 3: Starting app..." -ForegroundColor Green
Write-Host ""
Write-Host "📱 Instructions:" -ForegroundColor Cyan
Write-Host "   1. Install 'Expo Go' app on your phone from:" -ForegroundColor White
Write-Host "      Android: Google Play Store" -ForegroundColor White
Write-Host "      iOS: Apple App Store" -ForegroundColor White
Write-Host "   2. Scan the QR code that will appear below" -ForegroundColor White
Write-Host "   3. App will load on your device!" -ForegroundColor White
Write-Host ""
Write-Host "🔐 Test Credentials:" -ForegroundColor Cyan
Write-Host "   Student: student@demo.com / 123456" -ForegroundColor White
Write-Host "   Teacher: teacher@demo.com / 123456" -ForegroundColor White
Write-Host "   Staff: staff@demo.com / 123456" -ForegroundColor White
Write-Host ""
Write-Host "Starting Expo development server..." -ForegroundColor Yellow
Write-Host ""

# Start Expo
npm start
