// import { productsData } from './data';

const API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : window.location.origin;

/** Script/diacritics + English demo keywords. UI stays English; this only picks which product pool to search. */
export function detectCulture(text) {
  const raw = (text || '').trim();
  if (!raw) return null;
  if (/[\u0600-\u06FF]/.test(raw)) return 'ar';
  if (/[\u0900-\u0D7F]/.test(raw)) return 'hi'; // Covers Devanagari, Bengali, Telugu, Tamil, etc.
  if (/[àáâãçéêíóôõúü]/i.test(raw)) return 'pt';

  const lower = raw.toLowerCase();
  
  // UK demo: map english regional keywords to the indian culture
  if (/\b(telugu|tamil|malayalam|kannada|bengali|hindi|indian|india)\b/.test(lower)) return 'hi';
  if (/\b(arabic|arab|lebanese|lebanon|syrian|syria)\b/.test(lower)) return 'ar';
  if (/\b(brazilian|brazil|portuguese)\b/.test(lower)) return 'pt';
  if (/\b(chinese|china|mandarin|cantonese)\b/.test(lower)) return 'zh';

  // UK thyme demo: English queries must still filter to the 13 curated ar listings, not all 46 products.
  if (/\b(thyme|wild thyme|dried thyme|fresh thyme)\b/.test(lower)) return 'ar';
  if (/\bza['\u2019]?atar\b/i.test(lower) || /\bzaatar\b/i.test(lower)) return 'ar';

  return null;
}

export async function searchProducts(query, cultureFilter, sort, category, location) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (cultureFilter) params.set('culture', cultureFilter);
  if (sort) params.set('sort', sort);
  if (category) params.set('category', category);
  if (location) params.set('location', location);

  try {
    const res = await fetch(`${API_BASE}/api/products?${params.toString()}`);
    if (!res.ok) throw new Error('API Error');
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch products', err);
    return [];
  }
}

export async function trackEvent(eventType, targetId, location, metadata = {}) {
  try {
    // Generate a simple session ID if one doesn't exist
    let sessionId = sessionStorage.getItem('rooted_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('rooted_session_id', sessionId);
    }

    await fetch(`${API_BASE}/api/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        userId: sessionId,
        location: location || 'Unknown',
        targetId,
        metadata
      })
    });
  } catch (err) {
    console.error('Telemetry failed:', err);
  }
}

export function getCultureName(culture, t) {
  if (!culture) return t('all_cultures');
  if (culture === 'ar') return t('culture_arabic');
  if (culture === 'hi') return t('culture_indian');
  if (culture === 'pt') return t('culture_brazilian');
  return culture.charAt(0).toUpperCase() + culture.slice(1);
}

/** Community average from seeded reviews + optional extra reviews (same formula everywhere). */
export function getProductAverageRating(product, extraReviews = []) {
  const samples = product.reviewSamples || [];
  const all = [...samples, ...extraReviews];
  if (all.length === 0) return Math.round(product.score_authenticity * 10) / 10;
  const sum = all.reduce((acc, r) => acc + Number(r.rating), 0);
  return Math.round((sum / all.length) * 10) / 10;
}

export function formatAvgRating(value) {
  return (Math.round(value * 10) / 10).toFixed(1);
}

/** Snap product authenticity to the 0.5-step rating slider (0–10). */
export function authenticityToSliderValue(score) {
  const n = Math.max(0, Math.min(10, Number(score)));
  return Math.round(n * 2) / 2;
}
