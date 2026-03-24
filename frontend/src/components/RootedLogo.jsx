export default function RootedLogo({ className = '', size = 48, title = 'Rooted' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <path d="M24 4C24 4 12 14 12 26a12 12 0 0 0 24 0C36 14 24 4 24 4Z" fill="var(--color-primary)" opacity="0.15" />
      <path d="M24 8C24 8 16 16 16 25a8 8 0 0 0 16 0C32 16 24 8 24 8Z" fill="var(--color-primary)" opacity="0.35" />
      <path d="M24 44V20" stroke="var(--color-secondary)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 28C20 24 16 26 14 28" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M24 22C28 18 32 20 34 22" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}
