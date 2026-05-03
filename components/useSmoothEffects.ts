// useSmoothEffects.ts
import { useEffect } from "react";

export const useSmoothEffects = () => {
  useEffect(() => {
    // 1. GESTIONARE FADE-IN (Observer)
    const observerOptions = { 
      threshold: 0.1, 
      rootMargin: "0px 0px -50px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          // Opрим observarea după ce a apărut, pentru performanță
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Selectăm doar elementele principale, nu chiar tot, pentru a evita crash-ul
    const elements = document.querySelectorAll('section, .group, h1, h2, .manager-card');
    elements.forEach((el) => {
      el.classList.add('reveal-hidden');
      observer.observe(el);
    });

    // 2. GESTIONARE BLUR DINAMIC
    let lastPos = window.pageYOffset;
    let ticking = false;

    const updateBlur = () => {
      const currentPos = window.pageYOffset;
      const diff = Math.abs(currentPos - lastPos);
      const blurAmount = Math.min(diff / 15, 10); // Max 10px blur
      
      const mainContent = document.getElementById('top');
      if (mainContent) {
        // Folosim requestAnimationFrame pentru a nu bloca thread-ul principal
        mainContent.style.filter = `blur(${blurAmount}px)`;
        mainContent.style.transition = 'filter 0.2s ease-out';
      }

      lastPos = currentPos;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBlur);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
};