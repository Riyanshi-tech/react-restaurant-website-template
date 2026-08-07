import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Quote } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  {
    author: "Elena Rostova",
    role: "Culinary Critic, Prestige",
    quote: "A rare triumph of atmospheric integration. Eating Chef Aarav's Geisha-infused lamb ribs beneath the redwood branches felt like a spiritual communion with the soil.",
    rating: "5/5 Stars"
  },
  {
    author: "Marcus Vance",
    role: "Founder, Wild Sourcing Guild",
    quote: "Forest Feast does not simply cook with organic ingredients; they celebrate the lifeforce of the rain forest. The cedar trout is wood-fired alchemy at its zenith.",
    rating: "Gold Standard"
  },
  {
    author: "Sienna Thorne",
    role: "Traveler & Food Columnist",
    quote: "We spent three hours on the glass deck above the stream. The mist rolling in, the glow of candlelight, and the scent of wild pine needles make this a culinary sanctuary.",
    rating: "Unforgettable"
  }
];

const GuestExperience = () => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Infinite loop for marquee horizontal translation
    const ctx = gsap.context(() => {
      gsap.to(".marquee-content", {
        xPercent: -50,
        repeat: -1,
        duration: 20,
        ease: "linear"
      });

      // Staggered reveal of guest review cards
      gsap.from(".review-card", {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".review-trigger",
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={marqueeRef}
      className="relative min-h-screen bg-forest-900/40 py-24 md:py-32 border-t border-gold-300/5 overflow-hidden flex flex-col justify-between"
    >
      {/* Candlelight glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none animate-candle"></div>

      {/* Chapter header */}
      <div className="container-width text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="inline-block text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
          Chapter 07
        </span>
        <h2 className="font-playfair text-4xl sm:text-5xl text-foreground font-semibold leading-tight">
          The Guest Chronicle
        </h2>
        <p className="font-inter text-muted-foreground text-sm leading-relaxed">
          Echoes of journeys taken under the emerald canopy. Here is how critics, botanists, and weary travelers describe their feast.
        </p>
      </div>

      {/* Seamless Marquee Slider */}
      <div className="w-full bg-forest-950/80 border-y border-gold-300/10 py-6 overflow-hidden select-none mb-16 relative">
        <div className="flex whitespace-nowrap marquee-content w-[200%]">
          {/* Repeating sequence of descriptive luxury tags */}
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-16 items-center inline-block px-8">
              <span className="font-playfair text-2xl sm:text-3xl text-primary font-semibold tracking-wider italic">
                Immersive Sanctuary
              </span>
              <Sparkles className="h-5 w-5 text-gold-300/40" />
              <span className="font-playfair text-2xl sm:text-3xl text-foreground/90 font-semibold tracking-wider">
                Wood-Fired Alchemy
              </span>
              <Sparkles className="h-5 w-5 text-gold-300/40" />
              <span className="font-playfair text-2xl sm:text-3xl text-primary font-semibold tracking-wider italic">
                Candlelight Gastronomy
              </span>
              <Sparkles className="h-5 w-5 text-gold-300/40" />
              <span className="font-playfair text-2xl sm:text-3xl text-foreground/90 font-semibold tracking-wider">
                Sourcing Sincerity
              </span>
              <Sparkles className="h-5 w-5 text-gold-300/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Guest reviews cards grid */}
      <div className="container-width review-trigger grid grid-cols-1 md:grid-cols-3 gap-8 z-10">
        {REVIEWS.map((rev) => (
          <div
            key={rev.author}
            className="review-card bg-forest-glass border border-gold-300/5 hover:border-primary/20 transition-all duration-300 rounded-2xl p-8 flex flex-col justify-between group relative gold-sweep"
          >
            <div className="space-y-4">
              <Quote className="h-8 w-8 text-primary/20 transform group-hover:rotate-12 transition-transform duration-300" />
              <p className="font-inter text-xs sm:text-sm text-muted-foreground leading-relaxed italic">
                "{rev.quote}"
              </p>
            </div>

            <div className="pt-6 border-t border-gold-300/5 mt-6 flex justify-between items-center text-xs">
              <div>
                <p className="font-playfair text-sm text-foreground font-semibold">{rev.author}</p>
                <p className="font-inter text-[9px] text-muted-foreground uppercase tracking-wider">{rev.role}</p>
              </div>
              <span className="font-inter text-[9px] tracking-wider uppercase text-primary font-bold bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                {rev.rating}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default GuestExperience;
