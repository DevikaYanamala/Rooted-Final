import { useState, useRef, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data';
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
  const [showDemos, setShowDemos] = useState(false);
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

  const runScenario = (culture, scenarioQuery) => {
    navigate(`/search?q=${encodeURIComponent(scenarioQuery)}&culture=${culture}`);
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

      <div className="demo-toggle-wrap">
        <button
          type="button"
          className="demo-toggle"
          onClick={() => setShowDemos((v) => !v)}
          aria-expanded={showDemos}
        >
          {showDemos ? t('hide_demos') : t('show_demos')}
          {showDemos ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {showDemos && (
          <motion.div
            className="scenario-section"
            aria-label={t('demo_scenarios')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <p className="scenario-title">{t('demo_scenarios')}</p>
            <div className="scenario-list">
              {DEMO_SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  className="scenario-chip"
                  onClick={() => runScenario(scenario.id, scenario.query)}
                  type="button"
                >
                  <span className="scenario-chip__query">{scenario.query}</span>
                  <span className="scenario-chip__label">
                    {getCultureName(scenario.id, t)}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
