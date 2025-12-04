# Setup Checklist

Follow this checklist to get your MotoGP betting app running.

## ✅ Pre-Season Preparation

### 2. Championship Predictions
- [ ] Implement championship prediction form (see ROADMAP.md)
- [ ] Test championship prediction flow
- [ ] Lock championship predictions before first race

### 3. Admin Panel (Critical!)
- [ ] Build admin results entry page
- [ ] Build score calculation trigger
- [ ] Test end-to-end: enter results → calculate scores → verify leaderboard

## ✅ Season Launch (Before March 1, 2026)

### 1. Final Testing
- [ ] Test making predictions
- [ ] Test updating predictions before deadline
- [ ] Test deadline enforcement
- [ ] Test leaderboard calculations
- [ ] Test on mobile devices
- [ ] Test with all 9 friends

### 2. Communication
- [ ] Send reminder email/message to all players
- [ ] Share deadline for championship predictions
- [ ] Share deadline for Round 1 (Thailand) predictions
- [ ] Explain scoring system

### 3. Monitoring
- [ ] Set up error tracking (Sentry or similar)
- [ ] Set up analytics (Vercel Analytics)
- [ ] Monitor Supabase usage
- [ ] Set up uptime monitoring

## 📝 Notes

- **Passphrases**: Change the default passphrases in production!
- **Security**: Implement proper password hashing before launch (see ROADMAP.md)
- **Deadlines**: FP1 times in seed data are estimates - update with actual times
- **Backups**: Supabase auto-backups, but export data regularly
- **Support**: Create a group chat for technical support during season