"use client";

import { useRef, useState, useEffect } from "react";

// --- Interactive Particle Background ---
function InteractiveParticles({ 
  mouseRef, 
  isHoveringRef 
}: { 
  mouseRef: React.MutableRefObject<{x: number, y: number}>, 
  isHoveringRef: React.MutableRefObject<boolean> 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    interface Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      size: number;
    }

    let particles: Particle[] = [];
    
    const initParticles = () => {
      particles = [];
      const density = 45; 
      for (let x = 0; x < width; x += density) {
        for (let y = 0; y < height; y += density) {
          const px = x + (Math.random() - 0.5) * 20;
          const py = y + (Math.random() - 0.5) * 20;
          particles.push({
            x: px,
            y: py,
            originX: px,
            originY: py,
            vx: 0,
            vy: 0,
            size: Math.random() * 1.5 + 0.5
          });
        }
      }
    };

    initParticles();

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const isHovering = isHoveringRef.current;
      
      particles.forEach(p => {
        if (isHovering) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200) {
            const force = (200 - dist) / 200;
            p.vx -= (dx / dist) * force * 1.5;
            p.vy -= (dy / dist) * force * 1.5;
          }
        }
        
        p.vx += (p.originX - p.x) * 0.05;
        p.vy += (p.originY - p.y) * 0.05;
        
        p.vx *= 0.85;
        p.vy *= 0.85;
        
        p.x += p.vx;
        p.y += p.vy;
        
        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.15 + speed * 0.1})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.min(p.size + speed * 0.15, 3), 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [mouseRef, isHoveringRef]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0 pointer-events-none" />;
}

export default function ParallaxShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const rawMouseRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sectionRef.current) return;
    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    
    rawMouseRef.current = { x: e.clientX - left, y: e.clientY - top };
    
    let x = ((e.clientX - left) / width - 0.5) * 2;
    let y = ((e.clientY - top) / height - 0.5) * 2;
    x = Math.max(-1, Math.min(1, x));
    y = Math.max(-1, Math.min(1, y));
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    isHoveringRef.current = true;
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    isHoveringRef.current = false;
    setMousePos({ x: 0, y: 0 });
  };

  // Ultra-smooth easing for the 3D transforms
  const transitionStyle = {
    transition: isHovering 
      ? "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)" 
      : "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="py-24 bg-[#0a0a0a] border-t border-white/5 overflow-hidden relative"
      style={{ perspective: "1500px" }}
    >
      <InteractiveParticles mouseRef={rawMouseRef} isHoveringRef={isHoveringRef} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16 relative z-10 pointer-events-none">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          The Art Behind <span className="text-accent-red">Every Shot</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          Hover to experience the depth
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center relative z-10">
        {/* Master 3D Tilt Wrapper */}
        <div
          className="relative inline-block"
          style={{
            transformStyle: "preserve-3d",
            transform: isHovering 
               ? `rotateY(${mousePos.x * 30}deg) rotateX(${mousePos.y * -30}deg)` 
               : "rotateY(0deg) rotateX(0deg)",
            transition: isHovering ? "transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)" : "transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* Base Card (Pushed back slightly into the screen on hover) */}
          <div 
             className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] bg-black"
             style={{
               ...transitionStyle,
               transform: isHovering ? "translateZ(-30px)" : "translateZ(0px)"
             }}
          >
            <img src="/images/background.png" alt="sizing" className="w-auto h-full max-h-[75vh] md:max-h-[80vh] opacity-0 pointer-events-none block object-contain" />

            {/* Layer 1: Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <img src="/images/background.png" alt="Background" className="absolute inset-0 w-full h-full object-contain scale-[1.05]" />
            </div>

            {/* Dynamic Glare Overlay */}
            <div 
               className="absolute inset-0 pointer-events-none mix-blend-overlay z-50"
               style={{
                 transition: isHovering ? "opacity 0.2s, background 0.1s" : "opacity 0.8s",
                 opacity: isHovering ? 0.7 : 0,
                 background: `radial-gradient(circle at ${50 + mousePos.x * 60}% ${50 + mousePos.y * 60}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 60%)`
               }}
            />
          </div>

          {/* --- True 3D Extruded Layers --- */}
          {/* These layers are totally flat when not hovering, and push massively into Z-space on hover! */}

          {/* Layer 2: Smoke/Fog/Net */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              ...transitionStyle,
              transform: isHovering ? "translateZ(60px)" : "translateZ(0px)"
            }}
          >
            <img src="/images/Smoke.png" alt="Smoke" className="absolute inset-0 w-full h-full object-contain mix-blend-screen opacity-50" />
          </div>

          {/* Layer 3: Subject/Player */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              ...transitionStyle,
              transform: isHovering ? "translateZ(140px)" : "translateZ(0px)"
            }}
          >
            <img src="/images/Subject (1).png" alt="Subject" className="absolute inset-0 w-full h-full object-contain" />
          </div>

          {/* Layer 4: Text/Titles */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              ...transitionStyle,
              transform: isHovering ? "translateZ(220px)" : "translateZ(0px)"
            }}
          >
            <img src="/images/Title and Name.png.png" alt="Text" className="absolute inset-0 w-full h-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}
