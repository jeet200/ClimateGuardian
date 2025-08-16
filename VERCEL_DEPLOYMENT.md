# Vercel Deployment Guide for Climate Guardian

## 🚀 Quick Fix for Network Error

### **Step 1: Environment Variables on Vercel**
Make sure these environment variables are set in your Vercel dashboard:

```
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/climate-guardian
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
GEMINI_API_KEY=your-gemini-api-key (optional)
OPENWEATHER_API_KEY=your-openweather-api-key (optional)
NODE_ENV=production
```

### **Step 2: MongoDB Atlas Setup**
1. Go to MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allocw connections from anywhere (Vercel IPs change)
3. Or add these Vercel IP ranges:
   - `76.76.19.0/24`
   - `64.23.132.0/24`

### **Step 3: Test Your Deployment**
1. Visit: `https://your-app.vercel.app/api/health`
2. Check if all environment variables show `true`
3. Verify MongoDB connection shows "connected"

### **Step 4: Debug Network Errors**
If still getting network errors:

1. **Check Browser Console** (F12) for detailed error messages
2. **Check Vercel Function Logs** in your Vercel dashboard
3. **Test API directly**: `https://your-app.vercel.app/api/auth/signup`

## 🔧 Common Issues & Solutions

### Issue 1: "Network Error"
- **Cause**: CORS or MongoDB connection issues
- **Fix**: Check environment variables and MongoDB Atlas network settings

### Issue 2: "500 Internal Server Error"
- **Cause**: Missing JWT_SECRET or MongoDB connection
- **Fix**: Ensure all required env vars are set in Vercel

### Issue 3: "CORS Error"
- **Cause**: Frontend trying to connect to wrong backend URL
- **Fix**: The new CORS config should handle all Vercel domains

## 📱 Test Signup Flow
1. Go to your Vercel app
2. Click "Sign Up"
3. Fill the form with valid data
4. If it works: ✅ Success!
5. If it fails: Check `/api/health` endpoint

## 🆘 Still Having Issues?
Check these in order:
1. Vercel environment variables
2. MongoDB Atlas network access
3. Browser console errors
4. Vercel function logs
