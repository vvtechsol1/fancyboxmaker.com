@echo off
REM ===== Case Bazar - Production build & start =====
REM Builds the optimized site and serves it at http://localhost:3000

set "PATH=C:\xampp\htdocs\nodejs;%PATH%"
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

echo Building optimized production site...
call npm run build
if errorlevel 1 ( echo BUILD FAILED & pause & exit /b 1 )

echo.
echo Starting production server at http://localhost:3000
echo Press Ctrl+C to stop.
echo.
call npm start
pause
