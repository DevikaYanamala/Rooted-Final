import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Globe2, ChevronLeft, Search, ArrowRight, MapPin } from 'lucide-react';

export default function CultureSelectorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'groceries';
  const [cultureQuery, setCultureQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cultureQuery.trim()) return;
    navigate(`/search?category=${category}&culture=${encodeURIComponent(cultureQuery.trim())}`);
  };

  // Removed scroll lock to allow scrolling on smaller screens

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
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '350px', height: '350px', background: '#204E4A', filter: 'blur(120px)', opacity: 0.4, borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: '450px', height: '450px', background: '#D95D39', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%', zIndex: 0 }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '700px',
        width: '100%',
        margin: 'auto',
        padding: '2rem'
      }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', 
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', 
            cursor: 'pointer', color: 'white', fontSize: '1rem', fontWeight: 500, 
            padding: '0.6rem 1.2rem', borderRadius: '30px', marginBottom: '3rem',
            backdropFilter: 'blur(10px)', transition: 'background 0.2s', width: 'fit-content'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          <ChevronLeft size={18} />
          <span>Back to Explore</span>
        </button>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '32px',
          padding: '3.5rem 3rem',
          boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)'
        }}>
          <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', 
                background: 'linear-gradient(135deg, rgba(32,78,74,0.8) 0%, rgba(217,93,57,0.8) 100%)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                boxShadow: '0 10px 30px rgba(217,93,57,0.3)',
                border: '2px solid rgba(255,255,255,0.2)'
              }}>
                <MapPin size={36} strokeWidth={1.5} />
              </div>
            </div>
            <p style={{ color: '#D95D39', fontStyle: 'italic', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.75rem', letterSpacing: '1px' }}>
              Every bite, a journey home.
            </p>
            <h1 style={{ fontSize: '2.8rem', margin: '0 0 1rem', color: 'white', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Rooted: Find Your Culture.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.85)', margin: '0 auto 1.5rem auto', lineHeight: 1.6, maxWidth: '550px', fontWeight: 400 }}>
              Discover authentic groceries, traditional clothing, and cultural goods from local stores across the UK.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', justifyContent: 'center', marginBottom: '1rem' }}>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.9rem', color: '#fff', backdropFilter: 'blur(10px)' }}>🌍 100+ Countries</span>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.9rem', color: '#fff', backdropFilter: 'blur(10px)' }}>📍 Proximity Store Mapping</span>
              <span style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '20px', fontSize: '0.9rem', color: '#fff', backdropFilter: 'blur(10px)' }}>🥘 Community Validated</span>
            </div>
          </header>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={24} color="rgba(255,255,255,0.5)" style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="e.g., India, Brazil, Lebanon, America..."
                value={cultureQuery}
                onChange={(e) => setCultureQuery(e.target.value)}
                autoFocus
                style={{ 
                  width: '100%', 
                  padding: '1.4rem 1.5rem 1.4rem 4.5rem', 
                  borderRadius: '20px', 
                  border: '2px solid rgba(255,255,255,0.15)', 
                  background: 'rgba(0,0,0,0.3)',
                  color: 'white',
                  fontSize: '1.25rem',
                  outline: 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#D95D39';
                  e.target.style.background = 'rgba(0,0,0,0.5)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(217,93,57,0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(0,0,0,0.3)';
                  e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
                }}
              />
            </div>

            <button 
              type="submit" 
              disabled={!cultureQuery.trim()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ 
                background: !cultureQuery.trim() ? 'rgba(255,255,255,0.1)' : isHovered ? '#c55332' : '#D95D39', 
                color: !cultureQuery.trim() ? 'rgba(255,255,255,0.4)' : 'white', 
                border: 'none', padding: '1.4rem', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 600, 
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', 
                cursor: !cultureQuery.trim() ? 'not-allowed' : 'pointer', marginTop: '1rem', 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isHovered && cultureQuery.trim() ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: isHovered && cultureQuery.trim() ? '0 15px 30px rgba(217,93,57,0.4)' : 'none'
              }}
            >
              Discover my roots <ArrowRight size={22} style={{ transition: 'transform 0.3s', transform: isHovered && cultureQuery.trim() ? 'translateX(5px)' : 'translateX(0)' }} />
            </button>
          </form>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2.5rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Globe2 size={18} /> Connecting 100+ countries to local businesses.
          </div>
        </div>
      </div>
    </div>
  );
}
