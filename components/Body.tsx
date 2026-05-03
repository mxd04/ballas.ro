"use client";

import { useEffect, useState, useRef } from "react";

export default function Body() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);



  
  // --- LOGICA PENTRU COMUNICARE CU HEADER-UL ---
  useEffect(() => {
    

    
    // Funcțiile care deschid ferestrele[cite: 1]
    const handleOpenMenu = () => setIsMenuOpen(true);
    const handleOpenMap = () => setIsGalleryOpen(true);

    // Ascultăm evenimentele trimise de butoanele din Header[cite: 2]
    window.addEventListener("open-menu-popup", handleOpenMenu);
    window.addEventListener("open-map-popup", handleOpenMap);

    // Ștergem evenimentele la demontare pentru a evita bug-urile
    return () => {
      window.removeEventListener("open-menu-popup", handleOpenMenu);
      window.removeEventListener("open-map-popup", handleOpenMap);
    };


    
  }, []);
  // ----------------------------------------------


  
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
    const walk = (x - galleryStartX) * 1.5; 
    
    velocityRef.current = e.pageX - lastXRef.current;
    lastXRef.current = e.pageX;

    galleryScrollRef.current.scrollLeft = galleryScrollLeft - walk;
    updateGalleryProgress();
  };

  const applyMomentum = () => {
    if (!galleryScrollRef.current || Math.abs(velocityRef.current) < 0.5) return;
    
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
    { id: 1, name: "Stany Andrei", description: "Responsabil pentru coordonarea operațiunilor de zi cu zi și asigurarea unei experiențe impecabile.", image: "/stanea.png", phone: "1111" },
    { id: 2, name: "Zummy Lee", description: "Specialist în relații cu clienții VIP și organizare evenimente tematice.", image: "/zuumy.png", phone: "2222" }
  ];

  const galleryImages = [
    { id: 1, image: "/1.png", title: "THE ENTRANCE" },
    { id: 2, image: "/2.png", title: "LUXURY BAR" },
    { id: 3, image: "/3.png", title: "MAIN HALL" },
    { id: 4, image: "/4.png", title: "VIP LOUNGE" },
    { id: 5, image: "/5.png", title: "MAIN HALL" },
    { id: 6, image: "/6.png", title: "VIP LOUNGE" },
    { id: 7, image: "/7.png", title: "MAIN HALL" },
    { id: 8, image: "/8.png", title: "VIP LOUNGE" },
    { id: 9, image: "/10.png", title: "VIP LOUNGE" },
    { id: 10, image: "/11.png", title: "VIP LOUNGE" },
    { id: 11, image: "/12.png", title: "VIP LOUNGE" },
    { id: 12, image: "/13.png", title: "VIP LOUNGE" },
    { id: 13, image: "/14.png", title: "VIP LOUNGE" },
    
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
      className="relative w-full px-6 pt-[180px] md:pt-[250px] pb-20 min-h-screen isolate transition-all duration-500 overflow-x-hidden"
      style={{ backgroundColor: "#050505", backgroundImage: `linear-gradient(to bottom, #000000 0%, transparent 40%), radial-gradient(circle at 50% 0%, #1a1a1a 0%, #050505 100%)`, backgroundAttachment: "fixed", backgroundSize: "cover" }}
    >


      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className={`text-center mb-16 md:mb-24 transition-all duration-[1200ms] ease-out ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="font-body text-4xl md:text-6xl lg:text-7xl mb-10 text-white uppercase">BAHAMAS CLUB</h1>
          <p className="font-body text-lg md:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">Unde luxul întâlneste distractia si fiecare seara devine o amintire de neuitat.</p>
        </div>

        <div ref={revealEffect} className="group relative w-full h-[150px] md:h-[200px] mb-24 transition-all duration-[1500ms] ease-out opacity-0 translate-y-10">
          <div className="absolute inset-0 blur-[70px] opacity-100 scale-90 pointer-events-none z-0 transition-opacity duration-700 group-hover:opacity-40" style={{ backgroundImage: "url('/exterior.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/5 isolate">
            <img src="/exterior.png" alt="Bahamas" className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" style={{ objectPosition: "50% 30%" }} />
            <button onClick={() => setIsGalleryOpen(true)} className="absolute top-6 right-8 z-20 flex items-center gap-2 text-[14px] text-white uppercase drop-shadow-md hover:text-purple-400 transition-colors">Marathon Avenue <span className="text-base">↗</span></button>
          </div>
        </div>

        <div id="meniu-sectiune" className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-[50px] mb-24 items-stretch"> 
          <div onClick={() => setIsMenuOpen(true)} className="relative p-8 md:p-10 rounded-[30px] md:rounded-[40px] border border-white/10 bg-black transition-all duration-[1500ms] ease-out flex flex-col shadow-2xl overflow-hidden cursor-pointer hover:scale-[1.01] active:scale-[0.98] group">
            <div className="absolute inset-0 z-0 transition-transform duration-[2000ms] group-hover:scale-110"><img src="/B.jpg" alt="Menu Background" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" /><div className="absolute inset-0 bg-gradient-to-br from-black via-black/80 to-transparent" /></div>
            <div className="relative z-10 pointer-events-none">
              <div className="flex items-center gap-4 mb-8"><span className="h-[1px] w-10 bg-gradient-to-r from-transparent to-white/40"></span><h3 className="font-body text-sm md:text-base text-white/80 tracking-[0.3em] uppercase font-light">MENIU BAUTURI</h3></div>
              <div className="space-y-6">
                {[{ name: "APA PLATA", price: "100", note: "DORNA" }, { name: "APA MINERALA", price: "100", note: "DORNA" }, { name: "CORONA", price: "600", note: "BERE 4.5% ALC." }, { name: "VIN", price: "900", note: "CRAMA PURCARI" }, { name: "WHISKEY", price: "1000", note: "JACK DANIELS" }, { name: "RACORITOARE", price: "500", note: "COCA-COLA & FANTA & SPRITE" }].map((drink, i) => (
                  <div key={i} className="flex justify-between items-end border-b border-white/5 pb-2 transition-all duration-500 group-hover:border-white/20"><div className="flex flex-col"><span className="text-[10px] text-white/30 font-mono mb-1">0{i + 1}</span><span className="text-white/90 font-medium tracking-wide group-hover:text-white transition-all duration-500 group-hover:translate-x-1">{drink.name}</span><span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">{drink.note}</span></div><div className="flex flex-col items-end"><span className="text-white font-bold tracking-tighter text-lg">{drink.price}</span><span className="text-[18px] text-white/40 uppercase">$</span></div></div>
                ))}
              </div>
            </div>
          </div>
          <div className="group relative w-full h-full min-h-[500px] md:min-h-full transition-all duration-[1500ms]">
            <div className="absolute inset-0 blur-[30px] opacity-60 scale-120 pointer-events-none z-0" style={{ backgroundImage: "url('/bar.png')", backgroundSize: 'cover' }} />
            <div className="relative z-10 w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/5 isolate shadow-2xl">
              <img src="/bar.png" alt="Experience" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-70" /><div className="absolute inset-0 bg-black/60 transition-opacity duration-700 group-hover:opacity-0" /><div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none group-hover:scale-110 transition-all duration-700"><span className="text-white/40 text-[10px] tracking-[0.8em] uppercase mb-4">Pregatite cu pasiune de</span><h2 className="text-white text-4xl md:text-5xl font-body tracking-[0.5em] uppercase text-center">Barmanii nostri</h2></div>
            </div>
          </div>
        </div>

        <div ref={revealEffect} onClick={() => setIsGalleryOpen(true)} className="group relative w-full h-[300px] md:h-[400px] -mt-20 mb-24 cursor-pointer transition-all duration-[1500ms] ease-out opacity-0 translate-y-10">
          <div className="absolute inset-0 blur-[40px] opacity-30 scale-95 pointer-events-none z-0 transition-opacity duration-700 group-hover:opacity-60" style={{ backgroundImage: "url('/map.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 w-full h-full rounded-[30px] md:rounded-[40px] overflow-hidden border border-white/10 isolate shadow-2xl bg-[#0a0a0a]"><img src="/map.png" alt="Atmosphere" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-110" /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-80" /><div className="absolute bottom-10 left-10 z-20 transform transition-transform duration-700 group-hover:translate-x-2"><h3 className="text-white text-3xl md:text-4xl font-body tracking-widest uppercase">MAP</h3></div></div>
        </div>

        <div 
  id="events" 
  ref={revealEffect} 
  className="w-full mb-40 opacity-0 translate-y-10 transition-all duration-[1500ms]"
>
  <div className="mb-16 flex flex-col items-center text-center">
    <h2 className="text-white text-5xl md:text-7xl font-body uppercase">
      Events
    </h2>
</div>
          
          <div className="relative w-full overflow-hidden py-24 px-4 bg-white/[0.01] border border-white/5 rounded-[80px]">
            <div className="absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-40 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-40 pointer-events-none" />

            <div ref={eventScrollRef} onMouseDown={handleEventMouseDown} onMouseMove={handleEventMouseMove} onMouseUp={stopEventDragging} onMouseLeave={stopEventDragging} className="relative z-10 w-full overflow-x-auto no-scrollbar flex gap-12 px-48 cursor-grab active:cursor-grabbing select-none items-center py-12">
              {events.map((event) => (
                <div key={event.id} className={`snap-center group relative min-w-[320px] md:min-w-[400px] h-[580px] md:h-[680px] rounded-[250px] overflow-hidden border border-white/10 transition-all duration-[1000ms] cubic-bezier(0.3, 1, 0.4, 1) hover:scale-[1.03] hover:rounded-[50px] hover:border-purple-500/40 flex-shrink-0 ${event.isPast ? "grayscale-[0.5]" : ""}`}>
                  <img src={event.image} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-85" />
                  {event.isPast && <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity duration-500"><div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/10 font-mono text-[16px] text-white/50 tracking-widest uppercase">EVENIMENT FINALIZAT</div></div>}
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-14 text-center z-30">
                    <div className="px-8 py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl group-hover:bg-purple-600 transition-all duration-500"><span className="text-white text-[11px] font-bold tracking-[0.2em] uppercase">{event.date} — {event.time}</span></div>
                    <div className="w-full">
                        <h4 className="text-white text-4xl md:text-5xl font-body uppercase mb-4 tracking-tighter transition-all duration-700">{event.title}</h4>
                        <div className="max-h-0 group-hover:max-h-24 transition-all duration-700 overflow-hidden opacity-0 group-hover:opacity-100"><p className="text-white/60 text-sm italic max-w-[220px] mx-auto mb-6">{event.description}</p></div>
                        <div className="w-12 h-[2px] bg-white/20 mx-auto group-hover:w-24 group-hover:bg-purple-500 transition-all duration-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={revealEffect} className="w-full mb-32 opacity-0 translate-y-10 transition-all duration-[1500ms]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div><span className="text-purple-500 font-mono tracking-[0.4em] text-xs uppercase mb-2 block">Ce spun clienții noștri</span><h2 className="text-white text-4xl md:text-5xl font-body uppercase tracking-tighter">Review-uri</h2></div>
            <div className="flex justify-center -mb-5"><div className="animate-[bounce_10s_infinite_alternate] flex flex-col items-center"><div className="animate-[pulse_5s_infinite_alternate] bg-purple-600/20 backdrop-blur-xl border border-white/10 p-5 rounded-full flex gap-8 shadow-[0_0_50px_rgba(147,51,234,0.3)]"><div className="flex flex-col items-center"><span className="text-white text-2xl font-bold">★ {averageStars}</span><span className="text-white/40 text-[10px] uppercase tracking-widest">Rating</span></div><div className="w-[2px] h-10 bg-white/10" /><div className="flex flex-col items-center"><span className="text-white text-2xl font-bold">{reviews.length}</span><span className="text-white/40 text-[10px] uppercase tracking-widest">Review-uri</span></div></div></div></div>
            <div className="flex items-center gap-4"><div className="flex gap-2"><button onClick={() => scrollToIndex(Math.max(0, currentIdx - 1))} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button><button onClick={() => scrollToIndex(Math.min(reviews.length - 1, currentIdx + 1))} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button></div></div>
          </div>
          <div ref={carouselRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={stopDragging} onMouseLeave={stopDragging} className="flex gap-6 overflow-x-hidden cursor-grab active:cursor-grabbing py-4 select-none">
            {reviews.map((rev) => (
              <div key={rev.id} className="min-w-[300px] md:min-w-[400px] h-[300px] p-8 rounded-[35px] bg-[#0a0a0a] border border-white/5 flex flex-col justify-between hover:border-purple-500/30 transition-colors group">
                <div><div className="flex gap-1 mb-6">{[...Array(rev.stars)].map((_, i) => (<span key={i} className="text-purple-500 text-lg">★</span>))}</div><p className="text-white/70 text-lg italic leading-relaxed mb-8 break-words line-clamp-4 overflow-hidden">"{rev.text}"</p></div>
                <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase">{rev.name.charAt(0)}</div><span className="text-white font-medium uppercase tracking-widest text-sm">{rev.name}</span></div>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center"><button onClick={() => setIsReviewModalOpen(true)} className="group relative px-10 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest overflow-hidden transition-all hover:pr-14"><span className="relative z-10 text-sm">Adaugă Review</span><span className="absolute right-6 opacity-0 group-hover:opacity-100 transition-all">→</span></button></div>
        </div>

        <div id="staff-sectiune" className="w-full mt-32 mb-24">
          <h3 className="text-white text-4xl md:text-6xl mb-12 uppercase text-center w-full opacity-20" style={{ fontFamily: 'milker, sans-serif' }}>ADMINISTRATOR</h3>
          <div ref={revealEffect} className="relative w-full min-h-[450px] p-8 md:p-16 rounded-[40px] md:rounded-[60px] border border-white/10 bg-[#0a0a0a] transition-all duration-[1500ms] ease-out opacity-0 translate-y-10 mb-24 flex flex-col md:flex-row items-center gap-12 overflow-hidden group shadow-[0_0_80px_rgba(0,0,0,0.6)]">
            <div className="absolute top-0 right-0 p-10 select-none pointer-events-none opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-1000"><h3 className="text-[20rem] font-logo leading-none rotate-12 uppercase italic">Ballas</h3></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full group-hover:bg-purple-600/20 transition-colors duration-1000" />
            <div className="relative w-full md:w-[400px] h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 shrink-0 shadow-2xl z-10"><img src="/geo.png" alt="Admin" className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-transform duration-[2.5s] ease-out" /><div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" /></div>
            <div className="relative flex flex-col items-center md:items-start text-center md:text-left z-20"><div className="inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 mb-6 backdrop-blur-md"><span className="text-purple-400 font-mono tracking-[0.5em] text-[11px] uppercase">FONDATOR & PARFUMUL FEMEILOR</span></div><h3 className="text-white text-3xl md:text-6xl font-body tracking-wider uppercase mb-6 drop-shadow-2xl">Salvatore Rizzo</h3><p className="text-white/50 text-lg md:text-xl font-light max-w-2xl leading-relaxed italic border-l-2 border-purple-500/30 pl-6">"Expert în industria ospitalității de lux, dedicat creării unui spațiu unde eleganța întâlnește energia pură a nopții."</p></div>
          </div>
          
          <h3 className="text-white text-4xl md:text-6xl mt-32 mb-12 uppercase text-center w-full opacity-20" style={{ fontFamily: 'milker, sans-serif' }}>MANAGERS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
            {managersData.map((manager) => (
              <div key={manager.id} ref={revealEffect} className="relative min-h-[750px] rounded-[40px] md:rounded-[50px] border border-white/10 bg-[#0a0a0a] transition-all duration-[1500ms] ease-out opacity-0 translate-y-10 overflow-hidden group flex flex-col shadow-2xl hover:border-purple-500/30 transition-all duration-700">
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none group-hover:opacity-[0.05] transition-opacity duration-1000"><span className="text-[15rem] font-black -rotate-45 uppercase">B</span></div>
                <div className="w-full h-[500px] overflow-hidden border-b border-white/10 relative"><img src={manager.image} alt={manager.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] group-hover:brightness-110" /><div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" /></div>
                <div className="p-10 flex flex-col flex-grow justify-between relative z-10 text-center"><div><span className="text-purple-500/60 font-mono tracking-[0.6em] text-[12px] mb-3 block uppercase font-bold">Ballas MANAGER</span><h3 className="text-white text-4xl font-body tracking-[0.2em] uppercase mb-4 group-hover:tracking-[0.3em] transition-all duration-700">{manager.name}</h3><div className="w-12 h-[1px] bg-purple-500 mx-auto mb-6 group-hover:w-24 transition-all duration-700" /><p className="text-white/40 text-sm font-light leading-relaxed max-w-xs mx-auto group-hover:text-white/70 transition-colors duration-500">{manager.description}</p></div>
                  <div className="relative mt-8"><div className={`absolute -top-3 left-1/2 -translate-x-1/2 transition-all duration-500 pointer-events-none text-purple-400 text-[11px] tracking-[0.5em] uppercase font-bold ${copiedId === manager.id ? "opacity-100 -translate-y-2" : "opacity-0 translate-y-0"}`}>AI COPIAT NUMARUL!</div><button onClick={() => handleContact(manager.phone, manager.id)} className={`relative w-full py-6 rounded-2xl border transition-all duration-700 font-bold overflow-hidden group/btn backdrop-blur-sm ${copiedId === manager.id ? "border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]" : "border-white/5 text-white/40 hover:border-purple-500/50 bg-white/[0.02]"}`}><div className="absolute inset-0 bg-purple-600 -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-out z-0"></div><div className="relative z-10 h-6 overflow-hidden"><div className={`transition-all duration-500 ease-out ${copiedId === manager.id ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}><span className="text-[14px] tracking-[0.5em] uppercase group-hover/btn:text-white group-hover/btn:tracking-[0.6em] transition-all">Direct Contact</span></div><div className={`absolute inset-0 transition-all duration-500 ease-out flex items-center justify-center ${copiedId === manager.id ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}><span className="text-[14px] tracking-[0.3em] text-white font-mono">{manager.phone}</span></div></div></button></div>
                </div>
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 m-6 group-hover:border-purple-500 transition-colors" /><div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20 m-6 group-hover:border-purple-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>

        <div ref={revealEffect} className="w-full mb-40 opacity-0 translate-y-10 transition-all duration-[1500ms]">
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-white text-5xl md:text-7xl font-body uppercase">Ballas Gallery</h2>
          </div>
          
          <div className="relative w-full overflow-hidden py-16 px-4 bg-white/[0.01] border border-white/5 rounded-[80px]">
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-40 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-64 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-40 pointer-events-none" />

            <div 
              ref={galleryScrollRef} 
              onMouseDown={handleGalleryMouseDown} 
              onMouseMove={handleGalleryMouseMove} 
              onMouseUp={stopGalleryDragging} 
              onMouseLeave={stopGalleryDragging} 
              onScroll={updateGalleryProgress}
              className="relative z-10 w-full overflow-x-auto no-scrollbar flex gap-8 px-32 md:px-64 cursor-grab active:cursor-grabbing select-none items-center"
            >
              {galleryImages.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative min-w-[350px] md:min-w-[900px] h-[400px] md:h-[500px] rounded-[100px] md:rounded-[200px] overflow-hidden border border-white/10 transition-all duration-[1200ms] cubic-bezier(0.2, 1, 0.3, 1) hover:rounded-[50px] flex-shrink-0"
                >
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110 pointer-events-none" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-700" />
                </div>
              ))}
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/5 rounded-full overflow-hidden z-50">
              <div 
                className="h-full bg-purple-500 transition-all duration-300 ease-out" 
                style={{ width: '30%', marginLeft: `${galleryProgress * 0.7}%` }}
              />
            </div>
          </div>
        </div>

        <div ref={revealEffect} className="w-full opacity-0 translate-y-[-80px] transition-all duration-[1500ms] mb-20">
          <div className="relative w-full h-[250px] md:h-[300px] rounded-[150px] overflow-hidden border border-white/10 group bg-[#0a0a0a] shadow-2xl flex items-center justify-between px-10 md:px-24">
            <div className="absolute left-0 top-0 bottom-0 w-[60%] overflow-hidden">
               <img src="/pateutz.png" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" style={{ objectPosition: "20% center" }} />
               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0a0a0a]/60 to-[#0a0a0a]" />
            </div>
            <div className="relative z-10 ml-auto flex flex-col md:flex-row items-center gap-8 text-right">
              <div className="hidden md:block">
                <h3 className="text-white text-3xl font-body uppercase tracking-widest">Fa parte din povestea ballas</h3>
              </div>
              <a href="https://discord.gg/mHdtdPqzZf" target="_blank" rel="noopener noreferrer" className="group/cv relative px-12 py-5 bg-white text-black rounded-full font-bold uppercase tracking-[0.2em] text-xs transition-all hover:bg-purple-600 hover:text-white hover:px-16">
                Depune CV
                <span className="absolute right-6 opacity-0 group-hover/cv:opacity-100 transition-all">→</span>
              </a>
            </div>
            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-purple-600/20 blur-[100px] rounded-full group-hover:bg-purple-600/30 transition-all duration-1000" />
          </div>
        </div>

   {/* 3. FOOTER SECTION - COMPACT & CLEAN */}
        <footer className="w-full mt-20 pt-10 flex flex-col items-center text-center gap-6">
          
          {/* TOP ROW: BALLAS X KYOUSUKE */}
          <div className="flex items-center justify-center gap-4 md:gap-8">
            <a href="#top" className="group">
              <h1 className="font-logo text-white/30 text-3xl md:text-5xl font-body uppercase transition-all duration-500 group-hover:text-purple-600 group-hover:opacity-100">
                BALLAS
              </h1>
            </a>
            
            <div className="text-white/10 text-2xl md:text-4xl font-logo select-none">X</div>

            <a href="https://discord.gg/PrVvqJ2dn8" target="_blank" rel="noopener noreferrer" className="group">
              <h1 className="font-logo text-white/30 text-3xl md:text-5xl font-body uppercase transition-all duration-500 group-hover:text-blue-500 group-hover:opacity-100">
                kyousukE
              </h1>
            </a>
          </div>
        
          
          {/* BOTTOM ROW: SUB-LINKS */}
          <div className="flex flex-row items-center justify-center gap-6 md:gap-12 pb-16">
            <a href="https://discord.gg/C4my4AArtt" target="_blank" rel="noopener noreferrer" className="group">
              <h2 className="text-white/20 text-[10px] md:text-xs font-body uppercase tracking-[0.3em] transition-all duration-500 group-hover:text-white group-hover:opacity-100">
                PRIMARIA ATLANTIS
              </h2>
            </a>
            <a href="#" className="group">
              <h2 className="text-white/20 text-[10px] md:text-xs font-body uppercase tracking-[0.3em] transition-all duration-500 group-hover:text-white group-hover:opacity-100">
                DAF
              </h2>
            </a>
            <a href="https://discord.gg/fnqM9fFDnB" target="_blank" rel="noopener noreferrer" className="group">
              <h2 className="text-white/20 text-[10px] md:text-xs font-body uppercase tracking-[0.3em] transition-all duration-500 group-hover:text-white group-hover:opacity-100">
                Business Center
              </h2>
            </a>
          </div>

        </footer>
      </div>

      <div className={`fixed inset-0 z-[250] flex items-center justify-center p-6 transition-all duration-500 ${isReviewModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}><div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => !reviewSuccess && setIsReviewModalOpen(false)} /><div className={`relative w-full max-w-md overflow-hidden rounded-[40px] border border-white/10 transition-all duration-700 shadow-[0_0_100px_rgba(0,0,0,0.8)] ${reviewSuccess ? "bg-purple-600 scale-105" : "bg-[#0a0a0a]"}`}>{!reviewSuccess ? (<form onSubmit={handleSubmitReview} className="p-10"><h3 className="text-white text-2xl font-body uppercase mb-8 text-center tracking-widest">Lasă-ne un feedback</h3><div className="space-y-6"><input required placeholder="NUMELE TĂU" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 outline-none focus:border-purple-500 transition-colors uppercase tracking-widest text-xs" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} /><div className="flex flex-col gap-3"><span className="text-white/30 text-[10px] tracking-[0.3em] uppercase ml-2">Rating</span><div className="flex gap-4 bg-white/5 p-4 rounded-2xl justify-center">{[1, 2, 3, 4, 5].map((s) => (<button type="button" key={s} onClick={() => setNewReview({...newReview, stars: s})} className={`text-2xl transition-all ${newReview.stars >= s ? "text-purple-500 scale-125" : "text-white/10"}`}>★</button>))}</div></div><textarea required placeholder="MESAJUL TĂU" rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-white/20 outline-none focus:border-purple-500 transition-colors text-sm" value={newReview.text} onChange={(e) => setNewReview({...newReview, text: e.target.value})} /><button className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-widest hover:scale-[0.98] transition-transform">Trimite Review</button></div></form>) : (<div className="p-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500"><div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-2xl animate-bounce"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg></div><h3 className="text-white text-3xl font-body uppercase tracking-[0.3em] mb-2">Review Adăugat!</h3><p className="text-white/80 text-sm font-light uppercase tracking-widest">Mulțumim pentru feedback-ul tău.</p></div>)}</div></div>

      <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 transition-all duration-700 ${isGalleryOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}><div className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setIsGalleryOpen(false)} /><div className={`relative max-w-5xl w-full transition-all duration-700 transform ${isGalleryOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}><img src="/map.png" className="w-full rounded-2xl border border-white/10 shadow-2xl" /></div></div>
      <div className={`fixed inset-0 z-[200] flex items-center justify-center p-6 transition-all duration-700 ease-in-out ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}><div className={`absolute inset-0 bg-black/40 transition-all duration-700 ${isMenuOpen ? "backdrop-blur-[5px] bg-black/10" : ""}`} onClick={() => setIsMenuOpen(false)} /><div className={`relative w-full max-w-lg p-8 md:p-10 rounded-[40px] border border-white/10 bg-[#0a0a0a]/90 shadow-2xl transition-all duration-700 transform ${isMenuOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-12"}`} onClick={(e) => e.stopPropagation()}><div className="relative z-10"><div className="flex items-center gap-4 mb-8"><span className="h-[1px] w-8 bg-white/40"></span><h3 className="text-sm text-white tracking-[0.3em] uppercase font-light">MENIU BAUTURI</h3></div><div className="space-y-6">{[{ name: "APA PLATA", price: "100", note: "DORNA" }, { name: "APA MINERALA", price: "100", note: "DORNA" }, { name: "CORONA", price: "600", note: "BERE 4.5% ALC." }, { name: "VIN", price: "900", note: "CRAMA PURCARI" }, { name: "WHISKEY", price: "1.000", note: "JACK DANIELS" }, { name: "RACORITOARE", price: "500", note: "COCA-COLA & FANTA & SPRITE" }].map((drink, i) => (<div key={i} className="group/pop relative flex justify-between items-end border-b border-white/5 hover:border-white/20 transition-all duration-500"><div className="flex flex-col"><span className="text-[10px] text-white/30 font-mono mb-1">0{i + 1}</span><span className="text-white/90 group-hover/pop:text-white group-hover/pop:translate-x-2 transition-all duration-500 font-medium text-sm md:text-base">{drink.name}</span><span className="text-[10px] text-white/30 uppercase tracking-widest mt-1 group-hover/pop:text-white/50 transition-colors">{drink.note}</span></div><div className="flex flex-col items-end"><span className="text-white font-bold tracking-tighter text-lg">{drink.price}</span><span className="text-[18px] text-white/40 uppercase">$</span></div></div>))}</div></div></div></div>

      <style jsx global>{`


        /* Personalizare Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #050505;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #7c3aed, #a855f7);
          border-radius: 20px;
          border: 3px solid #050505;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #c084fc;
        }

        /* Pentru Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #a855f7 #050505;
        }

        /* Resetări obligatorii */
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          background-color: #050505;
          scroll-behavior: smooth !important;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        /* Animația de Reveal */
        .reveal-item {
          opacity: 0;
          transform: translateY(30px);
          filter: blur(8px);
          transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1);
        }

        .reveal-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
          filter: blur(0) !important;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        html { scroll-behavior: smooth; }
      `}</style>
    </main>
  );
}