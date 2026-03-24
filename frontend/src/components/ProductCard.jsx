import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { getProductAverageRating, formatAvgRating } from '../utils';
import { useReviews } from '../context/ReviewsContext';
import TastesLikeHomeStamp from './TastesLikeHomeStamp';

const NO_EXTRA = [];

export default function ProductCard({ product, isTopPick = false }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { communityReviews } = useReviews();
  const extra = communityReviews[product.id] ?? NO_EXTRA;
  const avg = getProductAverageRating(product, extra);

  const go = () => navigate(`/product/${product.id}`);

  return (
    <article
      className={`card${isTopPick ? ' card--winner' : ''}`}
      role="listitem"
      tabIndex={0}
      onClick={go}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          go();
        }
      }}
    >
      <div className="card__media">
        {isTopPick && <TastesLikeHomeStamp variant="card" />}
        <img
          src={product.img}
          alt={product.name}
          className="card__img"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="card__body">
        <div className="card__title-row">
          <h3 className="card__name">{product.name}</h3>
          <span className="card__price">£{product.score_price.toFixed(2)}</span>
        </div>
        <p className="card__avg" aria-label={t('avg_rating_label')}>
          <Star size={13} className="card__avg-icon" aria-hidden />
          <span className="card__avg-value">{formatAvgRating(avg)}</span>
          <span className="card__avg-scale">/10</span>
          <span className="card__avg-label">{t('avg_rating_short')}</span>
        </p>
        <p className="card__store">
          <MapPin size={12} />
          {product.store}
          <span className="card__dist">
            {t('distance', { dist: product.score_distance })}
          </span>
        </p>
        <a
          className="retailer-link"
          href={product.productUrl || product.retailerUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={product.retailerLogo}
            alt={product.retailerName}
            className="retailer-link__logo"
            loading="lazy"
          />
          <span>{product.retailerName}</span>
          <ExternalLink size={11} />
        </a>
        <p className="card__approved">
          {t('approved_by', { count: product.reviews })}
        </p>
      </div>
    </article>
  );
}
