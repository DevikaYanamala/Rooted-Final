export default function RootedLogo({ className = '', size = 48, color = 'var(--color-primary)' }) {
  // Adapt colors based on whether it's placed on a dark background (white) or light background
  const isWhite = color === 'white' || color === '#ffffff' || color === '#fff';
  const mainColor = isWhite ? 'white' : '#204E4A';
  const accentColor = isWhite ? 'rgba(255, 255, 255, 0.8)' : '#D95D39';

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Rooted Logo"
      style={{ filter: isWhite ? 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))' : 'none' }}
    >
      <title>Rooted Logo</title>
      
      {/* Outer Global Network Ring */}
      <circle cx="32" cy="32" r="30" fill={mainColor} fillOpacity="0.08" />
      <circle cx="32" cy="32" r="26" stroke={mainColor} strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
      
      {/* Trunk and Deep Root System */}
      <path 
        d="M32 16v34M20 26c0 14 12 16 12 24M44 26c0 14-12 16-12 24M20 42c0-8 8-12 12-18M44 42c0-8-8-12-12-18" 
        stroke={mainColor} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Network Nodes / Leaves */}
      <circle cx="32" cy="16" r="4" fill={accentColor} />
      <circle cx="20" cy="26" r="3" fill={accentColor} />
      <circle cx="44" cy="26" r="3" fill={accentColor} />
      
      {/* The 'Ground' / Foundation */}
      <path d="M22 52h20" stroke={accentColor} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
