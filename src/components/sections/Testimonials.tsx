"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Timothy Carr",
    role: "Art Director, DeLorenzo's ASP",
    text: "Consistently outstanding edits. Turnaround is fast and attention to brand details is spot on.",
  },
  {
    name: "Coach Ramirez",
    role: "Head Coach, Manalapan Youth Football",
    text: "Our youth football team photos look professional and bold. Parents loved the final images.",
  },
  {
    name: "Alyssa M.",
    role: "Team Parent Coordinator, East Brunswick Cheer",
    text: "Communication was easy and designs were polished.",
  },
];

export default function Testimonials() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".testimonials-title",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".testimonials-title", start: "top 80%" },
      }
    );

    gsap.fromTo(
      ".testimonial-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: { trigger: container.current, start: "top 75%" },
      }
    );
  }, { scope: container });

  return (
    <section id="testimonials" ref={container} className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-accent-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 testimonials-title">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Clients <span className="text-accent-red">Say</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="testimonial-card glassmorphism p-8 rounded-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6 text-accent-red">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>
                <p className="text-white/90 text-lg leading-relaxed italic mb-8">
                  &quot;{t.text}&quot;
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{t.name}</h4>
                <p className="text-white/50 text-sm">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
