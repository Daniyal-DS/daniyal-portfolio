"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scissors, LayoutTemplate, MonitorUp, Printer } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Background Removal",
    description: "Flawless extractions to isolate players from messy gym or field backgrounds.",
    icon: <Scissors size={40} className="text-white" />,
  },
  {
    title: "Custom Sports Templates",
    description: "High-energy, structured PSD templates designed specifically for your team's colors.",
    icon: <LayoutTemplate size={40} className="text-white" />,
  },
  {
    title: "Poster & Banner Design",
    description: "Cinematic composites for end-of-year banquets, senior nights, and social media.",
    icon: <MonitorUp size={40} className="text-white" />,
  },
  {
    title: "Print-Ready Exports",
    description: "Perfectly sized, color-corrected files ready for large format printing without quality loss.",
    icon: <Printer size={40} className="text-white" />,
  },
];

export default function Services() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".services-title",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: { trigger: ".services-title", start: "top 80%" },
      }
    );

    gsap.fromTo(
      ".service-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.15,
        scrollTrigger: { trigger: container.current, start: "top 75%" },
      }
    );
  }, { scope: container });

  return (
    <section id="services" ref={container} className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 services-title">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Services <span className="text-accent-red">Offered</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Comprehensive post-production solutions for high-volume sports photography.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className="service-card bg-[#111111] p-8 rounded-xl border-t-4 border-accent-red border-x border-b border-white/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(224,27,27,0.15)] flex flex-col items-start"
            >
              <div className="bg-accent-red p-4 rounded-lg mb-6 shadow-lg shadow-accent-red/20">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-white/60 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
