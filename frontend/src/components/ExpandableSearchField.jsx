import { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import { detectCulture, getCultureName } from '../utils';

/**
 * Results page: collapsed summary bar → tap to expand full search.
 * Product page: controlled panel only (parent supplies search toggle in header).
 */
export default function ExpandableSearchField({
  layout = 'results',
  value,
  onChange,
  onSubmit,
  /** URL `q` — when it changes (new search / demo), collapse to summary */
  urlQuerySync,
  open,
  onOpenChange,
}) {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const prevUrlQ = useRef(urlQuerySync);

  const [expanded, setExpanded] = useState(() => !(urlQuerySync || '').trim());

  useEffect(() => {
    if (layout !== 'results') return;
    if (prevUrlQ.current !== urlQuerySync) {
      prevUrlQ.current = urlQuerySync;
      if ((urlQuerySync || '').trim()) setExpanded(false);
      else setExpanded(true);
    }
  }, [layout, urlQuerySync]);

  useEffect(() => {
    const active = layout === 'product' ? open : expanded;
    if (active) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [layout, open, expanded]);

  const detected = useMemo(() => detectCulture(value), [value]);

  const formInner = (
    <form className="expand-search__form" onSubmit={onSubmit}>
      <div className="search-bar search-bar--sm expand-search__bar">
        <Search size={16} strokeWidth={2.5} aria-hidden />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('search_placeholder')}
          enterKeyHint="search"
          aria-label={t('search_placeholder')}
        />
        <button
          type="button"
          className="expand-search__icon-btn"
          onClick={() => {
            if (layout === 'product') {
              onOpenChange?.(false);
              onChange('');
            } else {
              setExpanded(false);
            }
          }}
          aria-label={t('search_collapse_aria')}
        >
          <X size={18} strokeWidth={2.25} />
        </button>
      </div>
      {detected && (
        <p className="culture-hint culture-hint--expand">
          {t('detected_culture', { culture: getCultureName(detected, t) })}
        </p>
      )}
    </form>
  );

  if (layout === 'product') {
    return (
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="product-search"
            className="expand-search expand-search--product"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden' }}
          >
            {formInner}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="expand-search expand-search--results">
      <AnimatePresence mode="wait" initial={false}>
        {!expanded ? (
          <motion.button
            key="collapsed"
            type="button"
            className="expand-search__trigger"
            onClick={() => setExpanded(true)}
            aria-expanded={false}
            aria-label={t('search_expand_aria')}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            <Search size={16} strokeWidth={2.5} className="expand-search__trigger-icon" aria-hidden />
            <span className="expand-search__trigger-text">
              {(value || '').trim() || t('search_placeholder')}
            </span>
            <span className="expand-search__trigger-meta">{t('search_tap_to_edit')}</span>
            <ChevronDown size={16} strokeWidth={2.25} className="expand-search__trigger-chevron" aria-hidden />
          </motion.button>
        ) : (
          <motion.div
            key="expanded"
            className="expand-search__panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {formInner}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
