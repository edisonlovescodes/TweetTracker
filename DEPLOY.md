# Deployment Guide

## Prerequisites

✅ Build successful locally
✅ Firebase project created
✅ GitHub repository ready

## Step-by-Step Deployment

### 1. Push to GitHub

If you haven't already:

```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/twitter-monitor-whop.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Import Project"** or **"Add New"** > **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `.next` (auto)

### 3. Add Environment Variables

In the Vercel deployment settings, add these environment variables:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour\nPrivate\nKey\nHere\n-----END PRIVATE KEY-----\n"
CRON_SECRET=your-random-secret-string
```

**Important Notes:**
- The `FIREBASE_PRIVATE_KEY` must include the quotes and `\n` characters
- To add in Vercel: Settings > Environment Variables > Add
- Add to **Production**, **Preview**, and **Development** (select all three)

### 4. Deploy

Click **"Deploy"**!

Vercel will:
- Install dependencies
- Build your Next.js app
- Deploy to production
- Set up the cron job automatically

### 5. Verify Cron Job

After deployment:

1. Go to your Vercel project dashboard
2. Click on **"Cron Jobs"** in the sidebar
3. You should see:
   ```
   /api/cron/check-tweets
   Schedule: * * * * * (every minute)
   ```

### 6. Test Your App

Once deployed, your app will be at:
```
https://your-project-name.vercel.app
```

Test URLs:
- Customer view: `https://your-project-name.vercel.app/customer/test`
- Seller view: `https://your-project-name.vercel.app/seller-product/test`

## Common Deployment Issues

### Build fails with Firebase errors

**Problem**: Firebase credentials not set correctly

**Solution**:
- Make sure all three Firebase env vars are set
- Check that `FIREBASE_PRIVATE_KEY` has quotes and `\n` characters
- Test locally first with `.env.local`

### Cron job not running

**Problem**: Cron jobs only work in production

**Solution**:
- Make sure you deployed to production (not preview)
- Check Vercel dashboard > Cron Jobs section
- Wait 1-2 minutes after deployment for cron to start

### API routes return 500 errors

**Problem**: Firebase connection failing

**Solution**:
1. Check Vercel logs: Project > Deployments > Latest > View Function Logs
2. Look for Firebase errors
3. Verify service account permissions in Firebase Console

### Tweets not showing up

**Problem**: Multiple possible causes

**Solution**:
1. Check that you added a Twitter account in seller view
2. Wait 1-2 minutes for first cron run
3. Check Vercel function logs for errors
4. Verify Firestore database exists in Firebase Console

## Monitoring

### View Logs

1. Vercel Dashboard > Your Project
2. Click on latest deployment
3. Go to **"Functions"** tab
4. Select `/api/cron/check-tweets`
5. View real-time logs

### Check Firestore

1. Go to Firebase Console
2. Click **"Firestore Database"**
3. You should see two collections:
   - `monitored_accounts` - Twitter usernames being monitored
   - `tweets` - Cached tweets

## Performance

### Expected Costs

- **Vercel Free Tier**: Up to 100GB bandwidth/month (plenty for small communities)
- **Firebase Free Tier**: Up to 50k reads/day (good for ~500 members)
- **Cron Jobs**: Included in Vercel (1 minute interval)

### Scaling

If you exceed free tiers:
- **Vercel Pro**: $20/month (more bandwidth + faster builds)
- **Firebase Blaze**: Pay-as-you-go (very cheap for small apps)

## Custom Domain (Optional)

1. Vercel Dashboard > Your Project > Settings > Domains
2. Add your domain: `tweets.yourcommunity.com`
3. Update DNS records as shown
4. Wait for SSL certificate (automatic)

## Updating the App

To deploy updates:

```bash
git add .
git commit -m "Your update message"
git push
```

Vercel automatically deploys on every push to `main`!

## Rollback

If something breaks:

1. Vercel Dashboard > Deployments
2. Find last working deployment
3. Click **"..."** menu > **"Promote to Production"**

Instant rollback!

## Support

Built by [@edisonisgrowing](https://twitter.com/edisonisgrowing)

Having deployment issues? Create an issue on GitHub or DM on Twitter!
