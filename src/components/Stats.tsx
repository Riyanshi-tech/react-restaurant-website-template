import { useState, useEffect, useRef } from "react";
import { Utensils, Coffee, Heart, Clock } from "lucide-react";

// Counter Sub-component to handle increment animation
const AnimatedNumber = ({ endValue, duration = 1500, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = endValue;
    const totalFrames = duration / 16; // ~60fps
    const increment = end / totalFrames;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, endValue, duration]);

  return (
    <div ref={elementRef} className="text-4xl sm:text-5xl font-playfair font-bold text-foreground">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const STATS_ITEMS = [
  {
    icon: Utensils,
    value: 1000,
    suffix: "+",
    label: "Orders Managed",
    description: "Successfully processed through digital table ordering."
  },
  {
    icon: Coffee,
    value: 50,
    suffix: "+",
    label: "Partner Restaurants",
    description: "Cafes and bistros modernizing guest checkout experience."
  },
  {
    icon: Heart,
    value: 99,
    suffix: "%",
    label: "Customer Satisfaction",
    description: "Based on real-time feedback gathered at table checkouts."
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "System Availability",
    description: "Cloud infrastructure guaranteeing zero-downtime menu access."
  }
];

const Stats = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30 border-t border-b border-border/40 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/2 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-width relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                data-aos="zoom-in"
                data-aos-delay={idx * 100}
                className="bg-card/50 border border-border/60 hover:border-primary/30 p-6 rounded-2xl text-center space-y-4 shadow-lg backdrop-blur-sm group transition-all duration-300"
              >
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <Icon className="h-5.5 w-5.5 transform group-hover:rotate-12 transition-transform duration-300" />
                </div>

                {/* Animated counter */}
                <AnimatedNumber endValue={item.value} suffix={item.suffix} />

                {/* Labels */}
                <div className="space-y-1">
                  <h3 className="font-playfair font-bold text-lg text-foreground">
                    {item.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-inter">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Stats;
