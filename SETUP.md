# Setup Instructions

## Quick Start

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Go to **Project Settings** > **Service Accounts**
4. Click **"Generate new private key"**
5. Download the JSON file

### 2. Create Environment Variables

Create a file called `.env.local` in the project root:

```bash
# Firebase Configuration (from the JSON file you downloaded)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# Cron Secret (make this a random string)
CRON_SECRET=your-random-secret-string-here-make-it-long-and-random
```

**Tips:**
- The `FIREBASE_PRIVATE_KEY` must keep the `\n` characters and be wrapped in quotes
- Generate `CRON_SECRET` using: `openssl rand -base64 32`

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

Open in browser:
- **Customer View** (Tweet Feed): http://localhost:3000/customer/test
- **Seller View** (Settings): http://localhost:3000/seller-product/test

### 5. Test the App

1. Go to seller view: http://localhost:3000/seller-product/test
2. Add a Twitter username (e.g., `elonmusk`)
3. Wait ~30 seconds for the cron job to run (or manually trigger)
4. Go to customer view: http://localhost:3000/customer/test
5. You should see tweets appear!

### 6. Manually Trigger Cron Job (for testing)

```bash
curl -H "Authorization: Bearer your-random-secret-string-here-make-it-long-and-random" http://localhost:3000/api/cron/check-tweets
```

Replace the secret with your actual `CRON_SECRET` value.

## Deploy to Vercel

### 1. Push to GitHub

```bash
git remote add origin https://github.com/yourusername/twitter-monitor.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Add the same environment variables from `.env.local`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `CRON_SECRET`
5. Deploy!

### 3. Verify Cron Job

The cron job will automatically run every minute on Vercel. Check:
- Vercel Dashboard > Your Project > Cron Jobs
- Should show: `/api/cron/check-tweets` running every minute

## Troubleshooting

### Tweets not showing up?

1. **Check Firebase connection:**
   - Make sure environment variables are set correctly
   - Verify the Firebase service account has Firestore permissions

2. **Check cron job:**
   ```bash
   # Check logs in Vercel Dashboard
   # Or test locally:
   curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/check-tweets
   ```

3. **Check Twitter username:**
   - Make sure it exists and has recent tweets
   - Try a popular account like `elonmusk` first

### Firebase errors?

- Make sure you created Firestore Database (not Realtime Database)
- Go to Firebase Console > Firestore Database > Create Database
- Start in production mode

### Cron job not running on Vercel?

- Make sure `vercel.json` exists
- Cron jobs only work on production deployments (not previews)
- Check Vercel Dashboard > Settings > Cron Jobs

## Next Steps

1. **Add your own branding** - Update the Footer component
2. **Customize colors** - Edit `tailwind.config.ts`
3. **Add more features**:
   - Multiple accounts
   - Tweet filtering
   - Push notifications
   - Analytics

## Support

Built by [@edisonisgrowing](https://twitter.com/edisonisgrowing)

Need help? Create an issue on GitHub or DM on Twitter!
