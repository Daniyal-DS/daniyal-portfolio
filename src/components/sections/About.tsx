"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, Image as ImageIcon, Paintbrush } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Camera size={32} className="text-accent-red" />,
    title: "Sports Specialist",
    description: "Expert in youth sports editing, capturing the intensity and passion of every game.",
  },
  {
    icon: <ImageIcon size={32} className="text-accent-red" />,
    title: "Custom Design",
    description: "Professional background removal, clean up, and team branding integration.",
  },
  {
    icon: <Paintbrush size={32} className="text-accent-red" />,
    title: "Versatile Artist",
    description: "Bringing a creative hobbyist eye to high-volume professional sports photography.",
  },
];

export default function About() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top 75%",
      },
    });

    tl.fromTo(
      ".about-title",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    )
      .fromTo(
        ".about-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      )
      .fromTo(
        ".feature-card",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.2 },
        "-=0.2"
      );
  }, { scope: container });

  return (
    <section id="about" ref={container} className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
      {/* Decorative red glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-red/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column */}
          <div>
            <h2 className="about-title text-4xl md:text-5xl font-bold text-white mb-6">
              About My <span className="text-accent-red">Work</span>
            </h2>
            <p className="about-text text-lg text-white/70 leading-relaxed">
              I specialize in high-impact sports photography editing and design. Working primarily with youth leagues, schools, and clubs, my goal is to deliver cinematic, broadcast-quality visuals that make every player look like a pro.
              <br /><br />
              From precision background removals to dynamic custom posters, I treat every shot with the attention to detail it deserves, transforming standard team photos into unforgettable athletic art.
            </p>
          </div>

          {/* Right Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="feature-card bg-card-dark p-6 rounded-2xl border border-white/5 hover:border-accent-red/30 transition-colors flex items-start gap-4"
              >
                <div className="bg-[#0a0a0a] p-3 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
