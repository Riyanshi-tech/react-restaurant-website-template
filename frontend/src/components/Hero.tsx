import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowDown, ArrowRight, MapPin } from "lucide-react";
import jungleHero from "@/assets/images/jungle-hero.webp";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    class Firefly {
      x = Math.random() * width;
      y = Math.random() * height;
      size = Math.random() * 1.5 + 0.5;
      speedX = (Math.random() - 0.5) * 0.3;
      speedY = (Math.random() - 0.5) * 0.3;
      opacity = Math.random() * 0.4 + 0.1;
      fadeSpeed = Math.random() * 0.004 + 0.002;
      angle = Math.random() * Math.PI * 2;
      spinSpeed = (Math.random() - 0.5) * 0.015;

      update() {
        this.x += this.speedX + Math.sin(this.angle) * 0.1;
        this.y += this.speedY + Math.cos(this.angle) * 0.1;
        this.angle += this.spinSpeed;
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0 || this.opacity >= 0.7) this.fadeSpeed = -this.fadeSpeed;
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
        context.shadowBlur = this.size * 5;
        context.shadowColor = "#dfb93c";
        context.fill();
        context.restore();
      }
    }

    const count = Math.min(45, Math.floor((width * height) / 30000));
    const fireflies = Array.from({ length: count }, () => new Firefly());

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      fireflies.forEach((f) => {
        f.update();
        f.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(bgRef.current, { scale: 1.12 });
      gsap.to(bgRef.current, { scale: 1.02, duration: 14, ease: "power1.out" });

      gsap.from(".hero-eyebrow", { opacity: 0, y: 16, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.from(".hero-line", {
        y: "110%",
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power4.out",
        delay: 0.35,
      });
      gsap.from(".hero-body", { opacity: 0, y: 24, duration: 1, ease: "power3.out", delay: 0.85 });
      gsap.from(".hero-actions", { opacity: 0, y: 20, duration: 0.9, ease: "power3.out", delay: 1.05 });
      gsap.from(".hero-bottom", { opacity: 0, y: 12, duration: 0.8, ease: "power2.out", delay: 1.2 });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-forest-950"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url(${jungleHero})` }}
      />

      <div className="absolute inset-0 hero-gradient z-10 pointer-events-none" />
      <div className="absolute inset-0 hero-vignette z-10 pointer-events-none" />
      <div className="absolute inset-0 hero-grain z-20 pointer-events-none" />
      <div className="absolute top-0 left-0 w-[55%] h-full bg-gradient-to-r from-forest-950/80 via-forest-950/30 to-transparent z-10 pointer-events-none" />

      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      <div className="relative z-30 min-h-screen flex flex-col justify-end lg:justify-center container-width pt-28 pb-8 lg:py-0">
        <div className="max-w-3xl space-y-8 lg:space-y-10">
          <div className="hero-eyebrow flex items-center gap-4">
            <span className="text-[10px] font-semibold tracking-[0.35em] uppercase text-primary font-inter">
              Chapter 00
            </span>
            <span className="h-px flex-1 max-w-[80px] bg-primary/30" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground/70 font-inter">
              The Sanctuary
            </span>
          </div>

          <h1 className="font-cormorant font-light leading-[0.88] tracking-tight text-foreground">
            {["Nature", "Meets", "Fine", "Gastronomy"].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  className={`hero-line inline-block text-[clamp(3.25rem,9vw,7.5rem)] ${
                    i === 2
                      ? "italic text-primary font-normal"
                      : i === 3
                        ? "font-playfair font-semibold"
                        : ""
                  }`}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className="hero-body max-w-md text-muted-foreground text-sm sm:text-base leading-relaxed font-inter border-l border-primary/25 pl-5">
            Beneath the emerald canopy, rustic earth meets refined plates.
            Every course is rooted in the soil, plated with intention.
          </p>

          <div className="hero-actions">
            <button
              onClick={() => scrollTo("menu")}
              className="group inline-flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-foreground hover:text-primary transition-colors duration-300"
            >
              <span className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/60 transition-all duration-300">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
              Explore Menu
            </button>
          </div>
        </div>

        <div className="hero-bottom mt-12 lg:mt-16 flex items-center justify-between border-t border-gold-300/10 pt-6">
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <MapPin className="h-3.5 w-3.5 text-primary/60" />
            <span className="text-[10px] tracking-[0.2em] uppercase font-inter">
              Western Ghats, India
            </span>
          </div>

          <button
            onClick={() => scrollTo("story")}
            className="group flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-muted-foreground/60 hover:text-primary transition-colors duration-300"
          >
            Discover
            <ArrowDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
