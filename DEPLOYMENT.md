# 🚀 PDF Master Deployment Guide

This application is built as a **Client-Side SaaS**. All PDF processing happens in the user's browser using `pdf-lib` and WebAssembly. This makes it extremely cheap to host because you don't need a heavy backend for file processing.

---

## 1. Static Hosting (Recommended: Vercel / Netlify / GitHub Pages)
Since the app uses `HashRouter`, it is perfectly suited for static hosting.

### Vercel / Netlify
1. Create a new project in your dashboard.
2. Connect your GitHub repository.
3. **Build Command:** (Leave empty if you aren't using a bundler) or `npm run build` if using Vite.
4. **Output Directory:** `.` (The root directory).
5. Click **Deploy**.

---

## 2. cPanel / Shared Hosting
1. Log in to your cPanel.
2. Open **File Manager** and navigate to `public_html`.
3. Upload all project files (`index.html`, `index.tsx`, `App.tsx`, etc.).
4. Ensure your hosting supports `.html` files.
5. Because we use `HashRouter`, you **do not** need to configure `.htaccess` for URL rewriting.

---

## 3. VPS Deployment (Nginx / Apache)
If using a Linux VPS, follow these steps for Nginx:

1. Install Nginx: `sudo apt update && sudo apt install nginx`
2. Upload files to `/var/www/pdf-master`.
3. Configure Nginx (`/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/pdf-master;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
4. Restart Nginx: `sudo systemctl restart nginx`

---

## 4. Environment Variables
If you integrate a real backend later:
- `API_KEY`: Your Google GenAI key (for OCR/AI features).
- `DATABASE_URL`: Your MySQL/MongoDB connection string.
- `AD_PUB_ID`: Your Google AdSense Publisher ID.

---

## 5. Production Checklist
- [ ] Change the `canonical` link in `index.html` to your actual domain.
- [ ] Replace `og-image.png` with your brand's social sharing image.
- [ ] Update the AdSense placeholder in `Layout.tsx` with your real script tags.
- [ ] Enable SSL (HTTPS) - this is **mandatory** for PDF processing and camera access.
