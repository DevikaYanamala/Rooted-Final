import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CartModal({ isOpen, onClose }) {
  const { cartItems, addToCart, decrementFromCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => acc + (item.score_price || 0) * item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="location-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ zIndex: 1000 }}
          />
          <motion.div
            className="cart-modal"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '400px',
              background: 'white',
              zIndex: 1001,
              boxShadow: '-4px 0 15px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Your Cart</h2>
              <button 
                onClick={onClose} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', color: '#666' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {cartItems.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>Your cart is empty.</p>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>
                    <img 
                      src={item.img} 
                      alt={item.name} 
                      style={{ width: '60px', height: '60px', objectFit: 'contain', borderRadius: '8px', background: '#f5f5f5' }} 
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{item.name}</h4>
                      <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>£{(item.score_price || 0).toFixed(2)}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                          <button onClick={() => decrementFromCart(item.id)} style={{ background: '#f9f9f9', border: 'none', padding: '4px 8px', cursor: 'pointer' }}><Minus size={14}/></button>
                          <span style={{ padding: '0 12px', fontSize: '0.9rem', fontWeight: 'bold' }}>{item.quantity}</span>
                          <button onClick={() => addToCart(item)} style={{ background: '#f9f9f9', border: 'none', padding: '4px 8px', cursor: 'pointer' }}><Plus size={14}/></button>
                        </div>
                        
                        <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #eaeaea' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="btn-primary" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', borderRadius: '8px', opacity: cartItems.length === 0 ? 0.5 : 1 }}
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
