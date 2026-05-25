"use client";

import { ArcGalleryHero } from "@/components/ui/arc-gallery-hero-component";

export default function BulkEdits() {
  // An array of image URLs related to bulk editing
  const bulkImages = [
    '/images/bulk/Chelsea Coyle_fire.jpg',
    '/images/bulk/Clarissa Wertz_fire.jpg',
    '/images/bulk/DSC_0018.jpg',
    '/images/bulk/DSC_0040.jpg',
    '/images/bulk/DSC_0101.jpg',
    '/images/bulk/DSC_0143.jpg',
    '/images/bulk/DSC_0169.jpg',
    '/images/bulk/DSC_0202.jpg',
    '/images/bulk/DSC_0241.jpg',
    '/images/bulk/DSC_0247.jpg',
    '/images/bulk/DSC_0335.jpg',
    '/images/bulk/Middltown.jpg',
  ];

  return (
    <div className="w-full">
      <ArcGalleryHero images={bulkImages} />
    </div>
  );
}
