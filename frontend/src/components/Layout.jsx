import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RootedLogo from './RootedLogo';

export default function Layout() {
  const { t } = useTranslation();
  const location = useLocation();
  const [showLocation, setShowLocation] = useState(false);
  const isLanding = location.pathname === '/';

  useEffect(() => {
    document.documentElement.dir = 'ltr';
  }, []);

  return (
    <div className={`app${isLanding ? '' : ' app--raised-sticky'}`}>
      <nav className={`top-nav ${isLanding ? 'top-nav--landing' : 'top-nav--app'}`}>
        <Link to="/" className="top-nav__brand">
          <RootedLogo className="top-nav__logo" size={isLanding ? 36 : 48} />
          <span className="top-nav__name">{t('app_name')}</span>
        </Link>

        <button
          className="location-selector"
          onClick={() => setShowLocation(!showLocation)}
          type="button"
        >
          <span className="location-selector__dot" />
          <MapPin size={14} />
          <span className="location-selector__text">Newcastle upon Tyne</span>
          <ChevronDown size={12} className={showLocation ? 'chevron--open' : ''} />
        </button>
      </nav>

      <AnimatePresence>
        {showLocation && (
          <>
            <motion.div
              className="location-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocation(false)}
            />
            <motion.div
              className="location-popover"
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <button
                className="location-popover__close"
                onClick={() => setShowLocation(false)}
                type="button"
              >
                <X size={16} />
              </button>
              <div className="location-popover__icon">
                <MapPin size={28} />
              </div>
              <h3>Newcastle upon Tyne</h3>
              <p className="location-popover__desc">{t('location_set_text')}</p>
              <div className="location-popover__coords">
                54.9783° N, 1.6178° W
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className={`app-footer ${isLanding ? '' : 'app-footer--app'}`}>
        <RootedLogo className="app-footer__logo" size={isLanding ? 24 : 32} />
        <p className="app-footer__line">{t('footer_line')}</p>
      </footer>
    </div>
  );
}
