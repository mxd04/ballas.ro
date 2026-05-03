"use client";

import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2500);

    const completeTimer = setTimeout(() => {
      document.body.style.overflow = "auto";
      onLoadingComplete();
    }, 3300);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
      document.body.style.overflow = "auto";
    };
  }, [onLoadingComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 overflow-hidden ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Container fundal cu imagine și gradiente */}
      <div className="absolute inset-0 h-full w-full overflow-hidden bg-black">
        
        <img 
          src="/ballas.jpg" 
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        {/* Gradientele tale */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.8)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)]" />

        {/* --- CARACTERE GTA STYLE --- */}
        
        {/* Caracter Stânga (Fata) */}
<div className="hidden md:block absolute left-0 bottom-0 z-10 w-[30%] max-w-[500px] animate-slide-in-left">
   <img 
     src="/man.png" 
     alt="Character Left" 
     className="w-full h-auto object-contain"
     style={{ transform: 'scale(2)', transformOrigin: 'bottom left' }} 
   />
</div>
        </div>
      {/* Logo container centrat perfect */}
      <div className="relative z-20 flex items-center justify-center animate-pulse-logo">
          <img src="/B.jpg" alt="Logo" className="w-32 h-32 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
      </div>
    </div>
  );
}