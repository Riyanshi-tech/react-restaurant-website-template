import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useMotionValue, useSpring } from "framer-motion";
import ambience1 from "@/assets/images/ambience-1.webp";
import heroBg from "@/assets/images/hero-bg.webp";

gsap.registerPlugin(ScrollTrigger);

const Ambience = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);

  // Mouse tilt spring setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 60, damping: 20 };
  const tiltX = useSpring(useMotionValue(0), springConfig);
  const tiltY = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    // Parallax scrolling triggers
    const ctx = gsap.context(() => {
      // Shift card 1 down slightly slower than scroll (parallax)
      gsap.to(card1Ref.current, {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Shift card 2 up slightly faster (parallax)
      gsap.to(card2Ref.current, {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      // Staggered reveal of description texts
      gsap.from(".ambience-text-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          toggleActions: "play none none none"
        }
      });
    }, containerRef);

    // Mouse movement inside this container triggers soft 3D tilt
    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      tiltX.set(-y * 6); // max 6deg tilt
      tiltY.set(x * 6);
    };

    const handleMouseLeave = () => {
      tiltX.set(0);
      tiltY.set(0);
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener("mousemove", handleMouseMove);
      element.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      ctx.revert();
      if (element) {
        element.removeEventListener("mousemove", handleMouseMove);
        element.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, [tiltX, tiltY]);

  return (
    <div
      ref={containerRef}
      id="ambience"
      className="relative min-h-screen bg-forest-900/40 flex items-center justify-center py-24 md:py-32 overflow-hidden border-t border-gold-300/5"
    >
      {/* Dynamic ambient candles */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none animate-candle" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-forest-600/10 rounded-full filter blur-[110px] pointer-events-none animate-candle"></div>

      <div className="container-width grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10">
        
        {/* Left Column: Visual grid with overlapping cards */}
        <motion.div 
          className="lg:col-span-7 grid grid-cols-12 gap-6 relative"
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          {/* Main Ambience Image Card */}
          <div
            ref={card1Ref}
            className="col-span-8 relative aspect-[4/5] rounded-3xl overflow-hidden border border-gold-300/10 shadow-2xl bg-forest-950 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-50 z-10" />
            <img
              src={ambience1}
              alt="Rainforest twilight terrace dining"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
            />
          </div>

          {/* Overlapping Secondary Card */}
          <div
            ref={card2Ref}
            className="col-span-6 col-start-7 absolute bottom-[-40px] right-0 aspect-square rounded-2xl overflow-hidden border border-gold-300/15 shadow-2xl bg-forest-950 group z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 to-transparent opacity-40 z-10" />
            <img
              src={heroBg}
              alt="Cozy copper candlelight corner"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
            />
          </div>
        </motion.div>

        {/* Right Column: Editorial styling copy */}
        <div className="lg:col-span-5 space-y-8 mt-12 lg:mt-0">
          <div className="space-y-3">
            <span className="ambience-text-reveal inline-block text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
              Chapter 02
            </span>
            <h2 className="ambience-text-reveal font-playfair text-4xl sm:text-5xl text-foreground font-semibold leading-tight">
              Dine In Perfect Accord With Nature
            </h2>
          </div>

          <p className="ambience-text-reveal font-inter text-muted-foreground text-sm sm:text-base leading-relaxed">
            Whether seated on our glass-floored outdoor platforms overhanging the forest stream, or sheltered inside the hand-carved redwood pavilion, you are completely cradled by the forest.
          </p>

          <p className="ambience-text-reveal font-inter text-muted-foreground text-sm sm:text-base leading-relaxed">
            At night, we extinguish artificial lights, leaving only the soft glow of hanging beeswax lanterns and custom oil candles. The soft rustle of leaves, the mist roll-in, and the glowing fireflies assemble to create a luxury stage for your senses.
          </p>

          <div className="ambience-text-reveal pt-2 flex items-center gap-8">
            <div>
              <p className="font-playfair text-3xl text-primary font-semibold">140</p>
              <p className="font-inter text-[10px] uppercase tracking-wider text-muted-foreground">Candlelight Tables</p>
            </div>
            <div className="w-px h-8 bg-gold-300/10"></div>
            <div>
              <p className="font-playfair text-3xl text-primary font-semibold">100%</p>
              <p className="font-inter text-[10px] uppercase tracking-wider text-muted-foreground">Sustainably Harvested</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Ambience;
