import { useTranslation } from 'react-i18next';
import badgeSrc from '../assets/top-pick-badge.png';

/** Top search pick — “100% AUTHENTIC” stamp artwork (PNG). */
export default function TastesLikeHomeStamp({ variant = 'card', className = '' }) {
  const { t } = useTranslation();
  const rootClass = [
    'home-stamp',
    variant === 'product' ? 'home-stamp--product' : 'home-stamp--card',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClass}>
      <img
        src={badgeSrc}
        alt={t('top_pick_badge_alt')}
        className="home-stamp__img"
        decoding="async"
      />
    </div>
  );
}
