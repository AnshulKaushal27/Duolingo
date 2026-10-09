@echo off
echo Starting Duolingo Backend API (FastAPI)...
cd /d "%~dp0backend"
call .\venv\Scripts\activate.bat
python run.py
pause
