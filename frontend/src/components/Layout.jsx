import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { MapPin, ChevronDown, X, ClipboardList, Globe } from 'lucide-react';
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locationError, setLocationError] = useState('');
  
  const POPULAR_LOCATIONS = [
    { city: "London", postcode: "SW1A" },
    { city: "Manchester", postcode: "M1" },
    { city: "Birmingham", postcode: "B1" },
    { city: "Newcastle upon Tyne", postcode: "NE1" },
    { city: "Edinburgh", postcode: "EH1" },
    { city: "Glasgow", postcode: "G1" },
    { city: "Liverpool", postcode: "L1" },
    { city: "Bristol", postcode: "BS1" }
  ];
  
  // Dynamically fetch ALL UK places using the free postcodes.io API
  useEffect(() => {
    if (!tempLocation || tempLocation.length < 2) {
      setLiveSuggestions([]);
      return;
    }

    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const response = await fetch(`https://api.postcodes.io/places?q=${encodeURIComponent(tempLocation)}&limit=10`);
        const data = await response.json();
        
        if (data.status === 200 && data.result) {
          // Format the results into our city/postcode structure
          const formatted = data.result.map(place => ({
            city: place.name_1,
            postcode: place.outcode || place.region || 'UK'
          }));
          
          // Remove duplicates
          const unique = formatted.filter((v, i, a) => a.findIndex(t => (t.city === v.city)) === i);
          setLiveSuggestions(unique);
        } else {
          setLiveSuggestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch locations", error);
      } finally {
        setIsLoadingLocations(false);
      }
    };

    const debounceTimer = setTimeout(fetchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [tempLocation]);
  
  const isLanding = routerLocation.pathname === '/';
  
  const { cartItems } = useCart();
  const { location, updateLocation, language, updateLanguage } = usePreferences();
  
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    setLocationError('');
    
    if (!tempLocation.trim()) return;
    
    // Strict Validation: If they typed a custom string, verify it exists in the UK
    setIsLoadingLocations(true);
    try {
      // Clean up the string to search (e.g. "Newcastle upon tne" -> search)
      const searchQuery = tempLocation.split(',')[0].trim();
      const response = await fetch(`https://api.postcodes.io/places?q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await response.json();
      
      if (data.status === 200 && data.result && data.result.length > 0) {
        // Validation Passed! Use the verified API spelling
        const verifiedPlace = data.result[0];
        const verifiedString = `${verifiedPlace.name_1}${verifiedPlace.outcode ? `, ${verifiedPlace.outcode}` : ''}`;
        updateLocation(verifiedString);
        setShowLocation(false);
        setTempLocation('');
      } else {
        // Validation Failed! Fake or misspelled location
        setLocationError('Location not found. Please enter a valid UK city or town.');
      }
    } catch (error) {
      setLocationError('Error validating location. Please try again.');
    } finally {
      setIsLoadingLocations(false);
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
            <button className="cart-selector" type="button" aria-label="List" onClick={() => setIsCartOpen(true)}>
              <ClipboardList size={18} />
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
              <p className="location-popover__desc">Enter your place to discover nearby stores.</p>
              
              <form onSubmit={handleLocationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', width: '100%', position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder="e.g. Manchester, London..."
                  value={tempLocation}
                  onChange={(e) => {
                    setTempLocation(e.target.value);
                    setLocationError('');
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  style={{ 
                    padding: '0.8rem', 
                    borderRadius: '8px', 
                    border: locationError ? '1px solid #ef4444' : '1px solid #ccc', 
                    width: '100%',
                    outline: locationError ? 'none' : ''
                  }}
                />
                {locationError && <span style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '-0.5rem' }}>{locationError}</span>}
                
                {showSuggestions && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    border: '1px solid #eaeaea',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 10,
                    marginTop: '4px'
                  }}>
                    {isLoadingLocations ? (
                      <div style={{ padding: '0.75rem 1rem', color: '#888', fontSize: '0.9rem' }}>Searching UK places...</div>
                    ) : (
                      (tempLocation.length < 2 ? POPULAR_LOCATIONS : liveSuggestions).map((loc, idx) => (
                        <div
                          key={`${loc.city}-${idx}`}
                          onClick={() => {
                            setTempLocation(`${loc.city}${loc.postcode && loc.postcode !== 'UK' ? `, ${loc.postcode}` : ''}`);
                            setShowSuggestions(false);
                          }}
                          style={{
                            padding: '0.75rem 1rem',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f5f5f5',
                            color: '#333',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div>
                            <MapPin size={14} style={{ marginRight: '8px', color: '#666', display: 'inline' }} />
                            <span style={{ fontWeight: 500 }}>{loc.city}</span>
                          </div>
                          {loc.postcode && loc.postcode !== 'UK' && (
                            <span style={{ fontSize: '0.85rem', color: '#888', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px' }}>
                              {loc.postcode}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
                <button type="submit" className="btn-primary" disabled={isLoadingLocations} style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem', opacity: isLoadingLocations ? 0.7 : 1 }}>
                  {isLoadingLocations ? 'Validating...' : 'Update Location'}
                </button>
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
