'use client';

import React, { useEffect, useState } from 'react';

// --- The ArcGalleryHero Component ---
type ArcGalleryHeroProps = {
  images: string[];
  startAngle?: number;
  endAngle?: number;
  // radius for different screen sizes
  radiusLg?: number;
  radiusMd?: number;
  radiusSm?: number;
  // size of each card for different screen sizes
  cardSizeLg?: number;
  cardSizeMd?: number;
  cardSizeSm?: number;
  // optional extra class on outer section
  className?: string;
};

export const ArcGalleryHero: React.FC<ArcGalleryHeroProps> = ({
  images,
  startAngle = 20, 
  endAngle = 160,
  radiusLg = 480,
  radiusMd = 360,
  radiusSm = 260,
  cardSizeLg = 120,
  cardSizeMd = 100,
  cardSizeSm = 80,
  className = '',
}) => {
  const [dimensions, setDimensions] = useState({
    radius: radiusLg,
    cardSize: cardSizeLg,
  });

  // Effect to handle responsive resizing of the arc and cards
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({ radius: radiusSm, cardSize: cardSizeSm });
      } else if (width < 1024) {
        setDimensions({ radius: radiusMd, cardSize: cardSizeMd });
      } else {
        setDimensions({ radius: radiusLg, cardSize: cardSizeLg });
      }
    };

    handleResize(); // Set initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [radiusLg, radiusMd, radiusSm, cardSizeLg, cardSizeMd, cardSizeSm]);

  // Calculate the EXACT original step so the spacing perfectly matches the static version
  const originalCount = Math.max(images.length, 2);
  const step = (endAngle - startAngle) / (originalCount - 1);
  
  // Fill enough images to complete a 360 degree circle seamlessly
  const totalNeeded = Math.round(360 / step);
  let displayImages = [...images];
  if (displayImages.length > 0) {
    while (displayImages.length < totalNeeded) {
      displayImages = [...displayImages, ...images];
    }
    displayImages = displayImages.slice(0, totalNeeded);
  } else {
    displayImages = Array(Math.max(totalNeeded, 1)).fill('https://placehold.co/400x400/111111/ffffff?text=Image');
  }

  return (
    <section className={`relative overflow-hidden bg-zinc-900 text-white min-h-screen flex flex-col ${className}`}>
      {/* Background ring container that controls geometry */}
      <div
        className="relative mx-auto"
        style={{
          width: '100%',
          // Give it a bit more height to prevent clipping
          height: dimensions.radius * 1.2,
        }}
      >
        {/* Center pivot for transforms - positioned at bottom center */}
        <div className="absolute left-1/2 bottom-0 w-0 h-0 group">
          {/* 
            The wheel rotates counter-clockwise.
            Hovering anywhere inside the group pauses the animation.
          */}
          <div className="absolute top-0 left-0 w-0 h-0 animate-spin-wheel group-hover:pause-animations">
            {displayImages.map((src, i) => {
              // Polar angle matches the exact static placements (20, 40, 60...)
              const polarAngle = startAngle + i * step;
              
              return (
                <div
                  key={i}
                  className="arc-item absolute left-0 top-0 transition-transform duration-300"
                  style={{
                    // Negative because CSS rotate is clockwise, but polar is counter-clockwise
                    transform: `rotate(${-polarAngle}deg)`,
                    '--base-z': totalNeeded - i,
                  } as React.CSSProperties}
                >
                  {/* Translate outward by radius */}
                  <div style={{ transform: `translateX(${dimensions.radius}px)` }}>
                    {/* The animated child that counter-rotates and applies the tilt */}
                    <div className="animate-spin-tilt group-hover:pause-animations">
                      {/* Initial counter-rotation + original tilt = polarAngle * 1.25 */}
                      <div style={{ transform: `translate(-50%, -50%) rotate(${polarAngle * 1.25}deg)` }}>
                        {/* Card */}
                        <div 
                          className="rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[#111] transition-all duration-500 ease-out cursor-pointer hover:scale-[1.35] hover:ring-2 hover:ring-white hover:shadow-[0_0_25px_8px_rgba(255,255,255,0.7)]"
                          style={{
                            width: dimensions.cardSize,
                            height: dimensions.cardSize,
                          }}
                        >
                          <img
                            src={src}
                            alt={`Bulk Edit ${i + 1}`}
                            className="block w-full h-full object-cover"
                            draggable={false}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://placehold.co/400x400/111111/ffffff?text=Image+${i+1}`;
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content positioned below the arc */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 -mt-20 md:-mt-32 lg:-mt-48 pb-20 pointer-events-none">
        <div className="text-center max-w-2xl px-6 opacity-0 animate-fade-in pointer-events-auto" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4">
            High Volume <span className="text-accent-red">Bulk Editing</span>
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Efficient and consistent editing for entire teams, leagues, and high-volume sports photography events.
          </p>
        </div>
      </div>
      
      {/* CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation-name: fade-in;
          animation-duration: 0.8s;
          animation-timing-function: ease-out;
        }

        /* Z-index handling for hover */
        .arc-item {
          z-index: var(--base-z);
        }
        .arc-item:hover {
          z-index: 50 !important;
        }

        /* Continuous slow wheel rotation (Counter-Clockwise) */
        @keyframes spin-wheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        /* 
          Tilt rotation: Needs to perfectly offset the wheel while maintaining the angle/4 tilt.
          Since wheel rotates -360, this rotates 360 * 1.25 = 450 to keep the exact mathematical tilt
          all along the path!
        */
        @keyframes spin-tilt {
          from { transform: rotate(0deg); }
          to { transform: rotate(450deg); }
        }

        .animate-spin-wheel {
          animation: spin-wheel 60s linear infinite;
        }
        .animate-spin-tilt {
          animation: spin-tilt 60s linear infinite;
        }

        /* Pausing utility for hover state */
        .pause-animations,
        .pause-animations * {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
};
