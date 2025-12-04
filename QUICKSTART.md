# Quick Start Guide

Get your MotoGP betting app running in 10 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Create Supabase Project (3 min)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **New Project**
3. Name it `motogp-betting`
4. Choose a database password and region
5. Wait ~2 minutes for project creation

## Step 3: Set Up Database (2 min)

In your Supabase project dashboard:

1. Go to **SQL Editor** → **New Query**
2. Copy contents of `supabase/schema.sql` → Paste → **Run**
3. New Query → Copy `supabase/seed-riders.sql` → Paste → **Run**
4. New Query → Copy `supabase/seed-races.sql` → Paste → **Run**

## Step 4: Configure Environment (2 min)

1. In Supabase, go to **Settings** → **API**
2. Copy these values:
   - Project URL
   - anon/public key
   - service_role key

3. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SERVICE_ROLE_KEY=your-service-key-here
ADMIN_PASSPHRASE=choose-secure-password
```

## Step 5: Create Test Players (1 min)

In Supabase **SQL Editor**, run:

```sql
INSERT INTO players (name, passphrase) VALUES
  ('TestPlayer', 'test123');
```

## Step 6: Start the App (1 min)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Test It Out!

1. Click **Login**
2. Enter:
   - Name: `TestPlayer`
   - Passphrase: `test123`
3. Go to **Dashboard**
4. Click **Make Prediction** on any race
5. Select riders and submit!

## Next Steps

- Invite friends: Add their names to the `players` table with passphrases
- Customize: Update rider/race data in Supabase
- Deploy: Push to GitHub → Import to Vercel → Add env vars → Deploy!

## Troubleshooting

### "Invalid credentials"
- Check that you created the player in Supabase
- Verify name and passphrase match exactly (case-sensitive)

### "Supabase connection error"
- Verify `.env.local` values are correct
- Make sure you copied the full URLs/keys (no spaces)
- Restart dev server after changing `.env.local`

### "No riders available"
- Make sure you ran `seed-riders.sql` in Supabase
- Check in **Table Editor** → **riders** that data exists

### Build errors
- Run `npm install` again
- Delete `.next` folder and rebuild
- Check Node.js version (needs 20.9.0+)

## Need Help?

- Check `README.md` for full documentation
- Review `supabase/README.md` for database details
- See `motogp-betting-spec.md` for complete specifications

---

**Pro Tip**: Before the 2025 season starts, verify the race calendar in `supabase/seed-races.sql` matches the official MotoGP schedule and update FP1 times accordingly!
