# Supabase Setup Guide (FREE - No Credit Card)

## Quick Start

### Step 1: Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project for free"
3. Sign up with **GitHub** (easiest) or email
4. **NO CREDIT CARD NEEDED** ✅

### Step 2: Create New Project
1. Click "New project"
2. Fill in:
   - **Project name:** `mirhapret`
   - **Database password:** Create a strong password (save it!)
   - **Region:** Choose closest to your location
3. Click "Create new project"
4. Wait 2-3 minutes for setup

### Step 3: Get Database Connection Details
After project is created:
1. Go to **Settings** (⚙️ icon) → **Database**
2. Under "Connection Info", copy these:
   - Host: `db.XXXXX.supabase.co`
   - Port: `5432`
   - Username: `postgres`
   - Password: The password you created
   - Database: `postgres`

### Step 4: Use in Render
When setting up Render environment variables, use:
```
DB_HOST=db.XXXXX.supabase.co
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<your-password>
DB_DATABASE=postgres
```

## Free Tier Details
- **Storage:** 500 MB
- **Projects:** 2 free projects
- **No credit card:** Ever
- **Perfect for:** Development & testing

## Connection Test (Optional)
You can test the connection locally:
```bash
psql -h db.XXXXX.supabase.co -U postgres -d postgres
# Enter your password when prompted
```

If you see a prompt, you're connected! ✅
