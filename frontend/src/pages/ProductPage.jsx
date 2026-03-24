import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { ArrowLeft, MapPin, Award, ExternalLink, Star, Search, X } from 'lucide-react';
import { productsData } from '../data';
import { getProductAverageRating, formatAvgRating, authenticityToSliderValue, detectCulture } from '../utils';
import ExpandableSearchField from '../components/ExpandableSearchField';
import { useReviews } from '../context/ReviewsContext';
import { useSearchTopPick } from '../context/SearchTopPickContext';
import TastesLikeHomeStamp from '../components/TastesLikeHomeStamp';

const NO_EXTRA = [];

const AVATAR_COLORS = ['#D95D39', '#204E4A', '#F2A900', '#7C3AED', '#0891B2', '#DC2626', '#059669', '#D97706'];

function getRatingPrompt(val, t) {
  if (val >= 9) return t('rating_prompt_high');
  if (val >= 7) return t('rating_prompt_good');
  if (val >= 5) return t('rating_prompt_mid');
  return t('rating_prompt_low');
}

function ProductPageContent({ product }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { communityReviews, addReview } = useReviews();
  const { topPickProductId } = useSearchTopPick();

  const [headerSearchOpen, setHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');

  const [ratingValue, setRatingValue] = useState(() =>
    authenticityToSliderValue(product.score_authenticity),
  );
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [reviewDraft, setReviewDraft] = useState('');

  const extra = communityReviews[product.id] ?? NO_EXTRA;

  const communityAvg = useMemo(
    () => getProductAverageRating(product, extra),
    [product, extra],
  );

  const allReviews = [
    ...(product.reviewSamples || []),
    ...(communityReviews[product.id] || []),
  ];

  const showHomeStamp = product.id === topPickProductId;

  const submitRating = () => {
    addReview(product.id, {
      author: t('you_label'),
      rating: ratingValue,
      text: reviewDraft.trim() || t('review_no_text'),
    });
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
            <span className="product-page__price">£{product.score_price.toFixed(2)}</span>
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
            {product.store} · {product.location} · {t('distance', { dist: product.score_distance })}
          </p>
        </div>

        <a
          className="retailer-cta"
          href={product.productUrl || product.retailerUrl}
          target="_blank"
          rel="noreferrer"
        >
          <img src={product.retailerLogo} alt={product.retailerName} className="retailer-cta__logo" />
          <div className="retailer-cta__text">
            <span className="retailer-cta__action">{t('buy_from')}</span>
            <span className="retailer-cta__name">{product.retailerName}</span>
          </div>
          <ExternalLink size={16} />
        </a>

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
                {review.author.charAt(0)}
              </div>
              <div className="review-card__content">
                <div className="review-card__head">
                  <strong>{review.author}</strong>
                  <span className="review-card__rating">{formatAvgRating(review.rating)}/10</span>
                </div>
                <p>{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const product = productsData.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="empty-state">
        <p>Product not found.</p>
      </div>
    );
  }

  return <ProductPageContent product={product} key={product.id} />;
}
