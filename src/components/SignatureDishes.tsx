import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Compass } from "lucide-react";
import { useLenis } from "@studio-freight/react-lenis";
import dishSteak from "@/assets/images/dish-steak.webp";
import dishCoffee from "@/assets/images/dish-coffee.webp";
import ourStory from "@/assets/images/our-story.webp";

gsap.registerPlugin(ScrollTrigger);

const DISHES = [
  {
    id: "01",
    name: "Oak-Smoked Wagyu Ribeye",
    category: "Main Course",
    price: "$95",
    image: dishSteak,
    description: "Lineage Wagyu wood-fired over forest red oak. Encrusted with edible 24k gold leaf, local truffle compound butter, and wild rosemary smoke.",
    ingredients: ["A5 Wagyu", "Truffle Butter", "Forest Oak Smoke", "Gold Flakes"],
    recommended: true
  },
  {
    id: "02",
    name: "Siphon Geisha Coffee Ritual",
    category: "Coffee Craft",
    price: "$28",
    image: dishCoffee,
    description: "Rare Panama Geisha siphon-brewed tableside. Warm backlighting reveals floral notes of jasmine, orange blossom, and wild honey.",
    ingredients: ["Panama Geisha Beans", "Filtered Forest Spring Water", "Tableside Siphon"],
    recommended: true
  },
  {
    id: "03",
    name: "Pine Needle & Moss Sorbet",
    category: "Dessert",
    price: "$24",
    image: ourStory, // Reused in a gorgeous dark vertical card
    description: "Sustainably harvested Douglas fir needle oil churned into silk sorbet. Served over candied forest berries and crystallized moss shards.",
    ingredients: ["Douglas Fir Oil", "Wild Berries", "Sugared Forest Moss"],
    recommended: false
  }
];

const SignatureDishes = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Refs for tracking mouse/touch dragging states
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollYRef = useRef(0);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      { translateX: 0 },
      {
        translateX: "-200vw", // Moves through the 3 cards (each is 100vw wide virtually, offset correctly)
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "+=2000",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      }
    );

    return () => {
      pin.scrollTrigger?.kill();
    };
  }, []);

  // Dragging event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow left mouse button drag
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollYRef.current = window.scrollY;
    
    // Disable text/image selection during drag
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    
    const dx = e.clientX - startXRef.current;
    
    // Scale horizontal delta to vertical scroll:
    // 2000px vertical scroll range corresponds to 200vw horizontal translation
    const totalHorizontalScroll = 2 * window.innerWidth;
    const scrollRatio = 2000 / totalHorizontalScroll;
    
    const targetScrollY = startScrollYRef.current - dx * scrollRatio;
    
    if (lenis) {
      lenis.scrollTo(targetScrollY, { immediate: true });
    } else {
      window.scrollTo(0, targetScrollY);
    }
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startScrollYRef.current = window.scrollY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    
    const dx = e.touches[0].clientX - startXRef.current;
    const totalHorizontalScroll = 2 * window.innerWidth;
    const scrollRatio = 2000 / totalHorizontalScroll;
    
    const targetScrollY = startScrollYRef.current - dx * scrollRatio;
    
    if (lenis) {
      lenis.scrollTo(targetScrollY, { immediate: true });
    } else {
      window.scrollTo(0, targetScrollY);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  return (
    <div id="signature" ref={triggerRef} className="relative z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-forest-950 via-forest-900 to-forest-950 pointer-events-none" />

      {/* Title Header (Sticky or normal above horizontal container) */}
      <div
        className="h-screen w-full flex overflow-hidden cursor-grab active:cursor-grabbing select-none"
        style={{ width: "300vw" }}
        ref={sectionRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Intro Slide (Horizontal Title Card) */}
        <div className="h-screen w-screen flex flex-col justify-center px-12 md:px-24 shrink-0 bg-forest-950 relative">
          {/* Subtle grid background lines */}
          <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-gold-300 h-full"></div>
            ))}
          </div>

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-primary animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
                Chapter 03
              </span>
            </div>
            <h2 className="font-playfair text-5xl sm:text-7xl text-foreground font-semibold leading-[1.1]">
              The Editorial Gastronomy
            </h2>
            <p className="font-inter text-muted-foreground text-sm sm:text-base leading-relaxed">
              Scroll horizontally or drag with your pointer to walk through our signature compositions. Each selection is a micro-narrative of forest harvesting, wood-fire alchemy, and premium luxury presentation.
            </p>
            <div className="inline-flex items-center gap-3 text-primary text-xs tracking-widest font-semibold uppercase animate-pulse">
              Drag or Scroll Down to Advance Gallery ──→
            </div>
          </div>
        </div>

        {/* Dish Slides */}
        {DISHES.map((dish) => (
          <div
            key={dish.id}
            className="h-screen w-screen flex items-center justify-center shrink-0 bg-forest-900/60 px-6 md:px-20 relative overflow-hidden"
          >
            {/* Ambient candlelight element per dish */}
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-[80px] pointer-events-none animate-candle"></div>

            <div className="container-width grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
              
              {/* Left Column: Dish Image with 3D Hover & Steam Simulation */}
              <div className="lg:col-span-6 flex justify-center relative drag-gallery">
                <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-gold-300/15 shadow-2xl bg-forest-950 group">
                  
                  {/* Glowing gold light sweep hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-65 z-10" />

                  {/* Steam particles rising overlay */}
                  <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                    <div className="absolute bottom-6 left-1/3 w-0.5 h-16 bg-gradient-to-t from-transparent via-white/10 to-transparent blur-[2px] steam-particle" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute bottom-6 left-1/2 w-0.5 h-16 bg-gradient-to-t from-transparent via-white/15 to-transparent blur-[2px] steam-particle" style={{ animationDelay: '1.5s' }}></div>
                    <div className="absolute bottom-6 left-2/3 w-0.5 h-16 bg-gradient-to-t from-transparent via-white/8 to-transparent blur-[2px] steam-particle" style={{ animationDelay: '3s' }}></div>
                  </div>

                  <img
                    src={dish.image}
                    alt={dish.name}
                    draggable="false"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                  />
                  
                  {/* Category overlay */}
                  <span className="absolute top-6 left-6 z-25 text-[9px] tracking-[4px] uppercase bg-forest-950/80 border border-gold-300/10 text-gold-300 px-3 py-1.5 rounded-full backdrop-blur-md">
                    {dish.category}
                  </span>
                </div>
              </div>

              {/* Right Column: Culinary specs & Editorial Copy */}
              <div className="lg:col-span-6 space-y-6 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-playfair text-6xl text-primary/10 font-bold select-none">{dish.id}</span>
                  {dish.recommended && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      Chef Recommendation
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-playfair text-3xl sm:text-4xl text-foreground font-semibold leading-tight">
                    {dish.name}
                  </h3>
                  <p className="font-playfair text-2xl text-primary font-medium">{dish.price}</p>
                </div>

                <p className="font-inter text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-lg">
                  {dish.description}
                </p>

                {/* Ingredient nodes list */}
                <div className="space-y-2">
                  <span className="font-inter text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Ingredients</span>
                  <div className="flex flex-wrap gap-2">
                    {dish.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="font-inter text-[10px] bg-forest-950 border border-gold-300/5 text-gold-300 px-3 py-1.5 rounded-md hover:border-primary/20 hover:text-primary transition-all duration-300"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default SignatureDishes;
