@echo off
echo ========================================
echo VoiceGuard GitHub Push Script
echo ========================================
echo.

set /p username="Enter your GitHub username: "

echo.
echo Setting up remote repository...
git remote add origin https://github.com/%username%/VoiceGuard-Hackathon.git
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo Done! Your repository is now at:
echo https://github.com/%username%/VoiceGuard-Hackathon
echo ========================================
echo.

start https://github.com/%username%/VoiceGuard-Hackathon

pause
