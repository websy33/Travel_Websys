# IONOS Deployment Instructions

## Problem Fixed
The 404 error on `/hotels-admin` and `/hotels-register` routes was caused by missing server configuration for Single Page Application (SPA) routing.

## Solution Applied
Added `.htaccess` file to handle client-side routing on Apache servers (IONOS uses Apache).

## Deployment Steps for IONOS

### Step 1: Build Your Project
```bash
npm run build
```

This will create a `dist` folder with all your production files.

### Step 2: Files to Upload to IONOS
Upload **ALL** contents from the `dist` folder to your IONOS web hosting:

```
dist/
  ├── index.html
  ├── .htaccess          ← IMPORTANT! This file enables routing
  ├── assets/
  │   ├── css/
  │   ├── js/
  │   └── images/
  └── all other files...
```

### Step 3: IONOS File Manager Upload
1. Log into your IONOS control panel
2. Go to **File Manager** or use **FTP**
3. Navigate to your website's root directory (usually `/html` or `/public_html`)
4. Upload ALL files from the `dist` folder
5. **Make sure `.htaccess` file is uploaded** (it might be hidden)

### Step 4: Enable .htaccess (If Needed)
If your IONOS hosting doesn't recognize .htaccess:
1. Contact IONOS support to enable "mod_rewrite"
2. Or check your hosting control panel for "Apache Modules" settings

### Step 5: Test Your Routes
After deployment, test these URLs:
- ✅ https://traveligo.in/
- ✅ https://traveligo.in/hotels
- ✅ https://traveligo.in/hotels-admin
- ✅ https://traveligo.in/hotels-register

All should work now!

## Alternative: Using FTP Client (FileZilla)
1. Download FileZilla
2. Connect to your IONOS FTP:
   - Host: ftp.traveligo.in (or provided by IONOS)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Navigate to `/html` or `/public_html`
4. Upload all `dist` folder contents
5. Make sure `.htaccess` is visible (View → Show hidden files)

## Troubleshooting

### If routes still show 404:
1. Check if `.htaccess` was uploaded successfully
2. Verify mod_rewrite is enabled on your hosting
3. Contact IONOS support: "Please enable mod_rewrite for my Apache server"

### If images don't load:
1. Check the paths in your code
2. Ensure all files from `public/` folder are in `dist/`

### If CSS/JS doesn't load:
1. Clear browser cache
2. Check browser console for errors
3. Verify file paths are correct

## Files Added/Modified
- ✅ Created: `public/.htaccess` (for IONOS deployment)
- ✅ Created: `.htaccess` (root, backup)
- ✅ Modified: `vite.config.js` (ensure .htaccess is copied)

## Important Notes
- The `.htaccess` file is hidden by default in file managers
- Make sure to upload it along with other files
- This file tells Apache to redirect all routes to index.html
- React Router will then handle the routing on the client side

## Your Hidden Admin URLs
- Admin Login: https://traveligo.in/hotels-admin
- Hotel Register: https://traveligo.in/hotels-register

These routes are now hidden from the public UI but work via direct URL access!
