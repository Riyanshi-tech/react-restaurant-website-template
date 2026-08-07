import React from "react";
import OurStoryImg from "../assets/images/our-story.webp";
import { Sparkles } from "lucide-react";

// Section ID for scrolling navigation anchor
const SECTION_ID = "about";

const STATS = [
  { value: "120+", label: "Active Cafés", delay: "800" },
  { value: "-40%", label: "Wait Times", delay: "1000" },
  { value: "99.9%", label: "System Uptime", delay: "1200" },
];

const About = () => {
  return (
    <section id={SECTION_ID} className="section-padding bg-muted/30 relative overflow-hidden">
      {/* Subtle details */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left column: Story and statistics */}
          <div className="space-y-6" data-aos="fade-right">
            <div>
              {/* Tagline */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="h-3.5 w-3.5" /> Our Story
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
                Built by Café Owners, <span className="text-primary">for Café Owners</span>
              </h2>
              <div className="w-20 h-1 bg-primary mb-6" />
            </div>

            {/* Story Paragraphs */}
            <div className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed font-inter">
              <p data-aos="fade-up" data-aos-delay="200">
                CafeFlow was born out of frustration. As former café owners, we loved the weekend rush but hated the operational bottlenecks — long ordering queues, wrong order details, and waiters running back and forth with paper pads.
              </p>
              <p data-aos="fade-up" data-aos-delay="400">
                We realized that if guests could browse and order directly from their tables using their own phones, it would free up staff to focus on delivering high-quality hospitality instead of writing down lists.
              </p>
              <p data-aos="fade-up" data-aos-delay="600">
                So we engineered a system that runs instantly in any mobile browser, updates kitchen displays in real time, and keeps managers completely in control. Today, over a hundred coffee shops and diners use CafeFlow to power their table operations.
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {STATS.map(({ value, label, delay }) => (
                <div
                  key={label}
                  className="text-center bg-card/40 border border-border/50 p-4 rounded-xl backdrop-blur-sm"
                  data-aos="zoom-in"
                  data-aos-delay={delay}
                >
                  <div className="text-2xl md:text-3xl font-playfair font-bold text-primary">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-inter">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Story image and award card */}
          <div className="relative" data-aos="fade-left" data-aos-delay="400">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border/80">
              <img
                src={OurStoryImg}
                alt="Café Table Dining Scene"
                className="w-full h-[500px] object-cover transition-transform duration-500 hover:scale-105"
              />
              {/* Overlay for visual depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            {/* Floating Trust Card */}
            <div
              className="absolute -bottom-6 -right-6 bg-card border border-border/80 p-5 rounded-xl shadow-2xl max-w-xs backdrop-blur-md"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="text-center space-y-1">
                <h3 className="font-playfair font-bold text-base text-foreground">
                  Made for Hospitality
                </h3>
                <p className="text-muted-foreground text-xs font-inter">
                  Designed to scale independent cafés and coffee shops.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default About;
