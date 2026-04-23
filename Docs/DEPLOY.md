# Rooted — Deployment Guide

## Prerequisites

Before deploying, you need accounts at:
| Service | Purpose | Cost |
|---|---|---|
| [GitHub](https://github.com) | Code hosting | Free |
| [Stripe](https://stripe.com) | Payments | Free (1.5% + 20p/transaction) |
| [Resend](https://resend.com) | Order confirmation emails | Free (3,000/month) |
| [Railway](https://railway.app) | Backend hosting | Free tier |
| [Vercel](https://vercel.com) | Frontend hosting | Free |

---

## Step 1 — Stripe Setup

1. Sign up at [stripe.com](https://stripe.com)
2. Complete identity verification (required for live payouts)
3. Go to **Developers → API Keys**
4. Copy:
   - **Publishable key** (`pk_live_...`) → goes in Vercel env vars
   - **Secret key** (`sk_live_...`) → goes in Railway env vars (**never share this**)

> **Test first:** Use `pk_test_...` and `sk_test_...` until you've verified everything works end-to-end.

---

## Step 2 — Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → Create key → copy it
3. Go to **Domains** → Add your sending domain (or use `onboarding@resend.dev` for testing)
4. Update `EMAIL_FROM` in Railway env vars once your domain is verified

---

## Step 3 — Push to GitHub

```bash
# In the Rooted root directory:
git init                          # (if not already a git repo)
git add .
git commit -m "Initial production release"
git remote add origin https://github.com/YOUR_USERNAME/rooted.git
git push -u origin main
```

> ⚠️ Make sure `.gitignore` is in place before `git add .` — it prevents `.env` files from being committed.

---

## Step 4 — Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Select your **`Rooted`** repo
3. Set the **Root Directory** to `backend`
4. Railway auto-detects Node.js — it will run `node server.js` via the `Procfile`
5. Go to **Variables** and add:

| Variable | Value |
|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` (or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | (set up next) |
| `RESEND_API_KEY` | `re_...` |
| `EMAIL_FROM` | `orders@yourdomain.com` or `onboarding@resend.dev` |
| `FRONTEND_URL` | `https://your-app.vercel.app` (set after Vercel deploy) |
| `PORT` | `3000` |

6. After deploy, note your Railway URL: `https://rooted-backend.up.railway.app`

---

## Step 5 — Set Up Stripe Webhook

1. In Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://rooted-backend.up.railway.app/api/webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy the **Signing secret** (`whsec_...`) → add to Railway as `STRIPE_WEBHOOK_SECRET`

---

## Step 6 — Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your **`Rooted`** GitHub repo
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Vite — build command: `npm run build`, output: `dist`
5. Go to **Settings → Environment Variables** and add:

| Variable | Value |
|---|---|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` (or `pk_test_...`) |
| `VITE_API_URL` | `https://rooted-backend.up.railway.app` |

6. Redeploy (environment variable changes require a redeploy)

---

## Step 7 — Final Check

1. Visit your Vercel URL
2. Add something to cart → go to Checkout
3. Use Stripe test card: `4242 4242 4242 4242` | Expiry: `12/34` | CVC: `123`
4. Check Stripe Dashboard → **Payments** to see the charge
5. Check your email for the order confirmation
6. Check Railway logs for any errors

### Test Cards

| Card Number | Result |
|---|---|
| `4242 4242 4242 4242` | ✅ Succeeds |
| `4000 0000 0000 9995` | ❌ Declined (insufficient funds) |
| `4000 0025 0000 3155` | 🔐 Requires 3D Secure |

---

## Going Live

When ready to take real payments:
1. Complete Stripe KYC (identity + bank account verification)
2. Switch from `pk_test_` / `sk_test_` to `pk_live_` / `sk_live_` in your env vars
3. Update the Stripe webhook endpoint to use your live webhook secret
4. Redeploy both Railway and Vercel

---

## Local Development with Stripe

To test webhooks locally, use the Stripe CLI:

```bash
stripe listen --forward-to http://localhost:3000/api/webhook
```

This gives you a local `STRIPE_WEBHOOK_SECRET` to use in your `.env`.
