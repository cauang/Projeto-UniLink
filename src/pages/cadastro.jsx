import Navbar from "../components/Navbar";

export function Cadastro() {
  return (
        <main className="min-h-screen w-full">
          {/* DIREITA CONSERTAR ESSA PARTE DO CODIGO*/}
          <section className="grid min-h-screen grid-cols-1 md:grid-cols-2 gap-0">
          <div className="relative bg-[#1E40FF] flex items-center justify-center overflow-hidden">

          <svg className="relative" xmlns="http://www.w3.org/2000/svg" width="530" height="607" viewBox="0 0 530 607" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M243.061 4.70984C344.08 -11.5616 469.016 13.1371 518.064 97.4432C564.291 176.902 462.842 257.032 441.159 345.214C419.587 432.942 480.924 558.045 394.922 598.235C309.015 638.381 231.579 530.417 151.752 480.458C93.4621 443.979 22.1083 417.422 4.45926 353.873C-13.6655 288.611 26.8081 227.115 65.6198 170.319C112.978 101.017 156.485 18.6548 243.061 4.70984Z" fill="#94FF8D"/>
          </svg>

          <svg className="relative w-[426px] h-[561px] z-1" viewBox="0 0 526 661" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M247.031 4.45225C311.888 13.4938 365.692 60.4527 413.925 117.438C465.431 178.291 524.477 243.638 525.969 334.006C527.477 425.385 473.786 499.204 421.23 560.054C372.224 616.793 312.485 649.937 247.031 656.962C174.47 664.749 92.5661 668.06 41.4209 600.816C-9.56762 533.778 1.65128 428.197 1.39478 334.006C1.13687 239.295 -10.7804 133.383 39.9626 65.3046C91.111 -3.31772 173.881 -5.74547 247.031 4.45225Z" fill="#B3FFAE"/>
          </svg>

          <div className="relative bg-white z-10 w-[340px] h-[460px] overflow-hidden rounded-[100%] shadow-2xl">
            <img src="/public/Up.png" alt="Entrada da Unifor" className="h-full w-full object-cover" />
          </div>
          </div>
          {/* ESQUERDA FORM DE CADASTRO */}
          
          </section>
        </main>
  );
}