"use client";

import { useRef, useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type PortfolioItem = { id: number, title: string, description: string, beforeImage: string, afterImage: string };

const portfolioItems: PortfolioItem[] = [
  { id: 1, title: "Manalapan Football", description: "Dynamic lighting and background swap.", beforeImage: "/images/DSC_0026 before.jpg", afterImage: "/images/DSC_0026.jpg" },
  { id: 2, title: "East Brunswick Cheer", description: "Color correction and team branding.", beforeImage: "/images/DSC_0005 Before.jpg", afterImage: "/images/DSC_0005.jpg" },
  { id: 3, title: "Jackson Cheer", description: "Composite poster design.", beforeImage: "/images/DSC_0040 Before.jpg", afterImage: "/images/DSC_0040.jpg" },
  { id: 4, title: "Hunterdown Huskies", description: "Smoke effects and sharpening.", beforeImage: "/images/DSC_0018 before.jpg", afterImage: "/images/DSC_0018.jpg" },
  { id: 5, title: "Middletown", description: "hockey poster design.", beforeImage: "/images/middletown-before.jpg", afterImage: "/images/middletown.jpg" },
  { id: 6, title: "Middletown", description: "hockey poster design.", beforeImage: "/images/middltown-before.jpg", afterImage: "/images/middltown.jpg" },
];

function BeforeAfterSlider({ item }: { item: PortfolioItem }) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleMove = (e: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleUp);
      window.addEventListener("touchmove", handleMove, { passive: false });
      window.addEventListener("touchend", handleUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[50vh] md:h-[75vh] max-h-[800px] select-none overflow-hidden touch-none bg-[#0a0a0a] rounded-xl shadow-2xl border border-white/10"
      onMouseDown={(e) => { setIsDragging(true); handleMove(e); }}
      onTouchStart={(e) => { setIsDragging(true); handleMove(e); }}
    >
      {/* AFTER IMAGE (Base Layer) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-2">
        <img src={item.afterImage} alt={`${item.title} After`} className="w-full h-full object-contain pointer-events-none rounded-lg" />
      </div>

      {/* BEFORE IMAGE (Overlay Layer with Clip Path) */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none p-2"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img src={item.beforeImage} alt={`${item.title} Before`} className="w-full h-full object-contain pointer-events-none rounded-lg" />
      </div>

      {/* Slider Divider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white/90 cursor-ew-resize z-10 shadow-[0_0_15px_rgba(0,0,0,0.8)] transition-colors hover:bg-white"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Slider Handle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40 pointer-events-none">
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 z-20 pointer-events-none">
        <span className="text-white font-bold uppercase bg-black/60 backdrop-blur-md px-3 py-1.5 rounded shadow-lg text-xs md:text-sm tracking-wider border border-white/10">Before</span>
      </div>
      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-20 pointer-events-none">
        <span className="text-accent-red font-bold uppercase bg-black/60 backdrop-blur-md px-3 py-1.5 rounded shadow-lg text-xs md:text-sm tracking-wider border border-white/10">After</span>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const containerRef = useRef<HTMLElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const animationRef = useRef<number>();
  const [expandedItem, setExpandedItem] = useState<PortfolioItem | null>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const totalCards = portfolioItems.length;
  const radius = 350; // Distance from center

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Continuous auto-scroll logic
  useEffect(() => {
    if (expandedItem || isHovered || !isDesktop) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const animate = () => {
      rotationRef.current += 0.12; // Slowed down continuous rotation speed
      if (carouselRef.current) {
        // We only modify the inner ref's transform to avoid fighting with GSAP
        carouselRef.current.style.transform = `translateZ(${-radius}px) rotateY(${-rotationRef.current}deg)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [expandedItem, isHovered, isDesktop]);

  const handleCardClick = (item: PortfolioItem) => {
    setExpandedItem(item);
    document.body.style.overflow = 'hidden';
  };

  const closeExpanded = () => {
    setExpandedItem(null);
    document.body.style.overflow = 'unset';
  };

  useGSAP(() => {
    gsap.fromTo(
      ".portfolio-title",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".portfolio-title", start: "top 80%" },
      }
    );

    // GSAP animates the outer wrapper to avoid conflicting with requestAnimationFrame on the inner wrapper
    if (isDesktop && carouselWrapperRef.current) {
      gsap.fromTo(
        carouselWrapperRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 60%" }
        }
      );
    } else {
      gsap.fromTo(
        ".mobile-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: { trigger: ".mobile-portfolio-container", start: "top 80%" }
        }
      )
    }
  }, { scope: containerRef, dependencies: [isDesktop] });

  return (
    <section id="portfolio" ref={containerRef} className="py-24 bg-[#050505] relative overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-16 portfolio-title">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Before & <span className="text-accent-red">After</span> Gallery
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Explore our interactive multi-layered transformations.
          </p>
        </div>

        {isDesktop ? (
          /* DESKTOP 3D CAROUSEL */
          <div 
            className="relative h-[500px] flex items-center justify-center" 
            style={{ perspective: '1200px' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Outer Wrapper for GSAP entrance animation */}
            <div 
              ref={carouselWrapperRef}
              className="relative w-[300px] h-[400px] md:w-[350px] md:h-[450px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Inner Wrapper for continuous 3D rotation */}
              <div
                ref={carouselRef}
                className="w-full h-full"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${-radius}px) rotateY(${-rotationRef.current}deg)`,
                }}
              >
              {portfolioItems.map((item, index) => {
                const angle = index * (360 / totalCards);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleCardClick(item)}
                    className={`absolute top-0 left-0 w-full h-full cursor-pointer group`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                    }}
                  >
                    {/* The Tilted Wrapper. Every card is tilted by default. On hover it straightens out. */}
                    <div 
                      className="w-full h-full rounded-xl overflow-hidden bg-[#111] border-8 border-white shadow-[0_15px_50px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:!transform-none origin-center" 
                      style={{ transform: 'perspective(1000px) rotateX(12deg) rotateY(-8deg) rotateZ(-6deg) scale(0.92)' }}
                    >
                      <img
                        src={item.afterImage}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40" />
  
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                        <h3 className="text-white font-bold text-xl mb-1">{item.title}</h3>
                        <p className="text-white/70 text-sm">{item.description}</p>
                      </div>
  
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-red/90 text-white rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[0_0_20px_rgba(224,27,27,0.6)] backdrop-blur-sm">
                        <Maximize2 className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          </div>
        ) : (
          /* MOBILE STACK LAYOUT */
          <div className="flex flex-col gap-12 mobile-portfolio-container px-4">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="mobile-card bg-[#111] rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              >
                <div className="p-4">
                  <BeforeAfterSlider item={item} />
                </div>
                <div className="p-6 pt-2">
                  <h3 className="text-white font-bold text-2xl mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EXPANDED MODAL (Desktop Only) */}
      {expandedItem && isDesktop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button
            onClick={closeExpanded}
            className="absolute top-6 right-6 z-50 text-white hover:text-accent-red transition-colors p-3 bg-white/10 rounded-full hover:bg-white/20 backdrop-blur-md border border-white/10"
          >
            <X size={28} />
          </button>

          <div className="w-full max-w-6xl flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-full mb-6 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{expandedItem.title}</h3>
              <p className="text-white/60 text-lg">{expandedItem.description}</p>
            </div>

            <div className="w-full">
              <BeforeAfterSlider item={expandedItem} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
