import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Home, Heart, PackageCheck, ArrowRight, XCircle, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);

export default function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();

  const [status, setStatus] = useState('loading'); // 'loading' | 'succeeded' | 'failed'
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    // If there are no Stripe params, this was a direct navigation — treat as success
    // (e.g. in dev/test mode without real Stripe keys)
    if (!clientSecret) {
      setStatus('succeeded');
      clearCart();
      setTimeout(() => setShowConfetti(true), 500);
      return;
    }

    // Verify payment status with Stripe
    stripePromise.then(stripe => {
      if (!stripe) {
        // No publishable key configured — fallback
        setStatus(redirectStatus === 'succeeded' ? 'succeeded' : 'failed');
        if (redirectStatus === 'succeeded') {
          clearCart();
          setTimeout(() => setShowConfetti(true), 500);
        }
        return;
      }

      stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
        if (paymentIntent?.status === 'succeeded') {
          setStatus('succeeded');
          clearCart();
          setTimeout(() => setShowConfetti(true), 500);
        } else {
          setStatus('failed');
        }
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'loading') {
    return (
      <div className="success-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', color: '#888' }}>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite', marginBottom: '16px' }} />
          <p>Confirming your payment…</p>
        </motion.div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="success-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="success-content"
        >
          <div className="celebration-vibe">
            <div className="icon-circle" style={{ background: 'linear-gradient(135deg, #fdf0ee, #f5c6c2)' }}>
              <XCircle size={64} color="#c0392b" />
            </div>
          </div>

          <h1 className="success-title" style={{ color: '#c0392b' }}>Payment Failed</h1>
          <div className="success-message">
            <p className="vibe-text">Your card was not charged.</p>
            <p className="enjoy-text">Please check your payment details and try again.</p>
          </div>

          <div className="order-details-mini">
            <div className="mini-row">
              <XCircle size={16} color="#c0392b" />
              <span>Payment was not completed</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/checkout')}
            className="btn-primary success-home-btn"
            id="retry-payment-btn"
          >
            <span>Try Again</span>
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="success-page">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="success-content"
      >
        <div className="celebration-vibe">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="celebration-icon"
          >
            <div className="icon-circle">
              <PackageCheck size={64} className="main-icon" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="floating-heart"
            >
              <Heart size={24} fill="#D95D39" color="#D95D39" />
            </motion.div>
          </motion.div>
        </div>

        <h1 className="success-title">Order Confirmed!</h1>
        <div className="success-message">
          <p className="vibe-text">Your authentic items are on their way!</p>
          <p className="enjoy-text">A confirmation email has been sent. Enjoy the taste of home. ✨</p>
        </div>

        <div className="order-details-mini">
          <div className="mini-row">
            <CheckCircle2 size={16} color="#22c55e" />
            <span>Payment received</span>
          </div>
          <div className="mini-row">
            <Home size={16} color="#204E4A" />
            <span>Delivering to your location</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn-primary success-home-btn"
          id="continue-shopping-btn"
        >
          <span>Continue Shopping</span>
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>

      {/* Confetti particles */}
      {showConfetti &&
        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <motion.div
            key={i}
            initial={{ x: '50vw', y: '50vh', opacity: 1, scale: 0 }}
            animate={{
              x: `${Math.random() * 100}vw`,
              y: `${Math.random() * 100}vh`,
              opacity: 0,
              scale: Math.random() * 2,
            }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="confetti-particle"
            style={{ backgroundColor: i % 2 === 0 ? '#D95D39' : '#204E4A' }}
          />
        ))}
    </div>
  );
}
