@echo off
cd /d "%~dp0"

set "PYEXE="

rem Use the Python bundled with this DSH installation when present.
if exist "%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe" (
  set "PYEXE=%USERPROFILE%\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\python\python.exe"
)

if not defined PYEXE (
  where py >nul 2>nul
  if %errorlevel%==0 set "PYEXE=py"
)

if not defined PYEXE (
  where python >nul 2>nul
  if %errorlevel%==0 set "PYEXE=python"
)

if not defined PYEXE (
  echo Python 3 was not found.
  echo Install Python, or use the preview URL provided in the delivery message.
  pause
  exit /b 1
)

start "He Siyu portfolio preview" "%PYEXE%" serve.py
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:4173/"
exit /b 0
