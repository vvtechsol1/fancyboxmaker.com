@echo off
REM ===== Case Bazar - Development server =====
REM Double-click this file to start the website in development mode.
REM Then open http://localhost:3000 in your browser.

set "PATH=C:\xampp\htdocs\nodejs;%PATH%"
cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies for the first time...
  call npm install
)

echo.
echo Starting Case Bazar dev server...
echo Open http://localhost:3000 in your browser.
echo Press Ctrl+C to stop.
echo.
call npm run dev
pause
