import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, MapPin, Award, ExternalLink, Star, Search, X, ShoppingCart, Store } from 'lucide-react';
import { productsData } from '../data';
import { getProductAverageRating, formatAvgRating, authenticityToSliderValue, detectCulture } from '../utils';
import ExpandableSearchField from '../components/ExpandableSearchField';
import { useReviews } from '../context/ReviewsContext';
import { useSearchTopPick } from '../context/SearchTopPickContext';
import { useCart } from '../context/CartContext';
import { usePreferences } from '../context/PreferencesContext';
import TastesLikeHomeStamp from '../components/TastesLikeHomeStamp';

const NO_EXTRA = [];

const AVATAR_COLORS = ['#D95D39', '#204E4A', '#F2A900', '#7C3AED', '#0891B2', '#DC2626', '#059669', '#D97706'];

function getRatingPrompt(val, t) {
  if (val >= 9) return t('rating_prompt_high');
  if (val >= 7) return t('rating_prompt_good');
  if (val >= 5) return t('rating_prompt_mid');
  return t('rating_prompt_low');
}

function ProductPageContent({ product, mutateProduct }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { communityReviews, addReview } = useReviews();
  const { topPickProductId } = useSearchTopPick();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [mapStore, setMapStore] = useState(null);

  const handleAddToCart = () => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const [ratingValue, setRatingValue] = useState(() =>
    authenticityToSliderValue(product.score_authenticity),
  );
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [reviewDraft, setReviewDraft] = useState('');

  const communityAvg = product.score_authenticity;

  const allReviews = product.reviewsList || product.reviewSamples || [];

  const showHomeStamp = product.id === topPickProductId;

  const submitRating = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: t('you_label'),
          rating: ratingValue,
          text: reviewDraft.trim() || t('review_no_text'),
        })
      });
      if (res.ok) {
        const updatedProduct = await res.json();
        if (mutateProduct) mutateProduct(updatedProduct);
      }
    } catch (err) {
      console.error(err);
    }
    setRatingSubmitted(true);
  };

  const submitHeaderSearch = (e) => {
    e.preventDefault();
    if (!headerSearchQuery.trim()) return;
    const culture = detectCulture(headerSearchQuery);
    const params = new URLSearchParams({ q: headerSearchQuery });
    if (culture) params.set('culture', culture);
    navigate(`/search?${params.toString()}`);
    setHeaderSearchOpen(false);
    setHeaderSearchQuery('');
  };

  return (
    <div className="product-page">
      <header
        className={`product-page__header${headerSearchOpen ? ' product-page__header--search-open' : ''}`}
      >
        <div className="product-page__header-top">
          <button className="back-btn" onClick={() => navigate(-1)} type="button" aria-label="Back">
            <ArrowLeft size={20} />
          </button>
          <h2 className="product-page__header-title">{product.name}</h2>
          <button
            type="button"
            className={`product-page__search-toggle${headerSearchOpen ? ' product-page__search-toggle--active' : ''}`}
            onClick={() =>
              setHeaderSearchOpen((v) => {
                if (v) setHeaderSearchQuery('');
                return !v;
              })
            }
            aria-expanded={headerSearchOpen}
            aria-label={headerSearchOpen ? t('search_collapse_aria') : t('search_expand_aria')}
          >
            {headerSearchOpen ? <X size={20} strokeWidth={2.25} /> : <Search size={20} strokeWidth={2.25} />}
          </button>
        </div>
        <ExpandableSearchField
          layout="product"
          open={headerSearchOpen}
          onOpenChange={setHeaderSearchOpen}
          value={headerSearchQuery}
          onChange={setHeaderSearchQuery}
          onSubmit={submitHeaderSearch}
        />
      </header>

      <div className="product-page__content">
        <div className="product-page__media">
          {showHomeStamp && <TastesLikeHomeStamp variant="product" />}
          <img
            src={product.img}
            alt={product.name}
            className="product-page__hero"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="product-page__info">
          <div className="product-page__name-row">
            <h3 className="product-page__name">{product.name}</h3>
            <span className="product-page__price">£{(product.score_price || 0).toFixed(2)}</span>
          </div>
          <p
            className="product-page__auth-score"
            aria-label={`${t('authenticity_score')}: ${formatAvgRating(ratingValue)} out of 10`}
          >
            <Award size={17} className="product-page__auth-score-icon" aria-hidden />
            <span className="product-page__auth-score-label">{t('authenticity_score')}</span>
            <span className="product-page__auth-score-value">{formatAvgRating(ratingValue)}/10</span>
          </p>
          <p className="product-page__meta">
            <MapPin size={14} />
            {product.store} · {product.userLocation || product.location} · {t('distance', { dist: product.score_distance })}
          </p>
        </div>

        <div className="product-page__actions" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn-primary" 
            onClick={handleAddToCart}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem' }}
          >
            <ShoppingCart size={20} />
            {addedToCart ? "Added to Cart!" : "Add to Cart"}
          </button>
        </div>

        {product.nearbyStores && product.nearbyStores.length > 0 && (() => {
          const sorted = [...product.nearbyStores].sort((a, b) => a.distance - b.distance);
          const nearest = sorted[0];
          return (
            <div className="nearby-stores" style={{ marginBottom: '1.5rem' }}>
              {/* Nearest store highlight */}
              <div style={{ padding: '1rem', background: 'linear-gradient(135deg, #204E4A 0%, #2a6b65 100%)', borderRadius: '12px', marginBottom: '1rem', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', marginBottom: '0.5rem', opacity: 0.85 }}>
                  <MapPin size={14} /> NEAREST STORE
                </div>
                <strong style={{ fontSize: '1.1rem' }}>{nearest.name}</strong>
                <div style={{ fontSize: '0.85rem', marginTop: '0.3rem', opacity: 0.9 }}>
                  {nearest.area} · {nearest.distance} mi · <span style={{ color: nearest.stock === 'In stock' ? '#6ee7b7' : '#fcd34d' }}>{nearest.stock}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.8rem' }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setMapStore(nearest)}
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: 'white', color: '#204E4A', border: 'none' }}
                  >
                    Order Pickup
                  </button>
                  {nearest.website && (
                    <a
                      href={nearest.website}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#D95D39', color: 'white', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}
                    >
                      Order Online
                    </a>
                  )}
                </div>
              </div>

              {/* All stores list, nearest to farthest */}
              {sorted.length > 1 && (
                <div style={{ padding: '1rem', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #eee' }}>
                  <h4 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1rem', color: '#555' }}>
                    <Store size={16} /> All stores near {product.userLocation || 'you'} — nearest first
                  </h4>
                  <div className="store-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {sorted.map((store, idx) => (
                      <div key={store.id} className="store-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'white', border: idx === 0 ? '2px solid #204E4A' : '1px solid #eaeaea', borderRadius: '8px' }}>
                        <div className="store-card__info" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ background: idx === 0 ? '#204E4A' : '#e5e7eb', color: idx === 0 ? 'white' : '#555', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                            {idx + 1}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                            <strong style={{ fontSize: '0.9rem' }}>{store.name}</strong>
                            <span style={{ fontSize: '0.78rem', color: '#666' }}>{store.area} · {store.distance} mi · <span style={{ color: store.stock === 'In stock' ? '#059669' : '#D97706' }}>{store.stock}</span></span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="btn-secondary"
                            onClick={() => setMapStore(store)}
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                          >
                            Pickup
                          </button>
                          {store.website && (
                            <a
                              href={store.website}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-primary"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', textDecoration: 'none', display: 'inline-block' }}
                            >
                              Online
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <div className="product-page__approved">
          <Star size={14} />
          {t('approved_by', { count: product.reviews })}
          <span className="product-page__approved-avg" aria-label={t('avg_rating_label')}>
            · {t('avg_rating_short')} {formatAvgRating(communityAvg)}/10
          </span>
        </div>

        {!ratingSubmitted ? (
          <div className="rating-section">
            <div className="rating-section__head">
              <h4>{t('rate_authenticity')}</h4>
              <span className="rating-section__value">{formatAvgRating(ratingValue)}/10</span>
            </div>
            <div className="rating">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={ratingValue}
                onChange={(e) => setRatingValue(Number(e.target.value))}
                className="rating__slider"
                aria-valuetext={`${formatAvgRating(ratingValue)} out of 10`}
              />
              <div className="rating__labels">
                <span>{t('not_authentic')}</span>
                <span>{t('exactly_home')}</span>
              </div>
            </div>
            <p className="rating-prompt">{getRatingPrompt(ratingValue, t)}</p>
            <textarea
              className="review-input"
              placeholder={t('review_placeholder')}
              rows={3}
              value={reviewDraft}
              onChange={(e) => setReviewDraft(e.target.value)}
            />
            <button type="button" className="btn-primary" onClick={submitRating}>
              {t('submit')}
            </button>
          </div>
        ) : (
          <div className="success-msg">
            <div className="success-check">✓</div>
            <p>{t('rating_submitted')}</p>
          </div>
        )}

        <div className="reviews-section">
          <h4>{t('reviews')} ({allReviews.length})</h4>
          {allReviews.map((review, idx) => (
            <div className="review-card" key={`${review.author}-${idx}`}>
              <div
                className="review-avatar"
                style={{ background: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
              >
                {(review.author || 'A').charAt(0)}
              </div>
              <div className="review-card__content">
                <div className="review-card__head">
                  <strong>{review.author || 'Anonymous'}</strong>
                  <span className="review-card__rating">{formatAvgRating(review.rating)}/10</span>
                </div>
                <p>{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Modal */}
      {mapStore && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
          <div 
            onClick={() => setMapStore(null)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)' }} 
          />
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'white', borderRadius: '16px', overflow: 'hidden', width: '90%', maxWidth: '600px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ padding: '1rem 1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{mapStore.name}</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#666' }}>{mapStore.area} · {mapStore.distance} mi</p>
              </div>
              <button onClick={() => setMapStore(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: '#666' }}>✕</button>
            </div>
            <iframe
              title="Store Location"
              width="100%"
              height="350"
              style={{ border: 0 }}
              loading="lazy"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapStore.lng - 0.01},${mapStore.lat - 0.006},${mapStore.lng + 0.01},${mapStore.lat + 0.006}&layer=mapnik&marker=${mapStore.lat},${mapStore.lng}`}
            />
            <div style={{ padding: '1rem 1.2rem', display: 'flex', gap: '0.5rem', borderTop: '1px solid #eee' }}>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${mapStore.lat},${mapStore.lng}`}
                target="_blank" rel="noreferrer"
                className="btn-primary"
                style={{ flex: 1, textAlign: 'center', padding: '0.7rem', textDecoration: 'none', borderRadius: '8px' }}
              >
                Get Directions
              </a>
              {mapStore.website && (
                <a 
                  href={mapStore.website}
                  target="_blank" rel="noreferrer"
                  className="btn-secondary"
                  style={{ flex: 1, textAlign: 'center', padding: '0.7rem', textDecoration: 'none', borderRadius: '8px' }}
                >
                  Order Online
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { location } = usePreferences();

  useEffect(() => {
    fetch(`http://localhost:3000/api/products/${id}?location=${encodeURIComponent(location)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, location]);

  if (loading) {
    return <div className="empty-state"><p>Loading...</p></div>;
  }

  if (!product) {
    return (
      <div className="empty-state">
        <p>Product not found.</p>
      </div>
    );
  }

  return <ProductPageContent product={product} key={product.id} mutateProduct={setProduct} />;
}
