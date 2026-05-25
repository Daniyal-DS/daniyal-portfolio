"use client";

import { useState } from "react";
import { Mail, Copy, CheckCircle2 } from "lucide-react";
import { PulseBeams, type BeamPath } from "@/components/ui/pulse-beams";

const beams: BeamPath[] = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["0%", "0%", "200%"],
        x2: ["0%", "0%", "180%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 0 },
    },
    connectionPoints: [{ cx: 6.5, cy: 398.5, r: 6 }, { cx: 269, cy: 220.5, r: 6 }]
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 1 },
    },
    connectionPoints: [{ cx: 851, cy: 34, r: 6.5 }, { cx: 568, cy: 200, r: 6 }]
  },
  {
    path: "M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 0.5 },
    },
    connectionPoints: [{ cx: 142, cy: 427, r: 6.5 }, { cx: 425.5, cy: 274, r: 6 }]
  },
  {
    path: "M493 274V333.226C493 338.749 497.477 343.226 503 343.226H760C765.523 343.226 770 347.703 770 353.226V427",
    gradientConfig: {
      initial: { x1: "40%", x2: "50%", y1: "160%", y2: "180%" },
      animate: { x1: "0%", x2: "10%", y1: "-40%", y2: "-20%" },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 1.5 },
    },
    connectionPoints: [{ cx: 770, cy: 427, r: 6.5 }, { cx: 493, cy: 274, r: 6 }]
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: {
        x1: ["40%", "0%", "0%"],
        x2: ["10%", "0%", "0%"],
        y1: ["0%", "0%", "180%"],
        y2: ["20%", "20%", "200%"],
      },
      transition: { duration: 2, repeat: Infinity, repeatType: "loop", ease: "linear", repeatDelay: 2, delay: 0.8 },
    },
    connectionPoints: [{ cx: 420.5, cy: 6.5, r: 6 }, { cx: 380, cy: 168, r: 6 }]
  }
];

const gradientColors = {
  start: "#e01b1b",
  middle: "#ff6b6b",
  end: "#4a0000"
};

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "daniyal.photoworks@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <section id="contact" className="bg-black relative flex flex-col items-center overflow-hidden">
      <PulseBeams
        beams={beams}
        gradientColors={gradientColors}
        baseColor="rgba(255,255,255,0.05)"
        accentColor="rgba(224,27,27,0.3)"
        className="py-32 relative flex flex-col items-center w-full"
      >
        {/* Red decorative divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-accent-red rounded-full" />

        <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Let&apos;s Work <span className="text-accent-red">Together</span>
        </h2>
        <p className="text-white/60 text-lg mb-12">
          Ready to elevate your team&apos;s visual presence?
        </p>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-red/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-accent-red/10 transition-colors" />
          
          <Mail size={48} className="text-accent-red mx-auto mb-6" />
          
          <button
            onClick={handleCopy}
            className="group/btn flex items-center justify-center gap-3 w-full md:w-auto mx-auto bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent-red/50 transition-all rounded-full py-4 px-6 md:px-8 mb-6"
          >
            <span className="text-white font-mono text-lg md:text-xl tracking-tight">
              {email}
            </span>
            {copied ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : (
              <Copy className="text-white/50 group-hover/btn:text-white transition-colors" size={20} />
            )}
          </button>
          
          <p className="text-white/40 text-sm">
            I typically respond within 24 hours.
          </p>

          {/* Toast Notification */}
          <div 
            className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
              copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
            }`}
          >
            <CheckCircle2 size={16} />
            Copied!
          </div>
        </div>
        </div>
      </PulseBeams>
    </section>
  );
}
