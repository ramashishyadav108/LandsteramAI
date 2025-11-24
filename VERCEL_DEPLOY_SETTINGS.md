# 🚨 VERCEL DEPLOYMENT - CRITICAL SETTINGS

## ⚠️ IMPORTANT: Vercel Project Settings

When deploying to Vercel, you **MUST** configure these settings **EXACTLY** as shown:

### 1️⃣ Project Configuration (During Initial Setup)

```
Root Directory: frontend
```
**☑️ Click "Edit" and type "frontend"** - This is CRITICAL!

```
Framework Preset: Vite
```
**☑️ Select "Vite" from dropdown** - Let Vercel auto-detect

```
Build Command: (leave empty or use default)
```
**☑️ Leave as default** - Vercel will use `npm run build`

```
Output Directory: (leave empty or use default)
```
**☑️ Leave as default** - Vercel will use `dist`

```
Install Command: (leave empty or use default)
```
**☑️ Leave as default** - Vercel will use `npm install`

### 2️⃣ Environment Variables

Add this AFTER backend is deployed:

```env
VITE_API_BASE_URL=https://your-backend-url.vercel.app
```

---

## 🔧 If Already Created Project - Update Settings

1. Go to: **Project Settings** → **General**
2. Scroll to: **Build & Development Settings**
3. Update:
   - **Root Directory**: `frontend` ← MUST BE SET!
   - **Framework Preset**: Vite
   - Leave other fields as default

4. **Save** changes
5. Go to: **Deployments** tab
6. Click: **Redeploy** on latest deployment

---

## 🎯 Why This Works

- Setting **Root Directory to "frontend"** tells Vercel to run build from `/frontend` folder
- This makes paths like `/src/main.tsx` resolve correctly
- Vercel will automatically detect Vite and use correct build command

---

## ✅ Verification After Deployment

Build logs should show:
```
✓ 97 modules transformed.
dist/index.html                          0.46 kB
dist/assets/*.css                       76.41 kB
dist/assets/*.js                       273.75 kB
✓ built in ~2s
```

---

## 🚀 Quick Deploy Checklist

- [ ] Root Directory set to `frontend`
- [ ] Framework Preset set to `Vite`
- [ ] Environment variable `VITE_API_BASE_URL` added
- [ ] Latest code pushed to GitHub
- [ ] Triggered redeploy

**That's it!** The configuration is now correct. Just ensure Root Directory is set properly in Vercel! 🎉
