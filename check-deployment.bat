@echo off
echo ================================================
echo IONOS Deployment - Pre-Upload Checklist
echo ================================================
echo.

echo [1/5] Checking if dist folder exists...
if exist "dist\" (
    echo    ✓ dist folder found
) else (
    echo    ✗ dist folder NOT found - Run: npm run build
    goto :end
)

echo.
echo [2/5] Checking for index.html...
if exist "dist\index.html" (
    echo    ✓ index.html found
) else (
    echo    ✗ index.html NOT found
    goto :end
)

echo.
echo [3/5] Checking for .htaccess...
if exist "dist\.htaccess" (
    echo    ✓ .htaccess found in dist
) else (
    if exist "public\.htaccess" (
        echo    ! .htaccess found in public but NOT in dist
        echo    ! Run: npm run build
    ) else (
        echo    ✗ .htaccess NOT found
    )
)

echo.
echo [4/5] Checking for assets folder...
if exist "dist\assets\" (
    echo    ✓ assets folder found
) else (
    echo    ✗ assets folder NOT found
)

echo.
echo [5/5] Listing dist contents...
echo    Contents of dist folder:
dir /b dist
echo.

echo ================================================
echo READY TO UPLOAD!
echo ================================================
echo.
echo Upload ALL files from the 'dist' folder to IONOS:
echo   - Use FTP (FileZilla) or IONOS File Manager
echo   - Upload to: /html or /public_html directory
echo   - Make sure .htaccess is uploaded!
echo.
echo After upload, test these URLs:
echo   https://traveligo.in/hotels-admin
echo   https://traveligo.in/hotels-register
echo.
echo ================================================

:end
pause
