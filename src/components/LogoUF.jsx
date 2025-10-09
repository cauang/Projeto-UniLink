export default function LogoUF({ className = "h-7 w-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0ea5e9"/><stop offset="1" stopColor="#1d4ed8"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#g)"/>
      <path d="M8 15l8-4 8 4-8 4-8-4zm8 6l-6-3v-2l6 3 6-3v2l-6 3z" fill="white"/>
    </svg>
  );
}
