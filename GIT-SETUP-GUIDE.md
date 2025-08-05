# Git Setup Guide for VeganMapAI

## Initial Setup (if not already done)

1. **Initialize Git Repository**
   ```bash
   git init
   ```

2. **Configure Git User (if needed)**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

## Current Project Status

The project already has a comprehensive `.gitignore` file that excludes:
- Node modules and dependencies
- Environment variables (.env files)
- Build outputs
- Upload directories
- Temporary files
- IDE-specific files

## Recommended Commit Structure

### 1. Initial Commit (if starting fresh)
```bash
git add .
git commit -m "Initial commit: VeganMapAI - Full-stack vegan restaurant discovery platform"
```

### 2. Feature-Based Commits

**Mobile Optimizations:**
```bash
git add client/src/components/mobile/
git add client/src/hooks/useSwipeGesture.ts
git commit -m "feat: Add mobile optimizations with 44px touch targets and swipe gestures"
```

**Welcome Overlay:**
```bash
git add client/src/components/onboarding/WelcomeOverlay.tsx
git add client/src/pages/home.tsx
git commit -m "feat: Add welcome overlay for first-time user onboarding"
```

**AI Search Modal:**
```bash
git add client/src/components/ai/AISearchModal.tsx
git commit -m "feat: Optimize AI search modal for mobile with bottom sheet style"
```

## Clean Up Before Committing

1. **Remove the git lock file (if it exists):**
   ```bash
   rm -f .git/index.lock
   ```

2. **Check current status:**
   ```bash
   git status
   ```

3. **View changes:**
   ```bash
   git diff
   ```

## Branching Strategy (Recommended)

```bash
# Create development branch
git checkout -b development

# Feature branches
git checkout -b feature/mobile-optimizations
git checkout -b feature/welcome-overlay
git checkout -b feature/ai-improvements

# Merge back to development
git checkout development
git merge feature/mobile-optimizations
```

## Remote Repository Setup

1. **Create a new repository on GitHub/GitLab/Bitbucket**

2. **Add remote origin:**
   ```bash
   git remote add origin https://github.com/yourusername/veganmapai.git
   ```

3. **Push to remote:**
   ```bash
   git push -u origin main
   ```

## Important Files to Track

Make sure these key files are tracked:
- `replit.md` - Project documentation
- `package.json` - Dependencies
- `client/` - All frontend code
- `server/` - All backend code
- `shared/` - Shared schemas and types
- Configuration files (vite.config.ts, tsconfig.json, etc.)

## Files Already Ignored

The `.gitignore` properly excludes:
- `node_modules/`
- `.env` files
- `uploads/` directory
- `attached_assets/` directory
- Build outputs
- Temporary files

## Next Steps

1. Open the Shell in Replit
2. Run `git status` to see current state
3. Stage and commit your changes
4. Set up a remote repository if needed
5. Push your code

Remember to commit regularly with meaningful messages that describe what changed and why!