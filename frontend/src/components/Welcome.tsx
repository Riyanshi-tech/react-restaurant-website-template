import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ourStory from "@/assets/images/our-story.webp";

gsap.registerPlugin(ScrollTrigger);

const Welcome = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade and slide text elements up sequentially as the section scrolls into view
      gsap.from(".welcome-fade-up", {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none none"
        }
      });

      // Subtle parallax scale-down on the main story image
      gsap.fromTo(
        imageRef.current,
        { scale: 1.15 },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="story"
      className="relative min-h-screen bg-forest-950 flex items-center justify-center py-24 md:py-32 overflow-hidden border-t border-gold-300/5"
    >
      {/* Decorative candlelight glow background */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none animate-candle"></div>

      <div className="container-width grid grid-cols-1 lg:grid-cols-12 gap-16 items-center z-10">
        
        {/* Left Column: Storytelling content */}
        <div ref={textRef} className="lg:col-span-6 space-y-8">
          <div className="space-y-3">
            <span className="welcome-fade-up inline-block text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
              Chapter 01
            </span>
            <h2 className="welcome-fade-up font-playfair text-4xl sm:text-5xl md:text-6xl text-foreground font-semibold leading-tight">
              A Sanctuary Built For Culinary Storytelling
            </h2>
          </div>

          <p className="welcome-fade-up font-inter text-muted-foreground text-sm sm:text-base leading-relaxed">
            Forest Feast Café was born from a desire to reconnect fine gastronomy with the rich, untamed rhythms of the earth. We believe dining should be more than a transaction—it is an immersive sensory journey.
          </p>

          <p className="welcome-fade-up font-inter text-muted-foreground text-sm sm:text-base leading-relaxed">
            Every wooden beam in our dining sanctuary was sustainably gathered from fallen redwoods; every candle cast by local bees. Here, underneath the lush fern canopy, we slow down, listen to the whisper of the rain, and celebrate the pure artistry of nature.
          </p>

          <div className="welcome-fade-up pt-4">
            <div className="inline-flex items-center gap-4 border-b border-primary/20 pb-2 group cursor-pointer hover:border-primary transition-all duration-300">
              <span className="font-inter text-xs font-bold tracking-widest uppercase text-gold-300 group-hover:text-primary transition-colors">
                Our Philosophical Roots
              </span>
              <span className="text-primary transform group-hover:translate-x-1.5 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Right Column: Layered imagery */}
        <div className="lg:col-span-6 relative flex justify-center">
          <div className="relative w-full max-w-lg aspect-[4/5] rounded-3xl overflow-hidden border border-gold-300/15 shadow-2xl bg-forest-900 group">
            
            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-transparent to-transparent opacity-65 z-10 transition-opacity duration-300 group-hover:opacity-40" />

            <img
              ref={imageRef}
              src={ourStory}
              alt="Bustling wooden café ambiance"
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </div>

          {/* Floating gold leaf accents */}
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full filter blur-xl animate-pulse pointer-events-none"></div>
          <div className="absolute -top-6 -right-6 w-16 h-16 border border-primary/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Welcome;
