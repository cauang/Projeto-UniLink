// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-neutral-400">
        Unilink • Projeto acadêmico — {new Date().getFullYear()}
      </div>
    </footer>
  );
}
