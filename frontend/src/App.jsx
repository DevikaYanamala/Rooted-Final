import { useState, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Award, Tag, ArrowLeft, X } from 'lucide-react';
import { productsData } from './data';
import './App.css';

function detectCulture(text) {
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  if (/[àáâãçéêíóôõúü]/i.test(text)) return 'pt';
  return null;
}

function searchProducts(query, cultureFilter) {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  let pool = cultureFilter
    ? productsData.filter(p => p.culture === cultureFilter)
    : productsData;

  const scored = pool.map(product => {
    const nameMatch = product.name.toLowerCase().includes(q);
    const tagMatch = product.tags.some(t => t.toLowerCase().includes(q));
    const kwMatch = product.keywords.some(k => k.toLowerCase().includes(q));
    const storeMatch = product.store.toLowerCase().includes(q);

    let score = 0;
    if (nameMatch) score += 10;
    if (kwMatch) score += 5;
    if (tagMatch) score += 3;
    if (storeMatch) score += 2;

    return { ...product, searchScore: score };
  });

  const matches = scored.filter(p => p.searchScore > 0);
  if (matches.length > 0) return matches;

  // If nothing matches the query, show all products for the detected culture
  return pool;
}

function App() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [activeCulture, setActiveCulture] = useState(null);
  const [sortBy, setSortBy] = useState('authenticity');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [ratingValue, setRatingValue] = useState(7);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);

  const detectedCulture = useMemo(() => detectCulture(query), [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const culture = detectedCulture;
    if (culture) {
      i18n.changeLanguage(culture);
      document.documentElement.dir = culture === 'ar' ? 'rtl' : 'ltr';
    } else {
      i18n.changeLanguage('en');
      document.documentElement.dir = 'ltr';
    }

    setActiveCulture(culture);
    setSubmittedQuery(query);
    setHasSearched(true);
  };

  const handleReset = () => {
    setQuery('');
    setSubmittedQuery('');
    setHasSearched(false);
    setActiveCulture(null);
    setSortBy('authenticity');
    i18n.changeLanguage('en');
    document.documentElement.dir = 'ltr';
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setRatingValue(7);
    setRatingSubmitted(false);
  };

  const submitRating = () => {
    setRatingSubmitted(true);
    setTimeout(() => setSelectedProduct(null), 1800);
  };

  let results = searchProducts(submittedQuery, activeCulture);

  results = [...results].sort((a, b) => {
    if (sortBy === 'distance') return a.score_distance - b.score_distance;
    if (sortBy === 'price') return a.score_price - b.score_price;
    return b.score_authenticity - a.score_authenticity;
  });

  const isRTL = i18n.language === 'ar';

  return (
    <div className={`app ${hasSearched ? 'app--results' : ''} ${isRTL ? 'app--rtl' : ''}`}>

      {/* ── Landing state ── */}
      <AnimatePresence mode="wait">
        {!hasSearched && (
          <motion.div
            className="landing"
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.35 }}
          >
            <div className="landing__brand">
              <div className="landing__icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4C24 4 12 14 12 26a12 12 0 0 0 24 0C36 14 24 4 24 4Z" fill="var(--color-primary)" opacity="0.15"/>
                  <path d="M24 8C24 8 16 16 16 25a8 8 0 0 0 16 0C32 16 24 8 24 8Z" fill="var(--color-primary)" opacity="0.35"/>
                  <path d="M24 44V20" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M24 28C20 24 16 26 14 28" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  <path d="M24 22C28 18 32 20 34 22" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
              </div>
              <h1 className="landing__title">Rooted</h1>
              <p className="landing__tagline">{t('tagline')}</p>
            </div>

            <form className="search-form" onSubmit={handleSearch}>
              <div className="search-bar">
                <Search size={20} strokeWidth={2.5} />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('search_placeholder')}
                  autoFocus
                />
              </div>
              {detectedCulture && (
                <motion.p
                  className="culture-hint"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {t('detected_culture', {
                    culture: detectedCulture === 'ar' ? t('culture_arabic')
                      : detectedCulture === 'hi' ? t('culture_indian')
                      : t('culture_brazilian')
                  })}
                </motion.p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results state ── */}
      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            className="results-view"
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Compact header */}
            <header className="results-header">
              <button className="back-btn" onClick={handleReset} aria-label={t('back_to_search')}>
                <ArrowLeft size={20} />
              </button>

              <form className="search-form search-form--compact" onSubmit={handleSearch}>
                <div className="search-bar search-bar--sm">
                  <Search size={16} strokeWidth={2.5} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t('search_placeholder')}
                  />
                </div>
              </form>
            </header>

            {/* Sort pills */}
            <div className="sort-bar">
              {['authenticity', 'distance', 'price'].map((key) => (
                <button
                  key={key}
                  className={`sort-pill ${sortBy === key ? 'sort-pill--active' : ''}`}
                  onClick={() => setSortBy(key)}
                >
                  {key === 'authenticity' && <Award size={14} />}
                  {key === 'distance' && <MapPin size={14} />}
                  {key === 'price' && <Tag size={14} />}
                  {t(`sort_${key === 'authenticity' ? 'authentic' : key}`)}
                </button>
              ))}
            </div>

            {/* Product list */}
            {results.length === 0 ? (
              <div className="empty-state">
                <p>{t('no_results')}</p>
              </div>
            ) : (
              <motion.div className="product-list" layout>
                <AnimatePresence>
                  {results.map((product) => (
                    <motion.article
                      key={product.id}
                      className="card"
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      onClick={() => openProduct(product)}
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        className="card__img"
                        loading="lazy"
                      />
                      <div className="card__body">
                        <h3 className="card__name">{product.name}</h3>
                        <p className="card__store">
                          <MapPin size={13} />
                          {product.store}
                          <span className="card__dist">{t('distance', { dist: product.score_distance })}</span>
                        </p>
                        <div className="card__footer">
                          <span className="badge badge--auth">
                            <Award size={13} />
                            {product.score_authenticity}/10
                          </span>
                          <span className="card__price">£{product.score_price.toFixed(2)}</span>
                        </div>
                        <p className="card__approved">{t('approved_by', { count: product.reviews })}</p>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rating bottom-sheet modal ── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProduct(null);
            }}
          >
            <motion.div
              className="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            >
              <div className="sheet__handle" />

              <button className="sheet__close" onClick={() => setSelectedProduct(null)} aria-label="Close">
                <X size={20} />
              </button>

              {!ratingSubmitted ? (
                <>
                  <h2 className="sheet__title">{selectedProduct.name}</h2>
                  <p className="sheet__subtitle">{t('rate_authenticity')}</p>

                  <div className="rating">
                    <div className="rating__value" style={{
                      color: ratingValue >= 7 ? 'var(--color-secondary)' : 'var(--color-primary)'
                    }}>
                      {ratingValue}
                      <span className="rating__max">/10</span>
                    </div>

                    <input
                      type="range"
                      min="0" max="10" step="0.5"
                      value={ratingValue}
                      onChange={(e) => setRatingValue(Number(e.target.value))}
                      className="rating__slider"
                    />
                    <div className="rating__labels">
                      <span>{t('not_authentic')}</span>
                      <span>{t('exactly_home')}</span>
                    </div>
                  </div>

                  <textarea
                    className="review-input"
                    placeholder={t('review_placeholder')}
                    rows={3}
                  />

                  <button className="btn-primary" onClick={submitRating}>
                    {t('submit')}
                  </button>
                </>
              ) : (
                <motion.div
                  className="success-msg"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="success-check">✓</div>
                  <p>{t('rating_submitted')}</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
