"use client";

import { useEffect, useState, useRef } from "react";

export default function Body() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    const handleOpenMenu = () => setIsMenuOpen(true);
    const handleOpenMap = () => setIsGalleryOpen(true);
    window.addEventListener("open-menu-popup", handleOpenMenu);
    window.addEventListener("open-map-popup", handleOpenMap);
    return () => {
      window.removeEventListener("open-menu-popup", handleOpenMenu);
      window.removeEventListener("open-map-popup", handleOpenMap);
    };
  }, []);

  const [reviews, setReviews] = useState([
    { id: 1, name: "Marius Ionescu", stars: 5, text: "Cea mai bună atmosferă din oraș! Recomand cu drag." },
    { id: 2, name: "Elena Popa", stars: 4, text: "Cocktail-uri excelente și staff foarte amabil." },
    { id: 3, name: "Alex Vasile", stars: 5, text: "Designul locației este incredibil. O experiență de lux." },
    { id: 4, name: "Andreea M.", stars: 5, text: "Muzica este exact ce trebuie pentru o seară de neuitat." },
  ]);

  const [events] = useState([
    { id: 2, title: "RETRO VIBES", date: "15 APR", time: "21:00", description: "Hiturile anilor '90 reîncărcate.", image: "/club.jpg", isPast: true },
    { id: 1, title: "NEON NIGHT", date: "4 APR", time: "22:00", description: "Explozie de culori sub lumini UV.", image: "/after.jpg", isPast: true },
    { id: 3, title: "TECHNO TECH", date: "5 APR", time: "23:00", description: "Ritmuri underground până în zori.", image: "/galaxy.jpg", isPast: true },
    { id: 4, title: "VIP GALA", date: "17 APR", time: "20:00", description: "O seară de eleganță absolută.", image: "/clubbing.jpg", isPast: true }
  ]);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", stars: 5, text: "" });
  const [hoverStars, setHoverStars] = useState(0);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const eventScrollRef = useRef<HTMLDivElement>(null);
  const [isEventDragging, setIsEventDragging] = useState(false);
  const [eventStartX, setEventStartX] = useState(0);
  const [eventScrollLeft, setEventScrollLeft] = useState(0);

  const handleEventMouseDown = (e: React.MouseEvent) => {
    setIsEventDragging(true);
    setEventStartX(e.pageX - (eventScrollRef.current?.offsetLeft || 0));
    setEventScrollLeft(eventScrollRef.current?.scrollLeft || 0);
  };

  const handleEventMouseMove = (e: React.MouseEvent) => {
    if (!isEventDragging) return;
    e.preventDefault();
    const x = e.pageX - (eventScrollRef.current?.offsetLeft || 0);
    const walk = (x - eventStartX) * 2;
    if (eventScrollRef.current) eventScrollRef.current.scrollLeft = eventScrollLeft - walk;
  };

  const stopEventDragging = () => setIsEventDragging(false);

  // --- OPTIMIZARE GALLARY SCROLL (REMEDIERE SACADARE) ---
  const galleryScrollRef = useRef<HTMLDivElement>(null);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);
  const [galleryStartX, setGalleryStartX] = useState(0);
  const [galleryScrollLeft, setGalleryScrollLeft] = useState(0);
  const [galleryProgress, setGalleryProgress] = useState(0);  
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    setIsGalleryDragging(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (galleryScrollRef.current) {
        setGalleryStartX(e.pageX - galleryScrollRef.current.offsetLeft);
        setGalleryScrollLeft(galleryScrollRef.current.scrollLeft);
        lastXRef.current = e.pageX;
        velocityRef.current = 0;
    }
  };

  const handleGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isGalleryDragging || !galleryScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryScrollRef.current.offsetLeft;
    const walk = (x - galleryStartX) * 2; 
    velocityRef.current = e.pageX - lastXRef.current;
    lastXRef.current = e.pageX;
    galleryScrollRef.current.scrollLeft = galleryScrollLeft - walk;
    updateGalleryProgress();
  };

  const applyMomentum = () => {
    if (!galleryScrollRef.current || Math.abs(velocityRef.current) < 0.2) return;
    galleryScrollRef.current.scrollLeft -= velocityRef.current;
    velocityRef.current *= 0.95; 
    updateGalleryProgress();
    rafRef.current = requestAnimationFrame(applyMomentum);
  };

  const stopGalleryDragging = () => {
    if (!isGalleryDragging) return;
    setIsGalleryDragging(false);
    rafRef.current = requestAnimationFrame(applyMomentum);
  };

  const updateGalleryProgress = () => {
    if (galleryScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = galleryScrollRef.current;
        const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
        setGalleryProgress(progress);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current && !isDragging) {
        const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
        if (carouselRef.current.scrollLeft >= maxScroll - 1) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 1, behavior: "auto" });
        }
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isDragging]);

  const managersData = [
    { id: 1, name: "Stany Andrei", description: "Responsabil pentru coordonarea operațiunilor de zi cu zi și asigurarea unei experiențe impecabile în cadrul clubului.", image: "/stanea.png", phone: "1111" },
    { id: 2, name: "Zummy Lee", description: "Specialist în relații cu clienții VIP și organizarea evenimentelor tematice care definesc conceptul Bahamas.", image: "/zuumy.png", phone: "2222" }
  ];

  const galleryImages = [
    { id: 1, image: "/1.png" }, { id: 2, image: "/2.png" }, { id: 3, image: "/3.png" },
    { id: 4, image: "/4.png" }, { id: 5, image: "/5.png" }, { id: 6, image: "/6.png" },
    { id: 7, image: "/7.png" }, { id: 8, image: "/8.png" }, { id: 9, image: "/10.png" },
    { id: 10, image: "/11.png" }, { id: 11, image: "/12.png" }, { id: 12, image: "/13.png" },
    { id: 13, image: "/14.png" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleContact = (phone: string, id: number) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 5000);
  };

  const revealEffect = (el: HTMLDivElement | null) => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.style.opacity = "1"; el.style.transform = "translateY(0)"; } },
      { threshold: 0.1 }
    );
    observer.observe(el);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDragging = () => setIsDragging(false);

  const scrollToIndex = (index: number) => {
    setCurrentIdx(index);
    if (carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({ left: index * (width * 0.8), behavior: 'smooth' });
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSuccess(true);
    setTimeout(() => {
      setReviews([...reviews, { ...newReview, id: Date.now() }]);
      setIsReviewModalOpen(false);
      setReviewSuccess(false);
      setNewReview({ name: "", stars: 5, text: "" });
    }, 2000);
  };

  const averageStars = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.stars, 0) / reviews.length).toFixed(1) : 0;

  return (
    <main 
      id="top"
      className="relative w-full px-4 md:px-6 pt-[180px] md:pt-[250px] pb-20 min-h-screen isolate transition-all duration-500 overflow-x-hidden"
      style={{ backgroundColor: "#050505", backgroundImage: `linear-gradient(to bottom, #000000 0%, transparent 40%), radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 100%)`, backgroundAttachment: "fixed", backgroundSize: "cover" }}
    >

      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className={`text-center mb-16 md:mb-24 transition-all duration-[1200ms] ease-out ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="font-body text-5xl md:text-6xl lg:text-7xl mb-10 text-white uppercase px-2 hover:scale-105 transition-transform duration-500">BAHAMAS CLUB</h1>
          <p className="font-body text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed px-4">Unde luxul întâlneste distractia si fiecare seara devine o amintire de neuitat.</p>
        </div>

        <div ref={revealEffect} className="group relative w-full h-[150px] md:h-[200px] mb-24 transition-all duration-[1500ms] ease-out opacity-0 translate-y-10 px-2 md:px-0">
          <div className="absolute inset-0 blur-[70px] opacity-100 scale-90 pointer-events-none z-0 transition-opacity duration-700 group-hover:opacity-40" style={{ backgroundImage: "url('/exterior.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/5 isolate hover:border-white/20 transition-all duration-500">
            <img src="/exterior.png" alt="Bahamas" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" style={{ objectPosition: "50% 30%" }} />
            <button onClick={() => setIsGalleryOpen(true)} className="absolute top-4 right-4 md:top-6 md:right-8 z-20 flex items-center gap-2 text-[12px] md:text-[14px] text-white uppercase drop-shadow-md hover:text-purple-400 transition-colors bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">Marathon Avenue <span className="text-base">↗</span></button>
          </div>
        </div>

        <div id="meniu-sectiune" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[50px] mb-24 items-stretch"> 
          <div onClick={() => setIsMenuOpen(true)} className="relative p-6 md:p-10 rounded-[30px] md:rounded-[40px] border border-white/10 bg-black transition-all duration-500 flex flex-col shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:border-white/20 active:scale-[0.98] group">
            <div className="absolute inset-0 z-0 transition-transform duration-[2000ms] group-hover:scale-110"><img src="/B.jpg" alt="Menu Background" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" /><div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" /></div>
            <div className="relative z-10 pointer-events-none">
              <div className="flex items-center gap-4 mb-8"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-white/40"></span><h3 className="font-body text-sm md:text-base text-white/80 tracking-[0.3em] uppercase font-light">MENIU BAUTURI</h3></div>
              <div className="space-y-6">
                {[{ name: "APA PLATA", price: "100", note: "DORNA" }, { name: "APA MINERALA", price: "100", note: "DORNA" }, { name: "CORONA", price: "600", note: "BERE 4.5% ALC." }, { name: "VIN", price: "900", note: "CRAMA PURCARI" }, { name: "WHISKEY", price: "1000", note: "JACK DANIELS" }, { name: "RACORITOARE", price: "500", note: "COCA-COLA & FANTA & SPRITE" }].map((drink, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2 transition-all duration-500 group-hover:border-white/20"><div className="flex flex-col"><span className="text-[10px] text-white/30 font-mono mb-1">0{i + 1}</span><span className="text-white/90 font-medium tracking-wide group-hover:text-white transition-all duration-500 group-hover:translate-x-1 text-base md:text-base">{drink.name}</span><span className="text-[10px] md:text-[10px] text-white/30 uppercase tracking-widest mt-1">{drink.note}</span></div><div className="flex flex-col items-end"><span className="text-white font-bold tracking-tighter text-lg md:text-lg">{drink.price}</span><span className="text-[16px] md:text-[18px] text-white/40 uppercase">$</span></div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="group relative w-full h-[300px] md:h-full min-h-[300px] md:min-h-full transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute inset-0 blur-[30px] opacity-60 scale-120 pointer-events-none z-0" style={{ backgroundImage: "url('/bar.png')", backgroundSize: 'cover' }} />
            <div className="relative z-10 w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/5 isolate shadow-2xl">
              <img src="/bar.png" alt="Experience" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-70" /><div className="absolute inset-0 bg-black/60 transition-opacity duration-700 group-hover:opacity-0" /><div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none group-hover:scale-110 transition-all duration-700 px-4"><span className="text-white/40 text-[10px] md:text-[10px] tracking-[0.8em] uppercase mb-4 text-center">Pregatite cu pasiune de</span><h2 className="text-white text-3xl md:text-5xl font-body tracking-[0.3em] md:tracking-[0.5em] uppercase text-center">Barmanii nostri</h2></div>
            </div>
          </div>
        </div>

        <div ref={revealEffect} onClick={() => setIsGalleryOpen(true)} className="group relative w-full h-[250px] md:h-[400px] -mt-10 md:-mt-20 mb-24 cursor-pointer transition-all duration-500 hover:scale-[1.01] opacity-0 translate-y-10 px-2 md:px-0">
          <div className="absolute inset-0 blur-[40px] opacity-30 scale-95 pointer-events-none z-0 transition-opacity duration-700 group-hover:opacity-60" style={{ backgroundImage: "url('/map.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/10 isolate shadow-2xl bg-[#0a0a0a]"><img src="/map.png" alt="Atmosphere" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" /><div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 transform transition-transform duration-700 group-hover:translate-x-2"><h3 className="text-white text-2xl md:text-3xl md:text-4xl font-body tracking-widest uppercase">MAP</h3></div></div>
        </div>

        <div id="events" ref={revealEffect} className="w-full mb-40 opacity-0 translate-y-10 transition-all duration-[1500ms]">
          <div className="mb-10 md:mb-16 flex flex-col items-center text-center">
            <h2 className="text-white text-5xl md:text-7xl font-body uppercase">Events</h2>
          </div>
          <div className="relative w-full overflow-hidden py-12 md:py-24 px-2 md:px-4 bg-white/[0.01] border border-white/5 rounded-[40px] md:rounded-[80px]">
            <div ref={eventScrollRef} onMouseDown={handleEventMouseDown} onMouseMove={handleEventMouseMove} onMouseUp={stopEventDragging} onMouseLeave={stopEventDragging} className="relative z-10 w-full overflow-x-auto no-scrollbar flex gap-6 md:gap-12 px-6 md:px-48 cursor-grab active:cursor-grabbing select-none items-center py-6 md:py-12">
              {events.map((event) => (
                <div key={event.id} className={`snap-center group relative min-w-[280px] md:min-w-[400px] h-[450px] md:h-[680px] rounded-[140px] md:rounded-[250px] overflow-hidden border border-white/10 transition-all duration-[1000ms] cubic-bezier(0.3, 1, 0.4, 1) hover:scale-[1.03] hover:rounded-[50px] hover:border-purple-500/40 flex-shrink-0 ${event.isPast ? "grayscale-[0.5]" : ""}`}>
                  <img src={event.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85" />
                  {event.isPast && <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-500 text-center px-4"><div className="bg-black/60 backdrop-blur-md px-4 md:px-6 py-2 rounded-full border border-white/10 font-mono text-[14px] md:text-[16px] text-white/50 tracking-widest uppercase">EVENIMENT FINALIZAT</div></div>}
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-8 md:p-14 text-center z-30">
                    <div className="px-5 py-2 md:px-8 md:py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl group-hover:bg-purple-600 transition-all duration-500"><span className="text-white text-[11px] md:text-[11px] font-bold tracking-[0.2em] uppercase">{event.date} — {event.time}</span></div>
                    <div className="w-full">
                        <h4 className="text-white text-3xl md:text-5xl font-body uppercase mb-2 md:mb-4 tracking-tighter transition-all duration-700">{event.title}</h4>
                        <div className="max-h-0 group-hover:max-h-24 transition-all duration-700 overflow-hidden opacity-0 group-hover:opacity-100 px-2"><p className="text-white/60 text-[12px] md:text-sm italic max-w-[220px] mx-auto mb-6">{event.description}</p></div>
                        <div className="w-8 md:w-12 h-[2px] bg-white/20 mx-auto group-hover:w-24 group-hover:bg-purple-500 transition-all duration-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={revealEffect} className="w-full mb-32 opacity-0 translate-y-10 transition-all duration-[1500ms] px-2 md:px-0">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6 text-center md:text-left">
            <div><span className="text-purple-500 font-mono tracking-[0.4em] text-[12px] md:text-xs uppercase mb-2 block">Ce spun clienții noștri</span><h2 className="text-white text-4xl md:text-5xl font-body uppercase tracking-tighter">Review-uri</h2></div>
            <div className="flex justify-center"><div className="flex flex-col items-center"><div className="bg-purple-600/20 backdrop-blur-xl border border-white/10 p-3 md:p-5 rounded-full flex gap-4 md:gap-8 shadow-[0_0_50px_rgba(147,51,234,0.3)]"><div className="flex flex-col items-center"><span className="text-white text-xl md:text-2xl font-bold">★ {averageStars}</span><span className="text-white/40 text-[10px] md:text-[10px] uppercase tracking-widest">Rating</span></div><div className="w-[1px] md:w-[2px] h-8 md:h-10 bg-white/10" /><div className="flex flex-col items-center"><span className="text-white text-xl md:text-2xl font-bold">{reviews.length}</span><span className="text-white/40 text-[10px] md:text-[10px] uppercase tracking-widest">Review-uri</span></div></div></div></div>
            <div className="hidden md:flex items-center gap-4"><div className="flex gap-2"><button onClick={() => scrollToIndex(Math.max(0, currentIdx - 1))} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button><button onClick={() => scrollToIndex(Math.min(reviews.length - 1, currentIdx + 1))} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button></div></div>
          </div>
          <div ref={carouselRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={stopDragging} onMouseLeave={stopDragging} className="flex gap-4 md:gap-6 overflow-x-auto md:overflow-x-hidden no-scrollbar cursor-grab active:cursor-grabbing py-4 select-none px-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="min-w-[260px] md:min-w-[400px] h-[250px] md:h-[300px] p-6 md:p-8 rounded-[30px] md:rounded-[35px] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between hover:border-purple-500/50 hover:scale-[1.02] transition-all group">
                <div><div className="flex gap-1 mb-4 md:mb-6">{[...Array(rev.stars)].map((_, i) => (<span key={i} className="text-purple-500 text-base md:text-lg">★</span>))}</div><p className="text-white/70 text-base md:text-lg italic leading-relaxed mb-4 md:mb-8 break-words line-clamp-3 md:line-clamp-4 overflow-hidden">"{rev.text}"</p></div>
                <div className="flex items-center gap-3 md:gap-4"><div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-[12px] md:text-xs uppercase">{rev.name.charAt(0)}</div><span className="text-white font-medium uppercase tracking-widest text-[12px] md:text-sm">{rev.name}</span></div>
              </div>
            ))}
          </div>
          <div className="mt-8 md:mt-12 flex justify-center"><button onClick={() => setIsReviewModalOpen(true)} className="group relative px-8 py-4 md:px-10 md:py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest overflow-hidden transition-all hover:pr-14 hover:bg-purple-600 hover:text-white"><span className="relative z-10 text-[12px] md:text-sm">Adaugă Review</span><span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all">→</span></button></div>
        </div>

        <div id="staff-sectiune" className="w-full mt-24 md:mt-32 mb-24 px-2 md:px-0">
          <h3 className="text-white text-4xl md:text-6xl mb-12 uppercase text-center w-full opacity-20" style={{ fontFamily: 'milker, sans-serif' }}>ADMINISTRATOR</h3>
          <div ref={revealEffect} className="relative w-full min-h-[400px] p-6 md:p-16 rounded-[40px] md:rounded-[60px] border border-white/10 bg-[#0a0a0a] transition-all duration-500 opacity-0 translate-y-10 mb-24 flex flex-col md:flex-row items-center gap-8 md:gap-12 overflow-hidden group shadow-2xl hover:border-purple-500/30">
            <div className="hidden md:block absolute top-0 right-0 p-10 select-none pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000"><h3 className="text-[20rem] font-logo leading-none rotate-12 uppercase italic">Ballas</h3></div>
            <div className="relative w-full md:w-[400px] h-[350px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 shrink-0 z-10"><img src="/geo.png" alt="Admin" className="w-full h-full object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110" /><div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" /></div>
            <div className="relative flex flex-col items-center md:items-start text-center md:text-left z-20"><div className="inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6 backdrop-blur-md"><span className="text-purple-400 font-mono tracking-[0.5em] text-[11px] md:text-[11px] uppercase">FONDATOR & PARFUMUL FEMEILOR</span></div><h3 className="text-white text-3xl md:text-6xl font-body tracking-wider uppercase mb-6">Salvatore Rizzo</h3><p className="text-white/50 text-base md:text-2xl font-light max-w-2xl leading-relaxed italic border-l-0 md:border-l-2 border-purple-500/30 pl-0 md:pl-6 px-4 md:px-0">"Expert în industria ospitalității de lux, dedicat creării unui spațiu unde eleganța întâlnește energia pură a nopții."</p></div>
          </div>
          
          <h3 className="text-white text-4xl md:text-6xl mt-32 mb-12 uppercase text-center w-full opacity-20" style={{ fontFamily: 'milker, sans-serif' }}>MANAGERS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            {managersData.map((manager) => (
              <div key={manager.id} ref={revealEffect} className="relative min-h-[600px] md:min-h-[750px] rounded-[40px] md:rounded-[50px] border border-white/10 bg-[#0a0a0a] transition-all duration-500 opacity-0 translate-y-10 overflow-hidden group flex flex-col hover:border-purple-500/40 hover:scale-[1.01] shadow-xl">
                <div className="w-full h-[350px] md:h-[500px] overflow-hidden border-b border-white/10 relative"><img src={manager.image} alt={manager.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" /><div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" /></div>
                <div className="p-6 md:p-10 flex flex-col flex-grow justify-between relative z-10 text-center"><div><span className="text-purple-500/60 font-mono tracking-[0.6em] text-[12px] md:text-[12px] mb-3 block uppercase font-bold">Ballas MANAGER</span><h3 className="text-white text-3xl md:text-4xl font-body tracking-[0.2em] uppercase mb-4">{manager.name}</h3><p className="text-white/40 text-sm md:text-lg font-light leading-relaxed max-w-md mx-auto">{manager.description}</p></div>
                  <div className="relative mt-8"><div className={`absolute -top-3 left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-none text-purple-400 text-[12px] tracking-[0.5em] uppercase font-bold ${copiedId === manager.id ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0"}`}>AI COPIAT NUMARUL!</div><button onClick={() => handleContact(manager.phone, manager.id)} className={`relative w-full py-5 md:py-6 rounded-2xl border transition-all duration-700 font-bold overflow-hidden group/btn backdrop-blur-sm ${copiedId === manager.id ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]" : "border-white/5 text-white/40 bg-white/[0.02] hover:border-white/20"}`}><div className="relative z-10 h-6 overflow-hidden flex items-center justify-center"><span className="text-[12px] md:text-[14px] tracking-[0.3em] md:tracking-[0.5em] uppercase group-hover/btn:text-white transition-all">{copiedId === manager.id ? manager.phone : "Direct Contact"}</span></div></button></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={revealEffect} className="w-full mb-40 opacity-0 translate-y-10 transition-all duration-[1500ms]">
          <div className="mb-10 md:mb-16 flex flex-col items-center text-center px-4"><h2 className="text-white text-5xl md:text-7xl font-body uppercase text-center">Ballas Gallery</h2></div>
          <div className="relative w-full overflow-hidden py-12 md:py-16 px-2 md:px-4 bg-white/[0.01] border border-white/5 rounded-[40px] md:rounded-[80px]">
            <div ref={galleryScrollRef} onMouseDown={handleGalleryMouseDown} onMouseMove={handleGalleryMouseMove} onMouseUp={stopGalleryDragging} onMouseLeave={stopGalleryDragging} onScroll={updateGalleryProgress} className="relative z-10 w-full overflow-x-auto no-scrollbar flex gap-6 md:gap-8 px-8 md:px-64 cursor-grab active:cursor-grabbing select-none items-center will-change-scroll">
              {galleryImages.map((item) => (
                <div key={item.id} className="group relative min-w-[300px] md:min-w-[900px] h-[250px] md:h-[500px] rounded-[60px] md:rounded-[200px] overflow-hidden border border-white/10 transition-all duration-700 hover:rounded-[40px] hover:border-white/30 flex-shrink-0"><img src={item.image} className="absolute inset-0 w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-1000" /></div>
              ))}
            </div>
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 w-32 md:w-48 h-1 bg-white/5 rounded-full overflow-hidden z-50"><div className="h-full bg-purple-500 transition-all duration-300 ease-out" style={{ width: '30%', marginLeft: `${galleryProgress * 0.7}%` }} /></div>
          </div>
        </div>

        <div ref={revealEffect} className="w-full opacity-0 translate-y-[-40px] md:translate-y-[-80px] transition-all duration-[1500ms] mb-20 px-2">
          <div className="relative w-full h-[180px] md:h-[300px] rounded-[80px] md:rounded-[150px] overflow-hidden border border-white/10 bg-[#0a0a0a] shadow-2xl flex items-center justify-between px-6 md:px-24 hover:border-purple-500/20 transition-all duration-500">
            <div className="absolute left-0 top-0 bottom-0 w-[80%] md:w-[60%] overflow-hidden"><img src="/pateutz.png" className="w-full h-full object-cover opacity-60 md:opacity-100" style={{ objectPosition: "20% center" }} /><div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/60 to-[#0a0a0a]" /></div>
            <div className="relative z-10 ml-auto flex flex-col md:flex-row items-center gap-4 md:gap-8 text-right">
              <div className="hidden md:block"><h3 className="text-white text-2xl md:text-3xl font-body uppercase tracking-widest">Fa parte din povestea ballas</h3></div>
              <a href="https://discord.gg/mHdtdPqzZf" target="_blank" rel="noopener noreferrer" className="px-8 py-4 md:px-12 md:py-5 bg-white text-black rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs hover:bg-purple-600 hover:text-white transition-all hover:scale-105">Depune CV</a>
            </div>
          </div>
        </div>

        <footer className="w-full mt-20 pt-10 flex flex-col items-center text-center gap-6 px-4">
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <a href="#top" className="group"><h1 className="font-logo text-purple-600 md:text-white/30 text-3xl md:text-5xl font-body uppercase transition-all duration-500 md:group-hover:text-purple-600 md:group-hover:opacity-100">BALLAS</h1></a>
            <div className="text-white/10 text-2xl md:text-4xl font-logo select-none">X</div>
            <a href="https://discord.gg/PrVvqJ2dn8" target="_blank" rel="noopener noreferrer" className="group"><h1 className="font-logo text-blue-500 md:text-white/30 text-3xl md:text-5xl font-body uppercase transition-all duration-500 md:group-hover:text-blue-500 md:group-hover:opacity-100">kyousukE</h1></a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12 pb-16">
            <a href="https://discord.gg/hXgpz4H3zD" target="_blank" className="text-white/20 hover:text-white transition-colors text-[10px] md:text-xs font-body uppercase tracking-[0.2em]">PRIMARIA ATLANTIS</a>
            <a href="#" target="_blank" className="text-white/20 hover:text-white transition-colors text-[10px] md:text-xs font-body uppercase tracking-[0.2em]">DAF</a>
            <a href="https://discord.gg/fnqM9fFDnB" target="_blank" className="text-white/20 hover:text-white transition-colors text-[10px] md:text-xs font-body uppercase tracking-[0.2em]">Business Center</a>
          </div>
        </footer>
      </div>

      {/* MODAL REVIEW */}
      <div className={`fixed inset-0 z-[250] flex items-center justify-center p-4 md:p-6 transition-all duration-500 ${isReviewModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => !reviewSuccess && setIsReviewModalOpen(false)} />
        <div className={`relative w-full max-w-md overflow-hidden rounded-[30px] md:rounded-[40px] border border-white/10 transition-all duration-700 ${reviewSuccess ? "bg-purple-600 scale-105" : "bg-[#0a0a0a]"}`}>
          {!reviewSuccess ? (
            <form onSubmit={handleSubmitReview} className="p-8 md:p-10">
              <h3 className="text-white text-2xl md:text-2xl font-body uppercase mb-8 text-center tracking-widest">Lasă-ne un feedback</h3>
              <div className="space-y-6">
                <input required placeholder="NUMELE TĂU" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-[12px] uppercase" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-white/40 text-[12px] tracking-widest uppercase">Rating-ul tău</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onMouseEnter={() => setHoverStars(star)} onMouseLeave={() => setHoverStars(0)} onClick={() => setNewReview({...newReview, stars: star})} className="transition-all duration-300 transform hover:scale-125">
                        <span className={`text-4xl md:text-4xl ${ (hoverStars || newReview.stars) >= star ? "text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-white/10" }`}>★</span>
                      </button>
                    ))}
                  </div>
                </div>
                <textarea required placeholder="MESAJUL TĂU" rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-base" value={newReview.text} onChange={(e) => setNewReview({...newReview, text: e.target.value})} />
                <button className="w-full bg-white text-black py-4 md:py-5 rounded-2xl font-bold uppercase text-[12px] md:text-xs tracking-widest hover:bg-purple-600 hover:text-white transition-colors">Trimite Review</button>
              </div>
            </form>
          ) : (
            <div className="p-10 md:p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-white text-2xl md:text-3xl font-body uppercase tracking-[0.3em]">Review Adăugat!</h3>
            </div>
          )}
        </div>
      </div>

      <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-all duration-700 ${isGalleryOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}><div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsGalleryOpen(false)} /><div className="relative max-w-5xl w-full"><img src="/map.png" className="w-full rounded-2xl border border-white/10" /></div></div>
      
      <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 transition-all duration-700 ease-in-out ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}><div className="absolute inset-0 bg-black/40 backdrop-blur-[5px]" onClick={() => setIsMenuOpen(false)} /><div className="relative w-full max-w-lg p-6 md:p-10 rounded-[30px] md:rounded-[40px] border border-white/10 bg-[#0a0a0a]/90 shadow-2xl transition-all"><div className="relative z-10"><h3 className="text-sm md:text-sm text-white tracking-[0.3em] uppercase mb-8">MENIU BAUTURI</h3><div className="space-y-6">{[{ name: "APA PLATA", price: "100" }, { name: "CORONA", price: "600" }, { name: "VIN", price: "900" }, { name: "WHISKEY", price: "1.000" }, { name: "RACORITOARE", price: "500" }].map((drink, i) => (<div key={i} className="flex justify-between items-end border-b border-white/5"><div className="flex flex-col mb-2"><span className="text-white/90 font-medium text-base md:text-base uppercase">{drink.name}</span></div><div className="flex items-end gap-1 mb-2"><span className="text-white font-bold text-lg md:text-lg">{drink.price}</span><span className="text-[16px] text-white/40 uppercase">$</span></div></div>))}</div></div></div></div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, #7c3aed, #a855f7); border-radius: 20px; border: 3px solid #050505; }
        html, body { margin: 0; padding: 0; overflow-x: hidden; background-color: #050505; scroll-behavior: smooth !important; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media (max-width: 768px) { ::-webkit-scrollbar { width: 2px; } }
      `}</style>
    </main>
  );
}