import { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { detectCulture, getCultureName } from '../utils';
import RootedLogo from '../components/RootedLogo';
import { useSearchTopPick } from '../context/SearchTopPickContext';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setTopPickProductId } = useSearchTopPick();

  useEffect(() => {
    setTopPickProductId(null);
  }, [setTopPickProductId]);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const detectedCulture = useMemo(() => detectCulture(query), [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const culture = detectedCulture;
    const params = new URLSearchParams({ q: query });
    if (culture) params.set('culture', culture);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="landing">
      <div className="landing__brand">
        <div className="landing__icon">
          <RootedLogo size={72} />
        </div>
        <h1 className="landing__title">{t('app_name')}</h1>
        <p className="landing__tagline">{t('tagline')}</p>
        <div className="landing__trust">
          <span className="landing__trust-dot" />
          {t('tagline_sub')}
        </div>
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
          <p className="culture-hint">
            {t('detected_culture', {
              culture: getCultureName(detectedCulture, t)
            })}
          </p>
        )}
      </form>
    </div>
  );
}
