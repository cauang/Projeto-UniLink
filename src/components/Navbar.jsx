import { Link, NavLink } from "react-router-dom";
const item = ({ isActive }) =>
  `px-3 py-2 rounded-lg transition ${isActive ? "bg-white/10 text-white" : "text-white/90 hover:bg-white/10"}`;

export default function Navbar() {
  return (
    <header className="bg-[#002147] mb-[-25px]">
      <div className="container-page flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-3 text-white">
     
          <img
            src="/LogoUnifor.png"
            alt="Logo da Universidade de Fortaleza"
            className="w-full max-w-[520px] rounded-md mx-auto"
          />
        </Link>
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <NavLink to="/" className={item}>Home</NavLink>
          <NavLink to="/sobre" className={item}>Sobre</NavLink>
          <NavLink to="/faqs" className={item}>FAQs</NavLink>
          <NavLink to="/news" className={item}>News</NavLink>
          <NavLink to="/voluntarios" className={item}>Voluntários</NavLink>
          <Link to="/login" className="btn-white ml-2 w-[124px] h-[50px]">ENTRAR</Link>
        </nav>
        <Link to="/login" className="md:hidden btn-white">ENTRAR</Link>
      </div>
    </header>
  );
}
