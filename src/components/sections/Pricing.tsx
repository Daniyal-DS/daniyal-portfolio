"use client";

import { ModernPricingPage, PricingCardProps } from "@/components/ui/animated-glassy-pricing";

const pricingPlans: PricingCardProps[] = [
  { 
    planName: 'Volume / Standard Edit', 
    description: 'Efficient, repetitive processing perfect for large rosters and standard team photos.', 
    pricePrefix: 'Starts at $',
    price: '1', 
    priceSuffix: '/ image',
    features: [
      'Clean Background Removal', 
      'Uniform Color Correction', 
      'Basic Retouching',
      'Fast Bulk Turnaround'
    ], 
    buttonText: 'Get Custom Quote', 
    buttonVariant: 'secondary',
    onCtaClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  },
  { 
    planName: 'Advanced Custom Edit', 
    description: 'Complex, time-intensive edits tailored specifically to each individual photo.', 
    pricePrefix: 'Starts at $',
    price: '5', 
    priceSuffix: '/ image',
    features: [
      'Complex Cutoff & Pose Fixes', 
      'Dynamic Lighting Adjustment', 
      'Custom Background Blending', 
      'Individualized Detail Work'
    ], 
    buttonText: 'Get Custom Quote', 
    isPopular: true, 
    buttonVariant: 'primary',
    onCtaClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  },
  { 
    planName: 'Premium Design / 3D', 
    description: 'High-end graphical posters, composites, and interactive 3D parallax layers.', 
    pricePrefix: 'Starts at $',
    price: '15', 
    priceSuffix: '/ design',
    features: [
      '3D Parallax Layouts', 
      'Advanced VFX (Smoke, Fire)', 
      'Multi-layer PSD Delivery', 
      'Unlimited Revisions'
    ], 
    buttonText: 'Get Custom Quote', 
    buttonVariant: 'secondary',
    onCtaClick: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative w-full overflow-hidden">
      <ModernPricingPage
        title={
          <>
            Scalable Pricing for <span className="text-accent-red">Every Scope</span>
          </>
        }
        subtitle={
          <>
            From bulk processing to high-end 3D posters, pay only for the complexity of the edit. <br />
            <span className="font-bold text-accent-red mt-2 inline-block">Volume discounts available for entire leagues and large rosters.</span>
          </>
        }
        plans={pricingPlans}
        showAnimatedBackground={true}
      />
    </section>
  );
}
