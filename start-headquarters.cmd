@echo off
setlocal
cd /d "%~dp0"
echo Starting WiseForgeStudio Headquarters...
echo Root: %cd%
echo Press Ctrl+C to stop.
node src\server.mjs --host 127.0.0.1 --port 4786
