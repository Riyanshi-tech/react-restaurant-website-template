import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronDown, Sparkles } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import jungleHero from "@/assets/images/jungle-hero.webp";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 50, damping: 15 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const bgX = useSpring(useMotionValue(0), springConfig);
  const bgY = useSpring(useMotionValue(0), springConfig);

  useEffect(() => {
    // 1. Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const xVal = (clientX - width / 2) / (width / 2);
      const yVal = (clientY - height / 2) / (height / 2);

      mouseX.set(clientX);
      mouseY.set(clientY);

      // Rotate cards slightly
      rotateX.set(-yVal * 4); // max 4deg
      rotateY.set(xVal * 4);

      // Shift background slightly (reverse)
      bgX.set(-xVal * 20); // max 20px
      bgY.set(-yVal * 20);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 2. Firefly Canvas Simulation
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let animationFrameId: number;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
          width = canvas.width = window.innerWidth;
          height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        // Particle class
        class Firefly {
          x: number;
          y: number;
          size: number;
          speedX: number;
          speedY: number;
          opacity: number;
          fadeSpeed: number;
          angle: number;
          spinSpeed: number;

          constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1; // 1-3px
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.angle = Math.random() * Math.PI * 2;
            this.spinSpeed = (Math.random() - 0.5) * 0.02;
          }

          update() {
            this.x += this.speedX + Math.sin(this.angle) * 0.15;
            this.y += this.speedY + Math.cos(this.angle) * 0.15;
            this.angle += this.spinSpeed;

            // Fade opacity in and out
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0 || this.opacity >= 0.8) {
              this.fadeSpeed = -this.fadeSpeed;
            }

            // Wrap around edges
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
          }

          draw(context: CanvasRenderingContext2D) {
            context.save();
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fillStyle = `rgba(223, 185, 60, ${Math.max(0, this.opacity)})`;
            // Add a soft glow
            context.shadowBlur = this.size * 4;
            context.shadowColor = "#dfb93c";
            context.fill();
            context.restore();
          }
        }

        // Spawn fireflies
        const firefliesCount = Math.min(60, Math.floor((width * height) / 25000));
        const fireflies: Firefly[] = [];
        for (let i = 0; i < firefliesCount; i++) {
          fireflies.push(new Firefly());
        }

        // Animation Loop
        const render = () => {
          ctx.clearRect(0, 0, width, height);
          
          // Draw faint background fog gradient
          const fogGrad = ctx.createRadialGradient(
            width / 2, height / 2, 10,
            width / 2, height / 2, Math.max(width, height)
          );
          fogGrad.addColorStop(0, "rgba(5, 11, 7, 0)");
          fogGrad.addColorStop(1, "rgba(5, 11, 7, 0.45)");
          ctx.fillStyle = fogGrad;
          ctx.fillRect(0, 0, width, height);

          // Update and draw particles
          fireflies.forEach((firefly) => {
            firefly.update();
            firefly.draw(ctx);
          });
          animationFrameId = requestAnimationFrame(render);
        };
        render();

        return () => {
          window.removeEventListener("resize", handleResize);
          cancelAnimationFrame(animationFrameId);
        };
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // 3. Immersive Loading & Entrance timeline
  useEffect(() => {
    // Force a small timeout to ensure DOM is ready
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setLoading(false)
      });

      // 1. Initial State
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], { opacity: 0 });
      gsap.set(bgRef.current, { scale: 1.15 });

      // 2. Slow Zoom Timeline
      gsap.to(bgRef.current, {
        scale: 1.05,
        duration: 10,
        ease: "power2.out"
      });

      // 3. Entrance Timeline
      tl.to(".hero-loader-overlay", {
        opacity: 0,
        duration: 2.2,
        ease: "power3.inOut",
        delay: 0.5
      });

      // Reveal title word-by-word
      if (titleRef.current) {
        const words = titleRef.current.innerText.split(" ");
        titleRef.current.innerHTML = words
          .map((word) => `<span class="inline-block overflow-hidden"><span class="hero-word inline-block translate-y-full">${word}</span></span>`)
          .join(" ");

        tl.to(".hero-word", {
          translateY: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 1.2,
          ease: "power4.out",
        }, "-=1.2");
      }

      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
      }, "-=0.6");

      tl.to(ctaRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
      }, "-=0.8");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleScrollDown = () => {
    const nextSection = document.getElementById("story");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      id="home"
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black"
    >
      {/* Immersive Black Loader Overlay */}
      <div className="hero-loader-overlay absolute inset-0 bg-black z-40 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full"
          />
          <span className="font-playfair text-gold-300 italic tracking-widest text-sm animate-pulse">
            Entering the Sanctuary...
          </span>
        </div>
      </div>

      {/* Cinematic Zooming Background Image */}
      <motion.div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center select-none"
        style={{
          backgroundImage: `url(${jungleHero})`,
          x: bgX,
          y: bgY,
        }}
      />

      {/* Cinematic Lighting overlays */}
      <div className="absolute inset-0 hero-gradient z-10 pointer-events-none" />
      {/* Light rays filter */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-primary/5 to-transparent filter blur-md pointer-events-none z-10" />

      {/* Fireflies Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
      />

      {/* Hero Content Grid */}
      <motion.div 
        className="relative z-30 container-width text-center flex flex-col items-center justify-center max-w-4xl px-6"
        style={{ rotateX, rotateY }}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-forest-950/60 border border-gold-300/10 backdrop-blur-md mb-6 animate-fade-in">
          <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
          <span className="text-[10px] tracking-[4px] uppercase text-gold-300 font-semibold font-inter">
            A Luxury Rainforest dining experience
          </span>
        </div>

        <h1
          ref={titleRef}
          className="font-playfair text-4xl sm:text-6xl md:text-8xl text-foreground font-semibold leading-[1.05] tracking-wide mb-6 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
        >
          Nature Meets Fine Gastronomy
        </h1>

        <p
          ref={subtitleRef}
          className="font-inter text-sm sm:text-lg text-muted-foreground/90 max-w-2xl leading-relaxed mb-10 translate-y-8"
        >
          Gather beneath the emerald canopy where rustic elements meet gourmet artistry. Welcome to Forest Feast, where every meal tells a story of the soil.
        </p>

        <div
          ref={ctaRef}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center translate-y-8 w-full sm:w-auto"
        >
          <a
            href="#reservation"
            className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs tracking-widest uppercase px-8 py-5 rounded-full border border-primary/20 hover:shadow-[0_0_20px_rgba(223,185,60,0.4)] transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            Secure Your Table
          </a>
          <a
            href="#story"
            className="w-full sm:w-auto bg-forest-950/60 hover:bg-forest-900 border border-gold-300/20 text-foreground font-semibold text-xs tracking-widest uppercase px-8 py-5 rounded-full backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 text-center"
          >
            Explore The Journey
          </a>
        </div>
      </motion.div>

      {/* Floating leaves depth layers */}
      <div className="absolute -left-10 bottom-10 w-44 h-44 bg-forest-950/20 z-20 pointer-events-none filter blur-[3px] rotate-45 select-none opacity-40">
        {/* Decorative Leaf shape */}
        <div className="w-full h-full bg-forest-700 rounded-[0_100%] border border-primary/10"></div>
      </div>
      <div className="absolute -right-20 top-20 w-56 h-56 bg-forest-950/20 z-20 pointer-events-none filter blur-[6px] -rotate-12 select-none opacity-30">
        <div className="w-full h-full bg-forest-800 rounded-[100%_0] border border-primary/10"></div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 animate-bounce cursor-pointer flex flex-col items-center gap-1.5" onClick={handleScrollDown}>
        <span className="text-[9px] tracking-[4px] uppercase text-muted-foreground/60 font-semibold font-inter">Scroll</span>
        <ChevronDown className="h-4.5 w-4.5 text-muted-foreground/60" />
      </div>
    </div>
  );
};

export default Hero;
