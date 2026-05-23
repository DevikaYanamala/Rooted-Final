import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, ExternalLink, List, Map, Globe } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const groupedItems = cartItems.reduce((acc, item) => {
    const key = item.store || 'Online';
    if (!acc[key]) {
      acc[key] = {
        store: item.store || 'Online Retailer',
        retailerName: item.retailerName,
        retailerLogo: item.retailerLogo,
        retailerUrl: item.retailerUrl,
        items: []
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {});

  const groups = Object.values(groupedItems);

  return (
    <div className="checkout-page" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <nav className="checkout-nav" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', background: 'transparent', border: 'none' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '1rem', fontWeight: 500, padding: 0 }}>
          <ChevronLeft size={18} />
          <span>Back to List</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2d6a6a', fontWeight: 600 }}>
          <List size={18} />
          <span>Your Itinerary</span>
        </div>
      </nav>

      <main>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>Store Itinerary</h1>
          <p style={{ color: '#666', margin: 0, lineHeight: 1.5 }}>
            Here is where you can find the authentic items you're looking for. We've grouped them by store location so you can easily plan your shopping trip or order online.
          </p>
        </header>

        {groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#f9f9f9', borderRadius: '12px' }}>
            <p style={{ color: '#888', marginBottom: '1rem' }}>Your list is empty.</p>
            <button className="btn-primary" onClick={() => navigate('/')} style={{ padding: '0.8rem 1.5rem', borderRadius: '8px' }}>
              Discover Items
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {groups.map((group, idx) => {
              const isOnlineOnly = group.store.toLowerCase().includes('delivery') || group.store.toLowerCase().includes('amazon') || group.store.toLowerCase().includes('online');
              
              return (
                <div key={idx} style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eaeaea' }}>
                  
                  {/* Retailer Header */}
                  <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #eaeaea', background: '#fdfdfd' }}>
                    {group.retailerLogo ? (
                      <img src={group.retailerLogo} alt={group.retailerName} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', background: 'white', border: '1px solid #eee' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={24} color="#999" />
                      </div>
                    )}
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.25rem' }}>{group.retailerName}</h3>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        {isOnlineOnly ? <Globe size={14} /> : <MapPin size={14} />}
                        {group.store}
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {group.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <img src={item.img} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#f5f5f5', borderRadius: '8px' }} />
                          <div>
                            <p style={{ margin: '0 0 0.25rem', fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</p>
                            <p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>£{((item.score_price || 0) * item.quantity).toFixed(2)}</span>
                          {item.productUrl && (
                             <a href={item.productUrl} target="_blank" rel="noopener noreferrer" title="View Product on Retailer" style={{ color: '#2d6a6a', padding: '0.5rem', borderRadius: '50%', background: '#f0f7f7', display: 'flex', transition: 'all 0.2s' }}>
                               <ExternalLink size={16} />
                             </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Footer */}
                  <div style={{ padding: '1.25rem 1.5rem', background: '#fafafa', borderTop: '1px solid #eaeaea', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {!isOnlineOnly && (
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(group.store)}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#2d6a6a', color: 'white', padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, transition: 'background 0.2s' }}
                      >
                        <Map size={18} />
                        Get Directions
                      </a>
                    )}
                    {group.retailerUrl && (
                      <a 
                        href={group.retailerUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: isOnlineOnly ? '#2d6a6a' : 'white', color: isOnlineOnly ? 'white' : '#2d6a6a', border: `1px solid ${isOnlineOnly ? '#2d6a6a' : '#ddd'}`, padding: '0.8rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' }}
                      >
                        <ExternalLink size={18} />
                        Buy Online
                      </a>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
