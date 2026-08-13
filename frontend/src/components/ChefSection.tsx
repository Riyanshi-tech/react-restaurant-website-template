import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Award, Heart } from "lucide-react";
import chef1 from "@/assets/images/chef-1.webp";

gsap.registerPlugin(ScrollTrigger);

const ChefSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const signaturePathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Signature SVG drawing animation on scroll
      if (signaturePathRef.current) {
        const length = signaturePathRef.current.getTotalLength();
        // Set initial stroke dash properties to hide path
        gsap.set(signaturePathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length
        });

        gsap.to(signaturePathRef.current, {
          strokeDashoffset: 0,
          duration: 2.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none none"
          }
        });
      }

      // 2. Accolades staggered fade-in
      gsap.from(".owner-fade", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1.0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
          toggleActions: "play none none none"
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="owner"
      className="relative min-h-screen bg-forest-900/40 py-24 md:py-32 border-t border-gold-300/5 overflow-hidden flex items-center"
    >
      {/* Candlelight glow backdrop */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none animate-candle"></div>

      <div className="container-width grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10 w-full">
        
        {/* Left Column: Portrait with breathing animation and overlay steam */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="relative w-full max-w-sm aspect-[4/5] rounded-[2rem] overflow-hidden border border-gold-300/15 shadow-2xl bg-forest-950 group">
            
            {/* Organic scale breathing animation */}
            <div className="absolute inset-0 w-full h-full transform transition-transform duration-[10000ms] ease-in-out scale-[1.03] hover:scale-[1.08]">
              <img
                src={chef1}
                alt="Founder and owner Aarav Kapoor"
                className="w-full h-full object-cover select-none"
              />
            </div>

            {/* Gradient fog overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent opacity-90 z-10" />

            {/* Subtle steam floating up */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-30">
              <div className="absolute bottom-10 left-1/4 w-1 h-20 bg-gradient-to-t from-transparent via-white/10 to-transparent blur-[3px] steam-particle" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-10 left-1/2 w-1 h-20 bg-gradient-to-t from-transparent via-white/15 to-transparent blur-[3px] steam-particle" style={{ animationDelay: '3.5s' }}></div>
            </div>

            {/* Owner name badge on card */}
            <div className="absolute bottom-6 left-6 right-6 z-25 bg-forest-950/70 border border-gold-300/10 p-4 rounded-xl backdrop-blur-md">
              <p className="font-playfair text-lg text-foreground font-semibold">Aarav Kapoor</p>
              <p className="font-inter text-[9px] tracking-widest text-primary uppercase font-bold">Founder & Owner</p>
            </div>
          </div>
        </div>

        {/* Right Column: Culinary philosophy, credentials, and animated signature */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-3">
            <span className="owner-fade inline-block text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
              Chapter 05
            </span>
            <h2 className="owner-fade font-playfair text-4xl sm:text-5xl text-foreground font-semibold leading-tight">
              A Vision Rooted In The Forest
            </h2>
          </div>

          <blockquote className="owner-fade border-l-2 border-primary/40 pl-6 italic font-playfair text-lg sm:text-xl text-gold-300 leading-relaxed">
            "Forest Feast was never just a restaurant. It is a place where community gathers, local growers are honoured, and every guest feels the calm of the canopy."
          </blockquote>

          <p className="owner-fade font-inter text-muted-foreground text-sm sm:text-base leading-relaxed">
            Aarav Kapoor founded Forest Feast after years building hospitality spaces across India and abroad. He shaped the café around slow dining, seasonal sourcing, and a team culture that treats service as craft — not transaction.
          </p>

          <div className="owner-fade grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-3 p-4 bg-forest-glass rounded-xl border border-gold-300/5">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-playfair text-sm text-foreground font-semibold">Founded 2019</h4>
                <p className="font-inter text-[9px] text-muted-foreground uppercase tracking-wider">Western Ghats, India</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-forest-glass rounded-xl border border-gold-300/5">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shrink-0">
                <Heart className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-playfair text-sm text-foreground font-semibold">Community First</h4>
                <p className="font-inter text-[9px] text-muted-foreground uppercase tracking-wider">Local growers & artisans</p>
              </div>
            </div>
          </div>

          <div className="owner-fade pt-4 flex flex-col items-start">
            <svg
              className="w-48 h-16 text-primary"
              viewBox="0 0 200 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Custom SVG path representing Aarav's signature */}
              <path
                ref={signaturePathRef}
                d="M15,35 Q35,10 50,45 T80,20 T110,40 Q130,10 150,30 T180,35 M45,35 L60,35 M100,32 L115,32"
              />
            </svg>
            <span className="font-inter text-[9px] tracking-widest text-muted-foreground uppercase font-semibold mt-1">
              Owner&apos;s Mark of Authenticity
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ChefSection;
