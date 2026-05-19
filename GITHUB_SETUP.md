# 📋 GitHub Setup for Deployment

**Status**: Git repository exists, but remote not configured  
**Next Step**: Add your GitHub remote

---

## Quick Setup

You need to create a repository on GitHub first, then run these commands:

### 1️⃣ Create Repository on GitHub

1. Go to https://github.com/new
2. **Repository name**: `JoDash` (or your preferred name)
3. **Description**: "Kids Daily Planner MVP - Open source scheduler for children"
4. **Public** (required for free GitHub Pages)
5. **Don't initialize** with README (we already have one)
6. Click **Create repository**

### 2️⃣ Connect Local Repo to GitHub

After creating the repository, you'll see setup instructions. Run:

```bash
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/JoXel33/JoDash.git
git branch -M main
git push -u origin main
```

**Example**:
```bash
git remote add origin https://github.com/JoXel33/JoDash.git
git branch -M main
git push -u origin main
```

### 3️⃣ Deploy to GitHub Pages

Once remote is set up:

```bash
npx gh-pages -d out
```

This will:
- Create a `gh-pages` branch
- Push the `/out/` contents to GitHub Pages
- Make your app live at: `https://JoXel33.github.io/JoDash/`

---

## Manual Deployment (Alternative)

If gh-pages fails, do this instead:

```bash
# 1. Commit all current changes
git add .
git commit -m "feat: MVP ready for deployment to GitHub Pages"
git push origin main

# 2. Create/update gh-pages branch
git checkout --orphan gh-pages
git rm -rf .

# 3. Copy built files
Copy-Item -Path "out\*" -Destination "." -Recurse -Force

# 4. Commit and push
git add .
git commit -m "Deploy MVP to GitHub Pages"
git push origin gh-pages --force

# 5. Return to main branch
git checkout main
```

---

## Verify Setup

```bash
git remote -v
# Should show:
# origin  https://github.com/JoXel33/JoDash.git (fetch)
# origin  https://github.com/JoXel33/JoDash.git (push)
```

---

## After Deployment

1. Go to repo **Settings** → **Pages**
2. Verify **Source** is set to `gh-pages` branch
3. Wait 1-2 minutes for build
4. Visit: `https://JoXel33.github.io/JoDash/`

---

**Next**: Follow the setup steps above, then run `npx gh-pages -d out`
