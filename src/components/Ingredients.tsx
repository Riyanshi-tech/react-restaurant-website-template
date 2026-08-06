import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Compass, Leaf, ShieldCheck, MapPin } from "lucide-react";
import heroBg from "@/assets/images/hero-bg.webp";

gsap.registerPlugin(ScrollTrigger);

const INGREDIENTS = [
  {
    name: "Douglas Fir Needles",
    origin: "Canopy Valley, North Ridge",
    farmer: "Elias Vance, Forager",
    uses: "Aromatic oils, Sorbet bases, Syrups",
    details: "Hand-clipped only at dawn when terpene and essential oil concentrations are peaked. Imbues our dishes with bright piney notes."
  },
  {
    name: "Wild Chanterelles",
    origin: "Mossy Slopes, Redwood Basin",
    farmer: "Kiran & Priya, Mycologists",
    uses: "Frittatas, Wood-fired sauces, Broth bases",
    details: "Naturally harvested in moist moss pockets at the foot of ancient redwoods. Shipped fresh to our kitchen daily."
  },
  {
    name: "Shade-Grown Geisha",
    origin: "Chiriquí Highlands, Cooperative",
    farmer: "Federico Gomez, Estate Farmer",
    uses: "Siphon brew, Hand-drip, Espresso craft",
    details: "Grown under a dense native forest canopy which slows ripening. This develops clean jasmine aromas and a honey body."
  },
  {
    name: "Mountain Lavender",
    origin: "Sunny Clearings, Alder Creek",
    farmer: "Amara Okoye, Botanist",
    uses: "Tarts, Lavender-distilled gin, Syrups",
    details: "Cultivated in forest clearings using sustainable rain-fed agriculture. Offers delicate floral sweetness with zero bitterness."
  }
];

const Ingredients = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered slide up of cards as they scroll in
      gsap.from(".ingredient-card", {
        y: 60,
        opacity: 0,
        stagger: 0.12,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          toggleActions: "play none none none"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="ingredients"
      className="relative min-h-screen bg-forest-950 py-24 md:py-32 border-t border-gold-300/5 overflow-hidden flex items-center"
    >
      {/* Candlelight glow */}
      <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-primary/5 rounded-full filter blur-[90px] pointer-events-none animate-candle"></div>

      <div className="container-width relative z-10 w-full space-y-16">
        
        {/* Header Block */}
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="inline-block text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
            Chapter 06
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl text-foreground font-semibold leading-tight">
            The Sourcing Sincerity
          </h2>
          <p className="font-inter text-muted-foreground text-sm leading-relaxed">
            Hover over each element to reveal its origin coordinates, harvesting story, and the local hands responsible for cultivating its purity.
          </p>
        </div>

        {/* Interactive Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INGREDIENTS.map((ing) => (
            <div
              key={ing.name}
              className="ingredient-card group relative h-80 w-full rounded-2xl overflow-hidden border border-gold-300/10 shadow-xl bg-forest-900/60 backdrop-blur-md cursor-pointer transition-all duration-500 hover:border-primary/30"
              style={{ perspective: "1000px" }}
            >
              
              {/* Inner container to hold card flipping */}
              <div 
                className="w-full h-full relative transition-transform duration-700 ease-out transform"
                style={{ transformStyle: "preserve-3d" }}
              >
                
                {/* Front Side */}
                <div 
                  className="absolute inset-0 p-8 flex flex-col justify-between"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300">
                      <Leaf className="h-5 w-5" />
                    </div>
                    <h3 className="font-playfair text-xl text-foreground font-semibold tracking-wide">
                      {ing.name}
                    </h3>
                  </div>

                  <div className="space-y-2 border-t border-gold-300/5 pt-4">
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      <span>{ing.origin}</span>
                    </div>
                    <p className="text-[9px] tracking-widest text-primary uppercase font-bold">
                      Reveal Sourcing details →
                    </p>
                  </div>
                </div>

                {/* Back Side (Revealed on Hover) */}
                <div 
                  className="absolute inset-0 p-8 bg-forest-950 border border-primary/30 rounded-2xl flex flex-col justify-between transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="space-y-3">
                    <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-primary">Sourcing Story</span>
                    <p className="font-inter text-xs text-foreground/90 leading-relaxed">
                      {ing.details}
                    </p>
                  </div>

                  <div className="space-y-2 pt-4 border-t border-gold-300/10">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Cultivator:</span>
                      <span className="font-semibold text-foreground">{ing.farmer}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-muted-foreground">Uses:</span>
                      <span className="font-semibold text-primary">{ing.uses}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* Global Sourcing Accordion Accent */}
        <div className="p-8 rounded-2xl border border-gold-300/15 bg-forest-glass max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-playfair text-lg text-foreground font-semibold">100% Traceable Ingredients</h4>
              <p className="font-inter text-xs text-muted-foreground">Every mushroom, drop of honey, and coffee bean is trace-linked to direct organic partners.</p>
            </div>
          </div>
          <a href="#story" className="text-xs font-semibold tracking-widest text-primary uppercase border border-primary/20 hover:bg-primary/5 hover:border-primary px-6 py-3.5 rounded-full transition-all duration-300 shrink-0">
            Read Sourcing Manifesto
          </a>
        </div>

      </div>
    </div>
  );
};

export default Ingredients;
