import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Key, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import RootedLogo from '../components/RootedLogo';

export default function LoginPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleNext = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (step === 1) setStep(2);
      else if (step === 2) setStep(3);
      else {
        // Final step: login
        login({ email });
        navigate('/');
      }
    }, 800);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#faf8f5', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ background: 'white', padding: '3rem 2rem', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.05)', width: '100%', maxWidth: '440px', textAlign: 'center' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <RootedLogo size={64} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', margin: '0 0 0.5rem', color: '#1a1a1a' }}>
          {step === 1 ? 'Welcome to Rooted' : step === 2 ? 'Verify your Email' : 'Secure your Account'}
        </h1>
        <p style={{ color: '#666', margin: '0 0 2.5rem', fontSize: '0.95rem', lineHeight: '1.5' }}>
          {step === 1 
            ? 'Discover authentic items from your culture, locally.' 
            : step === 2 
            ? `We sent a 4-digit code to ${email}`
            : 'Create a password to quickly log in next time.'}
        </p>

        <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {step === 1 && (
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="#999" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e0d8d0', fontSize: '1rem', background: '#faf8f5' }}
              />
            </div>
          )}

          {step === 2 && (
            <div style={{ position: 'relative' }}>
              <Key size={20} color="#999" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" 
                placeholder="Enter 4-digit OTP" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                required
                autoFocus
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e0d8d0', fontSize: '1rem', letterSpacing: '4px', textAlign: 'center' }}
              />
            </div>
          )}

          {step === 3 && (
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="#999" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="password" 
                placeholder="Create a password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
                minLength={6}
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #e0d8d0', fontSize: '1rem', background: '#faf8f5' }}
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading || (step === 1 && !email) || (step === 2 && otp.length < 4) || (step === 3 && password.length < 6)}
            style={{ 
              background: '#204E4A', color: 'white', border: 'none', padding: '1rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, 
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem', transition: 'all 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? (
              <span style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
            ) : step === 3 ? (
              <>Complete Signup <CheckCircle2 size={20} /></>
            ) : (
              <>Continue <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
