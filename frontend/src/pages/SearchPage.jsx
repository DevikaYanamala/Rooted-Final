import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { Award, MapPin, Tag } from 'lucide-react';
import { detectCulture, searchProducts, getCultureName, trackEvent } from '../utils';
import ProductCard from '../components/ProductCard';
import ExpandableSearchField from '../components/ExpandableSearchField';
import { useSearchTopPick } from '../context/SearchTopPickContext';
import { useReviews } from '../context/ReviewsContext';
import { usePreferences } from '../context/PreferencesContext';

const NO_EXTRA = [];

export default function SearchPage() {
  const { t } = useTranslation();
  const { communityReviews } = useReviews();
  const { setTopPickProductId } = useSearchTopPick();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const culture = searchParams.get('culture') || null;
  const category = searchParams.get('category') || 'groceries';
  const sort = searchParams.get('sort') || 'authenticity';
  const { location } = usePreferences();

  const [query, setQuery] = useState(q);

  useEffect(() => { setQuery(q); }, [q]);

  /** Arabic/Hindi/Portuguese in the query must set ?culture= so we filter to the right list (not all 46 products). */
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
    searchProducts(q, culture, sort, category, location).then(data => {
      if (active) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [q, culture, sort, category, location]);

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
    
    // TRACK THE SEARCH EVENT!
    trackEvent('search', query.trim(), location, { category, culture });
    
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
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem', color: '#1a1a1a', textTransform: 'capitalize' }}>
          {category.replace('-', ' ')}
        </h2>
        <p className="results-branding__meta">
          {results.length} {t('results_count')} · {getCultureName(culture, t)}
        </p>
      </section>

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
