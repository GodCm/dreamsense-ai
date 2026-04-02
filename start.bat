@echo off
cd /d "%~dp0"
echo ================================
echo DreamSense AI - Setup Script
echo ================================
echo.

echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 goto :error

echo.
echo [2/4] Generating Prisma client...
call npx prisma generate
if errorlevel 1 goto :error

echo.
echo [3/4] Setting up database...
call npx prisma db push
if errorlevel 1 goto :error

echo.
echo [4/4] Starting development server...
echo.
echo =======================================
echo DONE! Open http://localhost:3000
echo =======================================
echo.
call npm run dev
goto :end

:error
echo.
echo [ERROR] Something went wrong!
pause
exit /b 1

:end
