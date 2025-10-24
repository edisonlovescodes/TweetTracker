# Twitter Monitor - Whop App

Get instant notifications when your favorite Twitter accounts post!

## Features

- 🎯 **Instant Notifications**: Tweet links appear within 30-60 seconds of posting
- 🎨 **Custom Design**: Clean, minimal interface with custom color scheme
- 💰 **100% Free**: No Twitter API costs - uses Nitter RSS feeds
- ⚡ **Auto-Refresh**: Feed updates automatically every 10 seconds
- 🔧 **Simple Setup**: Easy configuration for community owners

## Tech Stack

- **Frontend**: Next.js 14 + React + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Twitter Data**: Nitter RSS (free, no API key needed)
- **Hosting**: Vercel (with cron jobs)

## Setup Instructions

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Save the JSON file

### 2. Environment Variables

Create a `.env.local` file:

```bash
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"

# Cron Secret (generate a random string)
CRON_SECRET=your-random-secret-string-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Locally

```bash
npm run dev
```

Visit:
- Customer feed: `http://localhost:3000/customer/test-experience`
- Settings: `http://localhost:3000/seller-product/test-experience`

### 5. Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The cron job will automatically run every minute to check for new tweets.

## How It Works

1. **Background Job**: Runs every 60 seconds via Vercel Cron
2. **Twitter Monitoring**: Uses Nitter RSS feeds (5 instance fallbacks for reliability)
3. **Database**: Stores monitored accounts and tweets in Firestore
4. **Real-Time Feed**: Customer page auto-refreshes every 10 seconds

## Cost

- **Development**: $0/month
- **Firebase**: Free tier (up to 50k reads/day)
- **Vercel**: Free tier (includes cron jobs)
- **Twitter API**: $0 (using Nitter)

## Color Scheme

- Background: `#FCF6F5` (cream)
- Text: `#141212` (dark)
- Accent: `#FA4616` (orange-red)

## MVP Limitations

- 1 monitored account per community
- Updates every 60 seconds (not true real-time)
- Uses Nitter RSS (can be rate-limited)

## Future Enhancements

- Multiple accounts per community
- WebSocket for true real-time updates
- Push notifications
- Tweet filtering by keywords
- Analytics dashboard

## Built by

[@edisonisgrowing](https://twitter.com/edisonisgrowing)

Want an app like this for your community? I build custom apps for communities. Clean, fast, and tailored to you.

## License

MIT
