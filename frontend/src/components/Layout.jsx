import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, X, ShoppingCart, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RootedLogo from './RootedLogo';
import { useCart } from '../context/CartContext';
import { usePreferences } from '../context/PreferencesContext';
import CartModal from './CartModal';

export default function Layout() {
  const { t } = useTranslation();
  const routerLocation = useLocation();
  const [showLocation, setShowLocation] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tempLocation, setTempLocation] = useState('');
  
  const isLanding = routerLocation.pathname === '/';
  
  const { cartItems } = useCart();
  const { location, updateLocation, language, updateLanguage } = usePreferences();
  
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (tempLocation.trim()) {
      updateLocation(tempLocation.trim());
      setShowLocation(false);
      setTempLocation('');
    }
  };

  return (
    <div className={`app${isLanding ? '' : ' app--raised-sticky'}`}>
      <nav className={`top-nav ${isLanding ? 'top-nav--landing' : 'top-nav--app'}`}>
        <Link to="/" className="top-nav__brand">
          <RootedLogo className="top-nav__logo" size={isLanding ? 36 : 48} />
          <span className="top-nav__name">{t('app_name')}</span>
        </Link>

        <div className="top-nav__actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #eaeaea', borderRadius: '20px', padding: '4px 10px' }}>
            <Globe size={14} style={{ marginRight: '6px', color: '#666' }} />
            <select 
              value={language} 
              onChange={(e) => updateLanguage(e.target.value)}
              style={{ border: 'none', background: 'transparent', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="en">English (UK)</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="ar">العربية (Arabic)</option>
              <option value="pt">Português (BR)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <button
            className="location-selector"
            onClick={() => setShowLocation(!showLocation)}
            type="button"
          >
            <span className="location-selector__dot" />
            <MapPin size={14} />
            <span className="location-selector__text">{location}</span>
            <ChevronDown size={12} className={showLocation ? 'chevron--open' : ''} />
          </button>
          {!isLanding && (
            <button className="cart-selector" type="button" aria-label="Cart" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart size={18} />
              {cartItemCount > 0 && <span className="cart-selector__badge" style={{
                background: '#D95D39', color: 'white', fontSize: '0.7rem', padding: '0 4px', borderRadius: '10px', marginLeft: '4px'
              }}>{cartItemCount}</span>}
            </button>
          )}
        </div>
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
              <h3>Set Your Location</h3>
              <p className="location-popover__desc">Enter your UK city or postcode to discover nearby stores.</p>
              
              <form onSubmit={handleLocationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', width: '100%' }}>
                <input 
                  type="text" 
                  placeholder="e.g. Manchester, M1 1AA"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', width: '100%' }}
                />
                <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Update Location</button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className={`app-footer ${isLanding ? '' : 'app-footer--app'}`}>
        <RootedLogo className="app-footer__logo" size={isLanding ? 24 : 32} />
        <p className="app-footer__line">Rooted · {location} · Every bite, a journey home</p>
      </footer>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
