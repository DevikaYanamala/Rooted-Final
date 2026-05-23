import { useNavigate } from 'react-router-dom';
import { ShoppingBag, UtensilsCrossed, Sparkles, Shirt, HeartPulse, ArrowRight } from 'lucide-react';
import RootedLogo from '../components/RootedLogo';

const CATEGORIES = [
  { id: 'groceries', title: 'Groceries', desc: 'Authentic ingredients & spices', icon: ShoppingBag, color: '#D95D39' },
  { id: 'food', title: 'Food Items', desc: 'Prepared cultural meals & sweets', icon: UtensilsCrossed, color: '#F2A900' },
  { id: 'home', title: 'Home & Decor', desc: 'Traditional decor & homeware', icon: Sparkles, color: '#0891B2' },
  { id: 'fashion', title: 'Cultural Fashion', desc: 'Traditional clothing & accessories', icon: Shirt, color: '#7C3AED' },
  { id: 'wellness', title: 'Wellness & Beauty', desc: 'Ayurvedic & natural cultural remedies', icon: HeartPulse, color: '#059669' },
];

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#111',
      backgroundImage: `
        linear-gradient(to bottom, rgba(10, 22, 20, 0.55), rgba(10, 22, 20, 0.85)),
        url("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=2000")
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      {/* Floating particles/accents */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: '350px', height: '350px', background: '#204E4A', filter: 'blur(120px)', opacity: 0.4, borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '15%', right: '10%', width: '450px', height: '450px', background: '#D95D39', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem', width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }}>
              <RootedLogo size={64} color="white" />
            </div>
          </div>
          <p style={{ color: '#D95D39', fontStyle: 'italic', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.75rem', letterSpacing: '1px' }}>
            Every bite, a journey home.
          </p>
          <h1 style={{ fontSize: '3.2rem', margin: '0 0 1rem', color: 'white', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Rooted: Find Your Culture.
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'rgba(255,255,255,0.85)', margin: '0 auto 1.5rem auto', maxWidth: '600px', lineHeight: 1.6, fontWeight: 400 }}>
            Discover authentic groceries, traditional clothing, and cultural goods from local stores across the UK.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center' }}>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', fontSize: '0.9rem', color: '#fff', backdropFilter: 'blur(10px)' }}>🌍 100+ Countries</span>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', fontSize: '0.9rem', color: '#fff', backdropFilter: 'blur(10px)' }}>📍 Local Stores</span>
            <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', fontSize: '0.9rem', color: '#fff', backdropFilter: 'blur(10px)' }}>🥘 Community Validated</span>
          </div>
          
          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                const element = document.getElementById('categories-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(217,93,57,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              style={{
                background: '#D95D39',
                color: 'white',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '30px',
                fontSize: '1.15rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              Start Discovering <ArrowRight size={20} />
            </button>
          </div>
        </header>

        <h2 id="categories-section" style={{ color: 'white', textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 500, letterSpacing: '0.5px', paddingTop: '2rem' }}>
          What are you looking for today?
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/culture?category=${cat.id}`)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '24px', 
                  padding: '2.5rem 2rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = `0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 20px ${cat.color}40`;
                  e.currentTarget.style.borderColor = cat.color;
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
              >
                <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: `linear-gradient(135deg, ${cat.color}CC 0%, ${cat.color} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: 'white', boxShadow: `0 8px 20px ${cat.color}60` }}>
                  <Icon size={36} strokeWidth={2} />
                </div>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', color: 'white', fontWeight: 600 }}>{cat.title}</h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.5 }}>{cat.desc}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
}
