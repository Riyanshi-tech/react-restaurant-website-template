import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera } from "lucide-react";
import chef1 from "@/assets/images/chef-1.webp";
import chef2 from "@/assets/images/chef-2.webp";
import chef3 from "@/assets/images/chef-3.webp";
import ourStory from "@/assets/images/our-story.webp";
import ambience1 from "@/assets/images/ambience-1.webp";
import dishSteak from "@/assets/images/dish-steak.webp";
import dishCoffee from "@/assets/images/dish-coffee.webp";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  { id: 1, image: ourStory, title: "Redwood Sanctuary", colSpan: "col-span-12 md:col-span-6", aspect: "aspect-[4/3]" },
  { id: 2, image: dishSteak, title: "Wood-Fired Ribeye", colSpan: "col-span-6 md:col-span-3", aspect: "aspect-[3/4]" },
  { id: 3, image: chef1, title: "Chef Aarav", colSpan: "col-span-6 md:col-span-3", aspect: "aspect-[3/4]" },
  { id: 4, image: chef2, title: "Pastry Craft Sloane", colSpan: "col-span-6 md:col-span-3", aspect: "aspect-[3/4]" },
  { id: 5, image: dishCoffee, title: "Siphon Brewing", colSpan: "col-span-6 md:col-span-3", aspect: "aspect-[3/4]" },
  { id: 6, image: ambience1, title: "Rainforest Terraces", colSpan: "col-span-12 md:col-span-6", aspect: "aspect-[4/3]" },
  { id: 7, image: chef3, title: "Grillmaster Diego", colSpan: "col-span-12 md:col-span-6", aspect: "aspect-[16/9]" }
];

const GallerySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Create a smooth parallax scroll animation for individual gallery cards
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item) => {
        const img = item.querySelector("img");
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true
              }
            }
          );
        }

        // Staggered initial fade-in as they enter viewport
        gsap.from(item, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-forest-950 py-24 md:py-32 border-t border-gold-300/5 overflow-hidden"
    >
      {/* Candlelight glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-primary/5 rounded-full filter blur-[110px] pointer-events-none animate-candle"></div>

      <div className="container-width relative z-10 space-y-16">
        
        {/* Header Block */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <Camera className="h-4.5 w-4.5 text-primary" />
            <span className="text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
              Chapter 08
            </span>
          </div>
          <h2 className="font-playfair text-4xl sm:text-5xl text-foreground font-semibold leading-tight">
            The Visual Tapestry
          </h2>
          <p className="font-inter text-muted-foreground text-sm leading-relaxed">
            Glance behind the curtain. A cinematic anthology documenting our kitchen rhythms, ingredients, and the rainforest tables.
          </p>
        </div>

        {/* Asymmetric Magazine-Style Grid */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`gallery-item ${item.colSpan} relative rounded-2xl overflow-hidden border border-gold-300/10 shadow-lg bg-forest-900 group`}
            >
              {/* Aspect box container to anchor layout shapes */}
              <div className={`w-full relative overflow-hidden ${item.aspect}`}>
                
                {/* Parallax Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover select-none transform scale-110"
                />

                {/* Glassmorphic gradient sweep overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/20 to-transparent opacity-60 z-10 transition-opacity duration-300 group-hover:opacity-40" />

                {/* Floating caption reveal */}
                <div className="absolute bottom-6 left-6 z-20 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-inter text-[9px] uppercase tracking-widest text-primary font-bold">Forest Chronicles</p>
                  <h4 className="font-playfair text-lg text-foreground font-semibold">{item.title}</h4>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GallerySection;
