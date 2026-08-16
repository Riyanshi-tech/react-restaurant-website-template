import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Compass } from "lucide-react";
import { useLenis } from "@studio-freight/react-lenis";
import dishPizza from "@/assets/images/dish-pizza.webp";
import dishBurger from "@/assets/images/dish-burger.webp";
import dishNoodles from "@/assets/images/dish-noodles.webp";

gsap.registerPlugin(ScrollTrigger);

const DISHES = [
  {
    id: "01",
    name: "Forest Fire Wood-Fired Pizza",
    category: "Signature Pizza",
    price: "$18",
    image: dishPizza,
    description: "Artisanal crust baked in our custom wood-fire clay oven. Topped with fresh buffalo mozzarella, vine-ripened tomatoes, and wild forest mushrooms.",
    ingredients: ["Clay-Oven Crust", "Buffalo Mozzarella", "Forest Mushrooms", "Basil Leaves"],
    recommended: true
  },
  {
    id: "02",
    name: "Jungle King Craft Burger",
    category: "Gourmet Burgers",
    price: "$16",
    image: dishBurger,
    description: "Double-stack prime beef patty charcoal-grilled to perfection. Served with mature cheddar cheese, crispy lettuce, ripe tomatoes, and our signature jungle-style sauce.",
    ingredients: ["Prime Beef", "Mature Cheddar", "Artisanal Brioche", "Jungle Sauce"],
    recommended: true
  },
  {
    id: "03",
    name: "Panda's Special Sichuan Noodles",
    category: "Wok Specialty",
    price: "$14",
    image: dishNoodles,
    description: "Hand-pulled wheat noodles tossed in a fiery Sichuan chili oil. Tossed with forest scallions, crushed peanuts, toasted sesame, and fresh aromatic greens.",
    ingredients: ["Hand-pulled Noodles", "Sichuan Chili Oil", "Forest Scallions", "Crushed Peanuts"],
    recommended: false
  }
];

const SignatureDishes = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for tracking mouse/touch dragging states
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollYRef = useRef(0);

  useEffect(() => {
    let ctx = gsap.context(() => {});
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      ctx.add(() => {
        gsap.fromTo(
          sectionRef.current,
          { translateX: 0 },
          {
            translateX: "-300vw", // Moves through the 4 cards (1 intro + 3 dishes)
            ease: "none",
            scrollTrigger: {
              id: "signatureTrigger",
              trigger: triggerRef.current,
              start: "top top",
              end: "+=3000",
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const index = Math.round(self.progress * 3);
                setActiveIndex(index);
              }
            }
          }
        );
      });
    });

    return () => {
      ctx.revert();
      mm.revert();
    };
  }, []);

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (window.innerWidth >= 1024) return;
    const container = e.currentTarget;
    const index = Math.round(container.scrollLeft / window.innerWidth);
    setActiveIndex(index);
  };

  const scrollToSlide = (index: number) => {
    if (window.innerWidth >= 1024) {
      const scrollTriggerInstance = ScrollTrigger.getById("signatureTrigger");
      if (scrollTriggerInstance) {
        const start = scrollTriggerInstance.start;
        const end = scrollTriggerInstance.end;
        const totalScroll = end - start;
        const targetScroll = start + (index / 3) * totalScroll;
        
        if (lenis) {
          lenis.scrollTo(targetScroll);
        } else {
          window.scrollTo({ top: targetScroll, behavior: "smooth" });
        }
      }
    } else {
      if (sectionRef.current) {
        sectionRef.current.scrollTo({
          left: index * window.innerWidth,
          behavior: "smooth"
        });
      }
    }
  };

  // Dragging event handlers (desktop only)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    if (e.button !== 0) return;
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollYRef.current = window.scrollY;
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024 || !isDraggingRef.current) return;
    
    const dx = e.clientX - startXRef.current;
    const totalHorizontalScroll = 3 * window.innerWidth;
    const scrollRatio = 3000 / totalHorizontalScroll;
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
    if (window.innerWidth < 1024) return;
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
    startScrollYRef.current = window.scrollY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.innerWidth < 1024 || !isDraggingRef.current) return;
    
    const dx = e.touches[0].clientX - startXRef.current;
    const totalHorizontalScroll = 3 * window.innerWidth;
    const scrollRatio = 3000 / totalHorizontalScroll;
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

      {/* Main horizontal sliding/scrolling container */}
      <div
        className="w-full lg:w-[400vw] flex overflow-x-auto lg:overflow-hidden snap-x snap-mandatory lg:snap-none scrollbar-none cursor-grab active:cursor-grabbing select-none h-screen"
        ref={sectionRef}
        onScroll={handleMobileScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Intro Slide (Horizontal Title Card) */}
        <div className="h-screen w-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24 shrink-0 bg-forest-950 relative snap-center">
          {/* Subtle grid background lines */}
          <div className="absolute inset-0 grid grid-cols-12 pointer-events-none opacity-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="border-r border-gold-300 h-full"></div>
            ))}
          </div>

          <div className="max-w-2xl space-y-4 lg:space-y-6 relative z-10">
            <div className="flex items-center gap-2">
              <Compass className="h-4.5 w-4.5 text-primary animate-spin" style={{ animationDuration: '10s' }} />
              <span className="text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
                Chapter 03
              </span>
            </div>
            <h2 className="font-playfair text-4xl sm:text-5xl lg:text-7xl text-foreground font-semibold leading-[1.1]">
              The Editorial Gastronomy
            </h2>
            <p className="font-inter text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">
              Scroll horizontally or drag with your pointer to walk through our signature compositions. Each selection is a micro-narrative of forest harvesting, wood-fire alchemy, and premium luxury presentation.
            </p>
            <div className="inline-flex items-center gap-3 text-primary text-xs tracking-widest font-semibold uppercase animate-pulse">
              <span className="hidden lg:inline">Drag or Scroll Down to Advance Gallery ──→</span>
              <span className="lg:hidden inline">Swipe Left to Explore ──→</span>
            </div>
          </div>
        </div>

        {/* Dish Slides */}
        {DISHES.map((dish) => (
          <div
            key={dish.id}
            className="h-screen w-screen flex items-center justify-center shrink-0 bg-forest-900/60 px-6 lg:px-20 relative overflow-hidden py-12 lg:py-0 snap-center"
          >
            {/* Ambient candlelight element per dish */}
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full filter blur-[80px] pointer-events-none animate-candle"></div>

            <div className="container-width grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center relative z-10 w-full">
              
              {/* Left Column: Dish Image with 3D Hover & Steam Simulation */}
              <div className="lg:col-span-6 flex justify-center relative drag-gallery">
                <div className="relative w-full max-w-[200px] xs:max-w-[240px] sm:max-w-[300px] lg:max-w-md aspect-square rounded-3xl overflow-hidden border border-gold-300/15 shadow-2xl bg-forest-950 group">
                  
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
                  <span className="absolute top-4 left-4 lg:top-6 lg:left-6 z-25 text-[8px] lg:text-[9px] tracking-[4px] uppercase bg-forest-950/80 border border-gold-300/10 text-gold-300 px-3 py-1.5 rounded-full backdrop-blur-md">
                    {dish.category}
                  </span>
                </div>
              </div>

              {/* Right Column: Culinary specs & Editorial Copy */}
              <div className="lg:col-span-6 space-y-4 lg:space-y-6 text-left w-full">
                <div className="flex items-center justify-between">
                  <span className="font-playfair text-4xl lg:text-6xl text-primary/10 font-bold select-none">{dish.id}</span>
                  {dish.recommended && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] lg:text-[9px] font-bold uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 animate-pulse" />
                      Chef Recommendation
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 lg:space-y-2">
                  <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl text-foreground font-semibold leading-tight">
                    {dish.name}
                  </h3>
                  <p className="font-playfair text-xl lg:text-2xl text-primary font-medium">{dish.price}</p>
                </div>

                <p className="font-inter text-muted-foreground text-xs lg:text-sm leading-relaxed max-w-lg">
                  {dish.description}
                </p>

                {/* Ingredient nodes list */}
                <div className="space-y-1.5 lg:space-y-2">
                  <span className="font-inter text-[8px] lg:text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Ingredients</span>
                  <div className="flex flex-wrap gap-1.5 lg:gap-2">
                    {dish.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="font-inter text-[9px] lg:text-[10px] bg-forest-950 border border-gold-300/5 text-gold-300 px-2.5 py-1 rounded-md hover:border-primary/20 hover:text-primary transition-all duration-300"
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

      {/* Centered Scroll indicator dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-30">
        {[0, 1, 2, 3].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSlide(index)}
            className="group relative p-2"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                activeIndex === index
                  ? "w-8 bg-primary shadow-[0_0_10px_rgba(223,185,60,0.8)]"
                  : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SignatureDishes;
