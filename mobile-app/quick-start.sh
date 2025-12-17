#!/bin/bash
# Quick Start Script for School Management Mobile App

echo "🎓 School Management Mobile App - Quick Start"
echo "=============================================="
echo ""

# Check if in correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the mobile-app directory"
    echo "Usage: cd e:\SchoolSoftware\mobile-app && ./quick-start.sh"
    exit 1
fi

echo "📦 Step 1: Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🔧 Step 2: Configuration check..."
echo ""
echo "⚠️  IMPORTANT: Configure your API URL"
echo "   1. Find your computer's IP: ipconfig"
echo "   2. Edit src/config/api.js"
echo "   3. Set BASE_URL to: http://YOUR_IP:5000/api"
echo ""
echo "Example: BASE_URL: 'http://192.168.1.100:5000/api'"
echo ""

read -p "Have you configured the API URL? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please configure API URL first, then run this script again"
    exit 1
fi

echo ""
echo "🚀 Step 3: Starting app..."
echo ""
echo "📱 Instructions:"
echo "   1. Install 'Expo Go' app on your phone"
echo "   2. Scan the QR code that appears"
echo "   3. App will load on your device"
echo ""
echo "🔐 Test Credentials:"
echo "   Student: student@demo.com / 123456"
echo "   Teacher: teacher@demo.com / 123456"
echo "   Staff: staff@demo.com / 123456"
echo ""

# Start Expo
npm start
