"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown } from "lucide-react";

const gridItems = [
  { id: 1, color: "bg-zinc-800", delay: "0s", image: "/images/DSC_0057.jpg" },
  { id: 2, color: "bg-zinc-700", delay: "1s", image: "/images/clarissa Wertz_fire.jpg" },
  { id: 3, color: "bg-zinc-900", delay: "2s", image: "/images/DSC_0310.jpg" },
  { id: 4, color: "bg-zinc-800", delay: "1.5s", image: "/images/DSC_0253.jpg" },
  { id: 5, color: "bg-zinc-700", delay: "0.5s", image: "/images/Chelsea Coyle_fire.jpg" },
  { id: 6, color: "bg-zinc-900", delay: "2.5s", image: "/images/DSC_0339.jpg" },
  { id: 7, color: "bg-zinc-800", delay: "1s", image: "/images/middletown.jpg" },
  { id: 8, color: "bg-zinc-700", delay: "2s", image: "/images/middltown.jpg" },
];

export default function Hero() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      ".hero-line-1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      0.3
    )
      .fromTo(
        ".hero-line-2",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.6
      )
      .fromTo(
        ".hero-subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        0.9
      )
      .fromTo(
        ".hero-btn",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" },
        1.2
      );

  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-[120vh] w-full overflow-hidden bg-black">
      {/* 4x2 Grid Background (or 2x4 on mobile) */}
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-2 p-2 w-full h-full opacity-80">
        {gridItems.map((item) => (
          <div key={item.id} className="relative w-full h-full overflow-hidden rounded-lg group">
            <div
              className={`absolute inset-0 ${item.color} transition-all duration-500 group-hover:scale-105 group-hover:brightness-125 flex justify-center items-center`}
              style={{
                animation: `kenburns 8s infinite alternate ease-in-out ${item.delay}`,
              }}
            >
              <img
                src={item.image}
                alt={`Portfolio ${item.id}`}
                className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all duration-700"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
        <h1 className="hero-line-1 text-4xl md:text-6xl font-black text-white tracking-tight uppercase drop-shadow-xl">
          Sports and Youth
        </h1>
        <h2 className="hero-line-2 text-4xl md:text-6xl font-black text-accent-red tracking-tight uppercase drop-shadow-xl mt-2">
          Photography Editing & Design
        </h2>
        <p className="hero-subtitle text-lg md:text-xl text-white mt-6 max-w-2xl font-medium drop-shadow-md">
          Transforming raw shots into professional team visuals.
        </p>

        <a
          href="#portfolio"
          className="hero-btn mt-10 inline-flex items-center gap-2 bg-accent-red text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(224,27,27,0.4)] animate-pulse hover:animate-none pointer-events-auto"
        >
          View Portfolio <ArrowDown size={20} />
        </a>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ArrowDown className="text-white/50" size={32} />
      </div>

      <style jsx global>{`
        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.06); }
        }
      `}</style>
    </section>
  );
}
