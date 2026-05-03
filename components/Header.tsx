"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  onOpenMap?: () => void;
  onOpenMenu?: () => void;
}

export default function Header({ onOpenMap, onOpenMenu }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const navLinks = [
    { 
      name: "MENIU", 
      action: () => {
        window.dispatchEvent(new Event("open-menu-popup"));
        onOpenMenu?.(); 
      }
    },
    { 
      name: "HARTA", 
      action: () => {
        window.dispatchEvent(new Event("open-map-popup"));
        onOpenMap?.();
      }
    },
    { 
      name: "STAFF", 
      action: () => scrollToSection("staff-sectiune") 
    },
    { 
      name: "EVENTS", 
      action: () => scrollToSection("events") 
    },
    { 
      name: "DEPUNE CV", 
      action: () => window.open("https://discord.gg/mHdtdPqzZf", "_blank") 
    },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex flex-col items-center animate-header-drop bg-transparent">
      <div 
        style={{
          left: '50%',
          transform: isScrolled 
            ? 'translateX(calc(-150% - var(--logo-offset))) scale(1)' 
            : 'translateX(-50%) scale(1)',
        }}
        className={`fixed transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) z-[110] transform-gpu
          [--logo-offset:100px] md:[--logo-offset:450px] ${
          isScrolled ? "top-6 md:top-6" : "top-6 md:top-8"
        }`}
      >
        <div className="relative flex items-center justify-center">
          <div className={`absolute inset-0 bg-purple-600/30 blur-[40px] rounded-full transition-opacity duration-700 ${isScrolled ? "opacity-100" : "opacity-0"}`} />
          <h1 className={`font-logo text-7xl md:text-7xl text-purple-800 transition-all duration-700 ${isScrolled ? "opacity-0 blur-md" : "opacity-100"}`}>
            Ballas
          </h1>
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${isScrolled ? "opacity-100 scale-100" : "opacity-0 scale-150 pointer-events-none"}`}>
            <img src="/B.jpg" alt="Logo" className="h-12 md:h-16 w-auto object-contain rounded-full shadow-2xl" />
          </div>
        </div>
      </div>

      <nav 
        style={{
          left: '50%',
          transform: isScrolled 
            ? 'translateX(calc(-50% + var(--nav-offset)))' 
            : 'translateX(-50%)',
        }}
        className={`fixed transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1) z-[105] flex items-center gap-1 md:gap-2 p-1 md:p-1.5 rounded-full backdrop-blur-[5px] shadow-2xl
          [--nav-offset:100px] md:[--nav-offset:380px] ${
          isScrolled ? "top-6 md:top-6" : "top-[100px] md:top-[120px]"
        }`}
      >
        {navLinks.map((link, idx) => (
          <button
            key={idx}
            onClick={link.action}
            className="group relative overflow-hidden px-3 py-2 md:px-5 md:py-3 rounded-full transition-all duration-500"
          >
            <div className="absolute inset-0 bg-purple-800 -translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
            <span className="relative z-20 text-[9px] md:text-[12px] tracking-[0.2em] font-bold text-white/90 group-hover:text-white transition-colors uppercase">
              {link.name}
            </span>
          </button>
        ))}
      </nav>
    </header>
  );
}