@echo off
title CareSync Launcher
color 0A

echo.
echo  ==========================================
echo    CareSync Development Launcher
echo  ==========================================
echo.

echo  [1/3] Starting Backend API...
start "CareSync - Backend API" cmd /k "cd /d "%~dp0backend" && venv\Scripts\uvicorn app.main:app --reload --port 8000"
timeout /t 3 /nobreak >nul

echo  [2/3] Starting Scheduler...
start "CareSync - Scheduler" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python -m app.workers.scheduler"
timeout /t 2 /nobreak >nul

echo  [3/3] Starting Frontend...
start "CareSync - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo  ==========================================
echo   All 3 services started!
echo.
echo   Backend API:  http://localhost:8000
echo   API Docs:     http://localhost:8000/docs
echo   Frontend:     http://localhost:5173
echo  ==========================================
echo.
pause
