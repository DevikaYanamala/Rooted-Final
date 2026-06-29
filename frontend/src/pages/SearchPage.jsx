import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useMemo } from 'react';
import { Award, MapPin, Tag, Compass } from 'lucide-react';
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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          margin: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(217, 93, 57, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            marginBottom: '1rem'
          }}>
            <Compass size={28} />
          </div>
          <h3 style={{
            fontSize: '1.2rem',
            color: 'var(--color-secondary)',
            marginBottom: '0.5rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: '700'
          }}>
            Products Coming Soon!
          </h3>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-light)',
            maxWidth: '360px',
            lineHeight: '1.5',
            marginBottom: '1.5rem',
            marginInline: 'auto'
          }}>
            We couldn't find any community-verified products for <strong>{getCultureName(culture, t)}</strong> in Newcastle yet. Rooted is constantly expanding its directory of authentic local stores and items.
          </p>
          <RequestProductButton cultureName={getCultureName(culture, t)} />
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

function RequestProductButton({ cultureName }) {
  const [requested, setRequested] = useState(false);

  const handleRequest = () => {
    setRequested(true);
    trackEvent('product_request', cultureName, 'Newcastle upon Tyne', { source: 'empty_state' });
  };

  return (
    <button
      onClick={handleRequest}
      disabled={requested}
      style={{
        padding: '10px 20px',
        backgroundColor: requested ? '#204E4A' : 'var(--color-primary)',
        color: '#fff',
        border: 'none',
        borderRadius: '999px',
        fontSize: '0.82rem',
        fontWeight: '600',
        cursor: requested ? 'default' : 'pointer',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {requested ? '✓ Request Submitted!' : `Request ${cultureName} Products`}
    </button>
  );
}
