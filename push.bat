@echo off
title Push Gokulavasan Portfolio to GitHub
echo ===================================================
echo Pushing portfolio to:
echo https://github.com/gokulavasan123456sssg-sys/gokulavasanportfolio03
echo ===================================================
set "PATH=%~dp0.tools\git\cmd;%~dp0.tools\node-v20.18.0-win-x64;%PATH%"
git push -u origin main
echo.
pause
