import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, MapPin, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data';
import { detectCulture, searchProducts, getCultureName, getProductAverageRating } from '../utils';
import ProductCard from '../components/ProductCard';
import ExpandableSearchField from '../components/ExpandableSearchField';
import { useSearchTopPick } from '../context/SearchTopPickContext';
import { useReviews } from '../context/ReviewsContext';

const NO_EXTRA = [];

export default function SearchPage() {
  const { t } = useTranslation();
  const { communityReviews } = useReviews();
  const { setTopPickProductId } = useSearchTopPick();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const culture = searchParams.get('culture') || null;
  const sort = searchParams.get('sort') || 'authenticity';

  const [query, setQuery] = useState(q);
  const [showDemos, setShowDemos] = useState(false);

  useEffect(() => { setQuery(q); }, [q]);

  /** Arabic/Hindi/Portuguese in the query must set ?culture= so we filter to the right demo list (not all 46 products). */
  useEffect(() => {
    const detected = detectCulture(q);
    if (!detected || culture) return;
    setSearchParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set('culture', detected);
        return p;
      },
      { replace: true },
    );
  }, [q, culture, setSearchParams]);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    searchProducts(q, culture, sort).then(data => {
      if (active) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [q, culture, sort]);

  useEffect(() => {
    if (sort !== 'authenticity') {
      setTopPickProductId(null);
      return;
    }
    setTopPickProductId(results.length ? results[0].id : null);
  }, [results, sort, setTopPickProductId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const detected = detectCulture(query);
    const params = new URLSearchParams({ q: query });
    if (detected) params.set('culture', detected);
    setSearchParams(params);
  };

  const setSort = (newSort) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  const runScenario = (scenarioCulture, scenarioQuery) => {
    setQuery(scenarioQuery);
    setSearchParams({ q: scenarioQuery, culture: scenarioCulture });
  };

  return (
    <div className="results-view">
      <header className="results-header">
        <ExpandableSearchField
          layout="results"
          value={query}
          onChange={setQuery}
          onSubmit={handleSearch}
          urlQuerySync={q}
        />
      </header>

      <section className="results-branding">
        <p className="results-branding__subtitle">{t('results_subtitle')}</p>
        <p className="results-branding__meta">
          {results.length} {t('results_count')} · {getCultureName(culture, t)}
        </p>
      </section>

      <div className="demo-toggle-wrap demo-toggle-wrap--results">
        <button
          type="button"
          className="demo-toggle demo-toggle--compact"
          onClick={() => setShowDemos((v) => !v)}
          aria-expanded={showDemos}
        >
          {showDemos ? t('hide_demos') : t('show_demos')}
          {showDemos ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {showDemos && (
          <motion.div
            className="demo-row"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {DEMO_SCENARIOS.map((scenario) => (
              <button
                key={`d-${scenario.id}`}
                className={`demo-pill ${culture === scenario.id ? 'demo-pill--active' : ''}`}
                onClick={() => runScenario(scenario.id, scenario.query)}
                type="button"
              >
                <span className="demo-pill__query">{scenario.query}</span>
                <span className="demo-pill__label">{getCultureName(scenario.id, t)}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sort-row">
        <span className="sort-row__label">{t('sort_by')}:</span>
        {['authenticity', 'distance', 'price'].map((key) => (
          <button
            key={key}
            type="button"
            className={`sort-pill ${sort === key ? 'sort-pill--active' : ''}`}
            aria-pressed={sort === key}
            onClick={() => setSort(key)}
          >
            {key === 'authenticity' && <Award size={13} />}
            {key === 'distance' && <MapPin size={13} />}
            {key === 'price' && <Tag size={13} />}
            {t(`sort_${key === 'authenticity' ? 'authentic' : key}`)}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <p>{t('no_results')}</p>
        </div>
      ) : (
        <div className="product-list" role="list">
          {results.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isTopPick={sort === 'authenticity' && index === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
