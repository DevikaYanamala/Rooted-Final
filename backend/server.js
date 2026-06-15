import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Stripe from 'stripe';
import { Resend } from 'resend';
import mongoose from 'mongoose';
import { productsData } from './data.js';

// ── Database Connection ────────────────────────────────────────────────────────
const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
}

// ── Analytics Schema ───────────────────────────────────────────────────────────
const analyticsSchema = new mongoose.Schema({
  eventType: String, // e.g. 'search', 'click', 'purchase'
  userId: String,
  location: String,
  targetId: String,  // e.g. search query or product ID
  metadata: mongoose.Schema.Types.Mixed,
  timestamp: { type: Date, default: Date.now }
});
const AnalyticsLog = mongoose.model('AnalyticsLog', analyticsSchema);

// ── Clients ──────────────────────────────────────────────────────────────────
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express();
const port = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// CORS — allow localhost (dev) and all Vercel deployments (production)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, Postman, etc.)
      if (!origin) return callback(null, true);
      // Allow all localhost ports for local development
      if (/^http:\/\/localhost(:\d+)?$/.test(origin)) return callback(null, true);
      // Allow all Vercel preview and production deployments
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);
      // Allow custom domain if set
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

// ── Stripe webhook (MUST be raw body, BEFORE express.json) ───────────────────
app.post(
  '/api/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];

    if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).json({ error: 'Stripe not configured' });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('⚠️  Webhook signature failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const { customerEmail, customerName, items } = pi.metadata || {};

      console.log(`✅ Payment succeeded: £${(pi.amount / 100).toFixed(2)} — ${customerEmail}`);

      // Send confirmation email
      if (customerEmail && resend) {
        try {
          let parsedItems = [];
          try { parsedItems = JSON.parse(items || '[]'); } catch {}

          await resend.emails.send({
            from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
            to: customerEmail,
            subject: '🌿 Your Rooted order is confirmed!',
            html: buildOrderEmail({
              customerName,
              items: parsedItems,
              totalPence: pi.amount,
            }),
          });
          console.log(`📧 Confirmation email sent to ${customerEmail}`);
        } catch (e) {
          console.error('Email send failed:', e.message);
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      console.log(`❌ Payment failed: ${pi.last_payment_error?.message}`);
    }

    res.json({ received: true });
  }
);

// ── Body parser (after webhook route) ────────────────────────────────────────
app.use(express.json());

// ── Analytics Tracking Endpoint ──────────────────────────────────────────────
app.post('/api/analytics/track', async (req, res) => {
  if (!mongoURI) {
    // If no DB is connected, silently succeed so the frontend doesn't crash during dev
    return res.json({ success: true, message: 'DB not configured, skipped tracking.' });
  }
  try {
    const { eventType, userId, location, targetId, metadata } = req.body;
    const newLog = new AnalyticsLog({
      eventType, userId, location, targetId, metadata
    });
    await newLog.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Tracking Error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many payment requests. Please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// ── In-memory product store (seeded with mock data) ───────────────────────────
let products = [...productsData].map(p => {
  let category = 'groceries';
  if (p.id === 101) category = 'food';
  return { ...p, category };
});

// Mock items for the new categories to demonstrate the MVP flow
products.push({
  id: 102, name: 'Hyderabadi Dum Biryani', nativeDesc: 'హైదరాబాదీ దమ్ బిర్యానీ', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800', culture: 'hi', score_authenticity: 9.7, score_distance: 1.2, score_price: 14.50, store: 'Biryani House, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Biryani House', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Indian', 'Prepared Food', 'Biryani', 'Restaurant'], reviews: 342, keywords: ['biryani', 'hyderabad', 'indian', 'food'], reviewSamples: [], category: 'food'
});
products.push({
  id: 103, name: 'Authentic Masala Dosa', nativeDesc: 'మసాలా దోశ', img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?auto=format&fit=crop&q=80&w=800', culture: 'hi', score_authenticity: 9.5, score_distance: 2.0, score_price: 9.99, store: 'South Indian Cafe, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'South Indian Cafe', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Indian', 'Prepared Food', 'Dosa', 'Restaurant'], reviews: 215, keywords: ['dosa', 'south indian', 'food', 'breakfast'], reviewSamples: [], category: 'food'
});
products.push({
  id: 104, name: 'Punjabi Chole Bhature', nativeDesc: 'छोले भटूरे', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800', culture: 'hi', score_authenticity: 9.6, score_distance: 0.8, score_price: 11.50, store: 'Punjabi Dhaba, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Punjabi Dhaba', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Indian', 'Prepared Food', 'Punjabi', 'Restaurant'], reviews: 189, keywords: ['chole', 'bhature', 'punjabi', 'indian', 'food'], reviewSamples: [], category: 'food'
});

products.push({
  id: 201, name: 'Traditional Brass Pooja Thali', nativeDesc: 'पूजा थाली', img: 'https://images.unsplash.com/photo-1603513492128-ba7bfafbbc8f?auto=format&fit=crop&q=80&w=800', culture: 'hi', score_authenticity: 9.6, score_distance: 2.1, score_price: 25.00, store: 'Desi Decor, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Desi Decor', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Indian', 'Home', 'Decor', 'Pooja'], reviews: 45, keywords: ['brass', 'pooja', 'thali', 'home', 'decor', 'indian'], reviewSamples: [], category: 'home'
});
products.push({
  id: 301, name: 'Cotton Kurta Pajama Set', nativeDesc: 'कुर्ता पजामा', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=800', culture: 'hi', score_authenticity: 9.4, score_distance: 1.8, score_price: 45.00, store: 'Ethnic Wear UK, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'Ethnic Wear UK', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Indian', 'Fashion', 'Clothing', 'Kurta'], reviews: 112, keywords: ['kurta', 'pajama', 'clothing', 'fashion', 'indian'], reviewSamples: [], category: 'fashion'
});
products.push({
  id: 401, name: 'Patanjali Ayurvedic Hair Oil', nativeDesc: 'पतंजलि केश कांति', img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800', culture: 'hi', score_authenticity: 9.5, score_distance: 0.9, score_price: 8.50, store: 'AyurCare Store, Newcastle', location: 'Newcastle upon Tyne', retailerName: 'AyurCare Store', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Indian', 'Wellness', 'Ayurveda', 'Hair'], reviews: 89, keywords: ['patanjali', 'hair', 'oil', 'ayurvedic', 'wellness'], reviewSamples: [], category: 'wellness'
});

// Mock items for China
products.push({
  id: 501, name: 'Lao Gan Ma Chili Crisp', nativeDesc: '老干妈', img: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&q=80&w=800', culture: 'zh', score_authenticity: 9.8, score_distance: 1.5, score_price: 4.50, store: 'Oriental Supermarket', location: 'Newcastle upon Tyne', retailerName: 'Oriental Supermarket', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Chinese', 'Groceries', 'Sauce'], reviews: 450, keywords: ['chili', 'crisp', 'sauce', 'chinese', 'china'], reviewSamples: [], category: 'groceries'
});
products.push({
  id: 502, name: 'Authentic Sichuan Mapo Tofu', nativeDesc: '麻婆豆腐', img: 'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?auto=format&fit=crop&q=80&w=800', culture: 'zh', score_authenticity: 9.6, score_distance: 0.5, score_price: 12.00, store: 'Sichuan House', location: 'Newcastle upon Tyne', retailerName: 'Sichuan House', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Chinese', 'Food', 'Restaurant'], reviews: 220, keywords: ['mapo', 'tofu', 'chinese', 'food', 'china'], reviewSamples: [], category: 'food'
});
products.push({
  id: 503, name: 'Traditional Chinese Tea Set', nativeDesc: '茶具', img: 'https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?auto=format&fit=crop&q=80&w=800', culture: 'zh', score_authenticity: 9.5, score_distance: 2.2, score_price: 35.00, store: 'Eastern Home Decor', location: 'Newcastle upon Tyne', retailerName: 'Eastern Home Decor', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Chinese', 'Home', 'Tea'], reviews: 85, keywords: ['tea', 'set', 'chinese', 'china', 'home'], reviewSamples: [], category: 'home'
});

// Mock items for Brazil (Food, Home) to prevent empty category screens
products.push({
  id: 601, name: 'Authentic Feijoada Completa', nativeDesc: 'Feijoada', img: 'https://images.unsplash.com/photo-1541528658428-fb03983fceaa?auto=format&fit=crop&q=80&w=800', culture: 'pt', score_authenticity: 9.7, score_distance: 1.1, score_price: 18.00, store: 'Sabor do Brasil', location: 'Newcastle upon Tyne', retailerName: 'Sabor do Brasil', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Brazilian', 'Food', 'Restaurant'], reviews: 145, keywords: ['feijoada', 'brazil', 'brazilian', 'food'], reviewSamples: [], category: 'food'
});
products.push({
  id: 602, name: 'Havaianas Original', nativeDesc: 'Chinelo', img: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=800', culture: 'pt', score_authenticity: 9.9, score_distance: 1.5, score_price: 25.00, store: 'Brazilian Boutique', location: 'Newcastle upon Tyne', retailerName: 'Brazilian Boutique', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Brazilian', 'Fashion', 'Shoes'], reviews: 320, keywords: ['havaianas', 'chinelo', 'brazil', 'fashion'], reviewSamples: [], category: 'fashion'
});

// Mock items for Lebanon (Food, Home)
products.push({
  id: 701, name: 'Fresh Chicken Shawarma Wrap', nativeDesc: 'شاورما', img: 'https://images.unsplash.com/photo-1619881590082-a0b5b11ba9e4?auto=format&fit=crop&q=80&w=800', culture: 'ar', score_authenticity: 9.6, score_distance: 0.6, score_price: 8.50, store: 'Beirut Nights Express', location: 'Newcastle upon Tyne', retailerName: 'Beirut Nights Express', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Lebanese', 'Food', 'Restaurant'], reviews: 410, keywords: ['shawarma', 'lebanon', 'arabic', 'food'], reviewSamples: [], category: 'food'
});
products.push({
  id: 702, name: 'Handcrafted Olive Wood Bowl', nativeDesc: 'وعاء خشب زيتون', img: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&q=80&w=800', culture: 'ar', score_authenticity: 9.8, score_distance: 2.3, score_price: 42.00, store: 'Levant Artisans', location: 'Newcastle upon Tyne', retailerName: 'Levant Artisans', retailerUrl: '', retailerLogo: '', productUrl: '', tags: ['Lebanese', 'Home', 'Artisan'], reviews: 55, keywords: ['olive', 'wood', 'bowl', 'lebanon', 'arabic', 'home'], reviewSamples: [], category: 'home'
});

// ── Existing product routes ────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  let { culture, q, sort, category } = req.query;
  let result = products;

  if (category) {
    result = result.filter(p => p.category === category);
  }

  if (culture) {
    const cultureLower = culture.toLowerCase();
    let mappedCulture = culture;

    // Map user-typed search terms to our 3 mock data pools
    if (/\b(telugu|tamil|malayalam|kannada|bengali|hindi|indian|india)\b/.test(cultureLower)) {
      mappedCulture = 'hi';
    } else if (/\b(arabic|arab|lebanese|lebanon|middle east|syrian|syria)\b/.test(cultureLower)) {
      mappedCulture = 'ar';
    } else if (/\b(brazilian|brazil|portuguese)\b/.test(cultureLower)) {
      mappedCulture = 'pt';
    } else if (/\b(chinese|china|mandarin|cantonese)\b/.test(cultureLower)) {
      mappedCulture = 'zh';
    }

    // Only filter if it strictly matches one of our known pools, 
    // otherwise let it return empty so we accurately simulate 0 results.
    if (['hi', 'ar', 'pt', 'zh'].includes(mappedCulture)) {
      result = result.filter(p => p.culture === mappedCulture);
    } else {
      // DYNAMIC "WHOLE WORLD" FALLBACK
      const existing = products.filter(p => p.culture === mappedCulture && p.category === category);
      if (existing.length > 0) {
        result = existing;
      } else {
        const capCulture = culture.charAt(0).toUpperCase() + culture.slice(1);
        const dynamicItem = {
          id: products.length + 5000,
          name: category === 'food' ? `Authentic ${capCulture} Speciality` : category === 'home' ? `Traditional ${capCulture} Decor` : category === 'fashion' ? `${capCulture} Native Wear` : `Imported ${capCulture} Goods`,
          nativeDesc: capCulture,
          img: category === 'food' ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800',
          culture: mappedCulture,
          score_authenticity: 9.6,
          score_distance: 125.0, // Force far distance
          score_price: 24.50,
          store: `${capCulture} National Importers`,
          location: 'National Distribution',
          retailerName: `${capCulture} National Importers`,
          retailerUrl: 'https://amazon.co.uk',
          retailerLogo: '',
          productUrl: '',
          tags: [capCulture, 'Imported', 'Authentic'],
          reviews: 56,
          keywords: [culture.toLowerCase()],
          reviewSamples: [],
          category: category || 'groceries'
        };
        products.push(dynamicItem);
        result = [dynamicItem];
      }
    }
  }

  if (q) {
    const term = q.toLowerCase();
    const isIndicDemoTerm =
      /[\u0900-\u0D7F]/.test(term) ||
      /\b(telugu|tamil|malayalam|kannada|bengali|hindi|indian)\b/.test(term);

    result = result.filter(
      p =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.nativeDesc && p.nativeDesc.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.some(k => k && k.toLowerCase().includes(term))) ||
        (p.store && p.store.toLowerCase().includes(term)) ||
        (p.tags && p.tags.some(t => t && t.toLowerCase().includes(term))) ||
        (isIndicDemoTerm && p.culture === 'hi')
    );
  }

  if (sort) {
    result = [...result];
    if (sort === 'authenticity') {
      result.sort((a, b) => {
        if (b.score_authenticity !== a.score_authenticity)
          return b.score_authenticity - a.score_authenticity;
        return b.id - a.id;
      });
    } else if (sort === 'distance') {
      result.sort((a, b) => a.score_distance - b.score_distance);
    } else if (sort === 'price') {
      result.sort((a, b) => a.score_price - b.score_price);
    }
  }

  const userLoc = req.query.location || 'Newcastle upon Tyne';
  result = result.map(p => ({
    ...p,
    store: `${p.retailerName || 'Local Store'}, ${userLoc}`,
    location: userLoc
  }));

  res.json(result);
});

// Location-specific store data for major UK cities
const UK_STORE_MAP = {
  London: [
    { id: 's1', name: 'Tesco Express, Brick Lane', area: 'Shoreditch', distance: 0.4, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 51.5215, lng: -0.071 },
    { id: 's2', name: "Sainsbury's Local, Whitechapel", area: 'Tower Hamlets', distance: 0.9, stock: 'In stock', website: 'https://www.sainsburys.co.uk', lat: 51.5155, lng: -0.0596 },
    { id: 's3', name: 'ASDA Superstore, Barking', area: 'Barking', distance: 2.3, stock: 'Few left', website: 'https://www.asda.com', lat: 51.5362, lng: 0.0812 },
    { id: 's4', name: 'Waitrose, Canary Wharf', area: 'Docklands', distance: 1.5, stock: 'In stock', website: 'https://www.waitrose.com', lat: 51.5054, lng: -0.0235 },
  ],
  Manchester: [
    { id: 's1', name: 'Tesco Extra, Cheetham Hill', area: 'Cheetham Hill', distance: 0.6, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 53.5015, lng: -2.231 },
    { id: 's2', name: 'ASDA, Eastlands', area: 'Sportcity', distance: 1.1, stock: 'In stock', website: 'https://www.asda.com', lat: 53.4848, lng: -2.2003 },
    { id: 's3', name: 'Aldi, Rusholme', area: 'Rusholme', distance: 1.8, stock: 'Few left', website: 'https://www.aldi.co.uk', lat: 53.45, lng: -2.222 },
  ],
  Birmingham: [
    { id: 's1', name: 'Tesco Superstore, Aston', area: 'Aston', distance: 0.7, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 52.498, lng: -1.887 },
    { id: 's2', name: "Sainsbury's, Selly Oak", area: 'Selly Oak', distance: 1.4, stock: 'In stock', website: 'https://www.sainsburys.co.uk', lat: 52.441, lng: -1.938 },
    { id: 's3', name: 'ASDA, Small Heath', area: 'Small Heath', distance: 0.9, stock: 'Few left', website: 'https://www.asda.com', lat: 52.468, lng: -1.857 },
  ],
  Glasgow: [
    { id: 's1', name: 'Tesco Extra, Maryhill', area: 'Maryhill', distance: 0.8, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 55.889, lng: -4.27 },
    { id: 's2', name: 'ASDA, Toryglen', area: 'Toryglen', distance: 1.3, stock: 'In stock', website: 'https://www.asda.com', lat: 55.832, lng: -4.229 },
    { id: 's3', name: 'Lidl, Pollokshaws', area: 'Pollokshaws', distance: 1.9, stock: 'Few left', website: 'https://www.lidl.co.uk', lat: 55.828, lng: -4.279 },
  ],
  Leeds: [
    { id: 's1', name: 'Tesco Metro, Harehills', area: 'Harehills', distance: 0.5, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 53.812, lng: -1.513 },
    { id: 's2', name: 'Morrisons, Kirkstall', area: 'Kirkstall', distance: 1.2, stock: 'In stock', website: 'https://www.morrisons.com', lat: 53.81, lng: -1.583 },
    { id: 's3', name: 'ASDA, Killingbeck', area: 'Killingbeck', distance: 1.6, stock: 'Few left', website: 'https://www.asda.com', lat: 53.804, lng: -1.488 },
  ],
  Edinburgh: [
    { id: 's1', name: 'Tesco Express, Leith Walk', area: 'Leith', distance: 0.6, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 55.963, lng: -3.175 },
    { id: 's2', name: "Sainsbury's, Cameron Toll", area: 'Newington', distance: 1.0, stock: 'In stock', website: 'https://www.sainsburys.co.uk', lat: 55.933, lng: -3.164 },
    { id: 's3', name: 'Lidl, Gorgie', area: 'Gorgie', distance: 1.7, stock: 'Few left', website: 'https://www.lidl.co.uk', lat: 55.941, lng: -3.235 },
  ],
  Cardiff: [
    { id: 's1', name: 'Tesco Extra, Western Avenue', area: 'Canton', distance: 0.9, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 51.493, lng: -3.221 },
    { id: 's2', name: 'ASDA, Coryton', area: 'Coryton', distance: 1.5, stock: 'In stock', website: 'https://www.asda.com', lat: 51.521, lng: -3.223 },
    { id: 's3', name: "Sainsbury's, Thornhill", area: 'Thornhill', distance: 2.1, stock: 'Few left', website: 'https://www.sainsburys.co.uk', lat: 51.529, lng: -3.206 },
  ],
  Belfast: [
    { id: 's1', name: 'Tesco Extra, Knocknagoney', area: 'Knocknagoney', distance: 0.7, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 54.609, lng: -5.877 },
    { id: 's2', name: 'ASDA, Shore Road', area: 'Shore Road', distance: 1.1, stock: 'In stock', website: 'https://www.asda.com', lat: 54.628, lng: -5.922 },
    { id: 's3', name: "Sainsbury's, Forestside", area: 'Forestside', distance: 1.8, stock: 'Few left', website: 'https://www.sainsburys.co.uk', lat: 54.562, lng: -5.9 },
  ],
  'Newcastle upon Tyne': [
    { id: 's1', name: 'Tesco Extra, Kingston Park', area: 'Kingston Park', distance: 0.8, stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: 55.011, lng: -1.669 },
    { id: 's2', name: "Sainsbury's, Heaton", area: 'Heaton', distance: 1.2, stock: 'In stock', website: 'https://www.sainsburys.co.uk', lat: 54.987, lng: -1.583 },
    { id: 's3', name: 'ASDA, Byker', area: 'Byker', distance: 1.5, stock: 'Few left', website: 'https://www.asda.com', lat: 54.972, lng: -1.573 },
  ],
};

const UK_CITY_COORDS = {
  London: { lat: 51.5074, lng: -0.1278 },
  Manchester: { lat: 53.4808, lng: -2.2426 },
  Birmingham: { lat: 52.4862, lng: -1.8904 },
  Glasgow: { lat: 55.8642, lng: -4.2518 },
  Leeds: { lat: 53.8008, lng: -1.5491 },
  Edinburgh: { lat: 55.9533, lng: -3.1883 },
  Cardiff: { lat: 51.4816, lng: -3.1791 },
  Belfast: { lat: 54.5973, lng: -5.9301 },
  'Newcastle upon Tyne': { lat: 54.9783, lng: -1.6178 },
  'Barking': { lat: 51.5362, lng: 0.0812 },
  'IG11 9HZ': { lat: 51.5350, lng: 0.0850 },
};

function getCityBase(locationName) {
  const loc = locationName.trim();
  if (UK_CITY_COORDS[loc]) return UK_CITY_COORDS[loc];
  if (loc.toLowerCase().includes('ig11') || loc.toLowerCase().includes('barking')) {
    return UK_CITY_COORDS['Barking'];
  }
  return { lat: 53.5, lng: -2.0 };
}

function generateStoresForLocation(locationName) {
  const base = getCityBase(locationName);
  return [
    { id: 's1', name: `Tesco Express, ${locationName}`, area: locationName, distance: parseFloat((0.3 + Math.random() * 1.5).toFixed(1)), stock: 'In stock', website: 'https://www.tesco.com/groceries', lat: base.lat + 0.005, lng: base.lng + 0.003 },
    { id: 's2', name: `Sainsbury's Local, ${locationName}`, area: locationName, distance: parseFloat((0.8 + Math.random() * 2).toFixed(1)), stock: 'In stock', website: 'https://www.sainsburys.co.uk', lat: base.lat - 0.008, lng: base.lng - 0.005 },
    { id: 's3', name: `ASDA, ${locationName}`, area: locationName, distance: parseFloat((1.0 + Math.random() * 3).toFixed(1)), stock: 'Few left', website: 'https://www.asda.com', lat: base.lat + 0.012, lng: base.lng + 0.01 },
  ];
}

app.get('/api/products/:id', (req, res) => {
  const userLocation = req.query.location || 'Newcastle upon Tyne';
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) {
    let stores = [];
    const base = getCityBase(userLocation);
    const isBarking = userLocation.toLowerCase().includes('ig11') || userLocation.toLowerCase().includes('barking');
    
    // Check if it's a dynamically generated "far away" culture
    const isDynamicCulture = !['hi', 'ar', 'pt', 'zh'].includes(product.culture);

    if (isDynamicCulture) {
      stores = [
        { id: 's1', name: `${product.retailerName}`, area: 'Midlands Distribution Centre', distance: parseFloat((110 + Math.random() * 30).toFixed(1)), stock: 'Available Online', website: 'https://amazon.co.uk', lat: 52.5, lng: -1.5 }
      ];
    } else if (product.category === 'food') {
      if (isBarking) {
        stores = [
          { id: 's1', name: 'Eastern Paradise Restaurant', area: 'Ripple Road, Barking', distance: 0.8, stock: 'Available', website: 'https://thefork.com/eastern-paradise', lat: 51.534, lng: 0.082 }
        ];
      } else {
        stores = [
          { id: 's1', name: `${product.retailerName || 'Local Restaurant'}`, area: userLocation, distance: 1.2, stock: 'Available', website: product.retailerUrl || '', lat: base.lat + 0.005, lng: base.lng + 0.005 }
        ];
      }
    } else if (['home', 'fashion', 'wellness'].includes(product.category)) {
      stores = [
        { id: 's1', name: `${product.retailerName || 'Local Cultural Boutique'}`, area: userLocation, distance: 1.8, stock: 'In stock', website: product.retailerUrl || '', lat: base.lat - 0.005, lng: base.lng + 0.005 }
      ];
    } else {
      if (isBarking) {
        stores = [
          { id: 's1', name: 'ASDA Superstore, Barking', area: 'Barking IG11', distance: 1.1, stock: 'In stock', website: 'https://www.asda.com', lat: 51.5362, lng: 0.0812 }
        ];
      } else {
        stores = UK_STORE_MAP[userLocation] || generateStoresForLocation(userLocation);
      }
    }

    const localizedProduct = {
      ...product,
      userLocation,
      nearbyStores: stores.map(s => ({ ...s })).sort((a, b) => a.distance - b.distance),
    };
    res.json(localizedProduct);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.post('/api/products/:id/reviews', (req, res) => {
  const productId = parseInt(req.params.id);
  const { author, rating, text } = req.body;

  const productIndex = products.findIndex(p => p.id === productId);
  if (productIndex === -1) return res.status(404).json({ error: 'Product not found' });

  const product = products[productIndex];
  if (!product.reviewsList) product.reviewsList = [...product.reviewSamples];

  product.reviewsList.unshift({ author: author || 'Anonymous', rating: parseFloat(rating), text });
  product.reviews += 1;
  const oldTotal = product.score_authenticity * (product.reviews - 1);
  product.score_authenticity = Math.round(((oldTotal + parseFloat(rating)) / product.reviews) * 10) / 10;

  res.json(product);
});

// ── Payment Intent ─────────────────────────────────────────────────────────────
app.post('/api/create-payment-intent', paymentLimiter, async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ error: 'Payment system not configured. Please contact support.' });
  }

  try {
    const { items, email, name } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // ⚠️ Server-side total calculation — never trust amounts sent from the browser
    let totalPence = 0;
    const lineItems = [];

    for (const item of items) {
      const product = products.find(p => p.id === item.id);
      if (!product) return res.status(400).json({ error: `Product ${item.id} not found` });

      const qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
      const unitPrice = product.score_price || 0;
      totalPence += Math.round(unitPrice * 100) * qty;
      lineItems.push({ name: product.name, qty, price: unitPrice });
    }

    if (totalPence < 30) {
      return res.status(400).json({ error: 'Order total is below minimum (30p)' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPence,
      currency: 'gbp',
      automatic_payment_methods: { enabled: true },
      metadata: {
        customerEmail: email || '',
        customerName: name || '',
        items: JSON.stringify(lineItems),
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('PaymentIntent creation error:', err.message);
    res.status(500).json({ error: 'Failed to initialise payment. Please try again.' });
  }
});

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    stripe: !!stripe,
    email: !!resend,
    timestamp: new Date().toISOString(),
  });
});

// ── Email template ─────────────────────────────────────────────────────────────
function buildOrderEmail({ customerName, items, totalPence }) {
  const itemRows = items
    .map(
      i => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #f0ece6;color:#333;">${i.qty}× ${i.name}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #f0ece6;text-align:right;color:#333;">£${(i.price * i.qty).toFixed(2)}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:40px 0;background:#f9f6f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#5c4033 0%,#2d6a6a 100%);padding:36px 32px;text-align:center;">
      <p style="margin:0;font-size:32px;">🌿</p>
      <h1 style="margin:8px 0 4px;color:#fff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">Rooted</h1>
      <p style="margin:0;color:rgba(255,255,255,0.75);font-size:14px;">Authentic food, discovered.</p>
    </div>

    <!-- Body -->
    <div style="padding:32px;">
      <p style="color:#333;font-size:16px;margin:0 0 4px;">Hi ${customerName || 'there'} 👋</p>
      <p style="color:#666;font-size:15px;margin:0 0 24px;">Your order is confirmed. Here's a summary:</p>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        <thead>
          <tr style="background:#f9f6f2;">
            <th style="padding:10px 16px;text-align:left;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Item</th>
            <th style="padding:10px 16px;text-align:right;font-size:12px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td style="padding:14px 16px;font-weight:700;font-size:16px;color:#1a1a1a;">Total</td>
            <td style="padding:14px 16px;text-align:right;font-weight:700;font-size:16px;color:#2d6a6a;">£${(totalPence / 100).toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="background:#f0f7f7;border-radius:10px;padding:16px 20px;border-left:3px solid #2d6a6a;">
        <p style="margin:0;color:#2d6a6a;font-size:14px;font-weight:500;">✅ Payment received · Your authentic items are on their way!</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background:#f9f6f2;padding:20px 32px;text-align:center;">
      <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} Rooted. All rights reserved.</p>
      <p style="margin:4px 0 0;color:#ccc;font-size:11px;">If you have questions, reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Start ──────────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`🌿 Rooted backend running at http://localhost:${port}`);
    console.log(`   MongoDB: ${mongoURI ? '✅ configured' : '⚠️  not configured (set MONGODB_URI to track data)'}`);
    console.log(`   Stripe: ${stripe ? '✅ configured' : '⚠️  not configured (set STRIPE_SECRET_KEY)'}`);
    console.log(`   Email:  ${resend ? '✅ configured' : '⚠️  not configured (set RESEND_API_KEY)'}`);
  });
}

// Export for Vercel serverless functions
export default app;
