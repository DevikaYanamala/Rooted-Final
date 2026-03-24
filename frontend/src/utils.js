import { productsData } from './data';

/** Script/diacritics + English demo keywords. UI stays English; this only picks which product pool to search. */
export function detectCulture(text) {
  const raw = (text || '').trim();
  if (!raw) return null;
  if (/[\u0600-\u06FF]/.test(raw)) return 'ar';
  if (/[\u0900-\u097F]/.test(raw)) return 'hi';
  if (/[àáâãçéêíóôõúü]/i.test(raw)) return 'pt';

  const lower = raw.toLowerCase();
  // UK thyme demo: English queries must still filter to the 13 curated ar listings, not all 46 products.
  if (/\b(thyme|wild thyme|dried thyme|fresh thyme)\b/.test(lower)) return 'ar';
  if (/\bza['\u2019]?atar\b/i.test(lower) || /\bzaatar\b/i.test(lower)) return 'ar';

  return null;
}

export function searchProducts(query, cultureFilter) {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter((tok) => tok.length >= 2);

  const pool = cultureFilter
    ? productsData.filter(p => p.culture === cultureFilter)
    : productsData;

  if (!q) return pool;

  const scored = pool.map(product => {
    const fields = [
      product.name.toLowerCase(),
      ...(product.tags || []).map(t => t.toLowerCase()),
      ...(product.keywords || []).map(k => k.toLowerCase()),
      product.store.toLowerCase(),
      (product.nativeDesc || '').toLowerCase(),
    ];

    let score = 0;
    const nameLower = product.name.toLowerCase();
    for (const field of fields) {
      if (field.includes(q) || q.includes(field)) score += 5;
      for (const tok of tokens) {
        if (tok !== q && field.includes(tok)) score += 2;
      }
    }
    if (nameLower.includes(q)) score += 10;
    for (const tok of tokens) {
      if (tok !== q && nameLower.includes(tok)) score += 3;
    }

    return { ...product, _score: score };
  });

  return scored.sort((a, b) => b._score - a._score);
}

export function getCultureName(culture, t) {
  if (culture === 'ar') return t('culture_arabic');
  if (culture === 'hi') return t('culture_indian');
  if (culture === 'pt') return t('culture_brazilian');
  return t('all_cultures');
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
