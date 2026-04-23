import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Lock, ShoppingBag, ArrowRight } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext';
import './Checkout.css';

// ── Stripe setup ───────────────────────────────────────────────────────────────
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : Promise.resolve(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Stripe PaymentElement appearance — matches Rooted's colour palette
const stripeAppearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#2d6a6a',
    colorBackground: '#ffffff',
    colorText: '#1a1a1a',
    colorDanger: '#c0392b',
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    borderRadius: '10px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': {
      border: '1.5px solid #e0d8d0',
      boxShadow: 'none',
      padding: '11px 14px',
    },
    '.Input:focus': {
      border: '1.5px solid #2d6a6a',
      boxShadow: '0 0 0 3px rgba(45, 106, 106, 0.12)',
    },
    '.Label': {
      fontWeight: '500',
      fontSize: '13px',
      color: '#666',
      marginBottom: '6px',
    },
    '.Tab': {
      border: '1.5px solid #e0d8d0',
      boxShadow: 'none',
    },
    '.Tab--selected': {
      border: '1.5px solid #2d6a6a',
      boxShadow: '0 0 0 2px rgba(45, 106, 106, 0.15)',
    },
    '.Error': {
      color: '#c0392b',
    },
  },
};

// ── Inner payment form (must live inside <Elements>) ───────────────────────────
function PaymentForm({ total }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [stripeReady, setStripeReady] = useState(false);

  const handlePay = async e => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!name.trim()) { setErrorMsg('Please enter your full name.'); return; }
    if (!email.trim()) { setErrorMsg('Please enter your email for the order confirmation.'); return; }

    setIsProcessing(true);
    setErrorMsg('');

    const returnUrl = `${window.location.origin}/success`;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
        receipt_email: email,
        payment_method_data: {
          billing_details: { name, email },
        },
      },
    });

    // We only reach here if there was an error.
    // Successful payments redirect away to /success.
    setIsProcessing(false);
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handlePay} noValidate>
      {/* Contact details */}
      <div className="section-title">
        <h3>Contact Details</h3>
      </div>

      <div className="card-form-grid" style={{ marginBottom: '24px' }}>
        <div className="input-group full">
          <label htmlFor="buyer-name">Full Name</label>
          <input
            id="buyer-name"
            type="text"
            placeholder="Jane Smith"
            value={name}
            onChange={e => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className="input-group full">
          <label htmlFor="buyer-email">Email Address</label>
          <input
            id="buyer-email"
            type="email"
            placeholder="jane@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <span className="form-hint">Order confirmation will be sent here.</span>
        </div>
      </div>

      {/* Stripe PaymentElement */}
      <div className="section-title">
        <h3>Payment</h3>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <PaymentElement
          id="stripe-payment-element"
          options={{ layout: 'tabs' }}
          onReady={() => setStripeReady(true)}
        />
      </div>

      {/* Error message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              color: '#c0392b',
              fontSize: '13px',
              marginBottom: '16px',
              padding: '12px 16px',
              background: '#fdf0ee',
              borderRadius: '8px',
              border: '1px solid #f5c6c2',
            }}
          >
            ⚠️ {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pay button */}
      <footer className="checkout-footer">
        <button
          id="pay-now-btn"
          type="submit"
          className={`btn-pay ${isProcessing ? 'loading' : ''} ${!stripe || !stripeReady ? 'disabled' : ''}`}
          disabled={isProcessing || !stripe || !stripeReady}
        >
          {isProcessing ? (
            <div className="spinner" />
          ) : (
            <>
              <span>Pay £{total.toFixed(2)}</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <div className="trust-seals">
          <div className="seal">
            <ShieldCheck size={12} />
            <span>Encrypted by Stripe</span>
          </div>
          <div className="seal">
            <ShieldCheck size={12} />
            <span>PCI DSS Compliant</span>
          </div>
        </div>
      </footer>
    </form>
  );
}

// ── Outer wrapper — creates PaymentIntent, then mounts Elements ────────────────
export default function CheckoutPage() {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState(null);
  const [initError, setInitError] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.score_price || 0) * item.quantity,
    0
  );

  // Create PaymentIntent as soon as we know the cart
  useEffect(() => {
    if (cartItems.length === 0) return;

    fetch(`${API_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems.map(i => ({ id: i.id, quantity: i.quantity })),
      }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setInitError(data.error || 'Failed to initialise payment.');
        }
      })
      .catch(() =>
        setInitError('Could not connect to the payment server. Please try again.')
      );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="checkout-page">
      {/* Nav */}
      <nav className="checkout-nav">
        <button id="back-to-cart-btn" onClick={() => navigate(-1)} className="back-link">
          <ChevronLeft size={18} />
          <span>Back to Cart</span>
        </button>
        <div className="security-guarantee">
          <Lock size={14} />
          <span>Secure Checkout</span>
        </div>
      </nav>

      <main className="checkout-main">
        <section className="checkout-container">
          <header className="checkout-header">
            <h1>Checkout</h1>
            <p className="subtitle">
              Secure, encrypted payment powered by Stripe.
            </p>
          </header>

          <div className="checkout-grid">
            {/* ── Order summary ── */}
            <div className="order-summary-card">
              <button
                id="summary-toggle-btn"
                className={`summary-toggle ${showSummary ? 'active' : ''}`}
                onClick={() => setShowSummary(s => !s)}
              >
                <div className="toggle-label">
                  <ShoppingBag size={18} />
                  <span>Order Summary</span>
                </div>
                <div className="toggle-meta">
                  <span className="summary-total">£{subtotal.toFixed(2)}</span>
                  <motion.div animate={{ rotate: showSummary ? 180 : 0 }}>
                    <ChevronLeft size={16} style={{ transform: 'rotate(-90deg)' }} />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {showSummary && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="summary-content"
                  >
                    <div className="summary-items">
                      {cartItems.map(item => (
                        <div key={item.id} className="summary-item">
                          <span>
                            {item.quantity}× {item.name}
                          </span>
                          <span>
                            £{((item.score_price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="summary-total-row">
                      <span>Total Amount</span>
                      <strong>£{subtotal.toFixed(2)}</strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Payment section ── */}
            <div className="payment-stack">
              {/* Empty cart guard */}
              {cartItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                  <p>Your cart is empty.</p>
                  <button
                    className="back-link"
                    onClick={() => navigate('/')}
                    style={{ marginTop: '12px' }}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

              {/* Init error */}
              {initError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    padding: '16px 20px',
                    background: '#fdf0ee',
                    borderRadius: '10px',
                    color: '#c0392b',
                    fontSize: '14px',
                    border: '1px solid #f5c6c2',
                  }}
                >
                  ⚠️ {initError}
                </motion.div>
              )}

              {/* Loading state */}
              {!clientSecret && !initError && cartItems.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    color: '#888',
                    padding: '24px 0',
                  }}
                >
                  <div className="spinner" style={{ borderTopColor: '#2d6a6a' }} />
                  <span>Connecting to payment server…</span>
                </div>
              )}

              {/* Stripe Elements */}
              {clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: stripeAppearance }}
                >
                  <PaymentForm total={subtotal} />
                </Elements>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
