import { QrCode, BookOpen, ShoppingBag, Utensils } from "lucide-react";

// Steps configuration
const STEPS = [
  {
    number: "01",
    icon: QrCode,
    title: "Scan QR Code",
    description: "Guests scan the secure, table-specific QR code using their smartphone camera."
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Browse Digital Menu",
    description: "A fast, beautiful, photo-rich menu opens in their browser. No apps, no installations."
  },
  {
    number: "03",
    icon: ShoppingBag,
    title: "Place Table Order",
    description: "Guests select options, customize dishes, and send orders directly to the kitchen."
  },
  {
    number: "04",
    icon: Utensils,
    title: "Enjoy the Meal",
    description: "The kitchen prepares the food, staff serves it, and guests can dine and pay at the table."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section-padding bg-muted/20 relative overflow-hidden">
      {/* Subtle details */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container-width text-center">
        {/* Section Header */}
        <div className="mb-20" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            How CafeFlow <span className="text-primary">Works</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-inter">
            Streamlining customer ordering and kitchen workflows in 4 simple, interactive steps.
          </p>
        </div>

        {/* Stepper Grid Container */}
        <div className="relative mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 max-w-6xl mx-auto">
          {/* Connector Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-[28%] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-border pointer-events-none z-0"></div>

          {/* Steps */}
          {STEPS.map(({ number, icon: Icon, title, description }, index) => (
            <div
              key={number}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="relative flex flex-col items-center text-center group z-10"
            >
              {/* Stepper Circle */}
              <div className="relative w-20 h-20 rounded-full bg-card border-2 border-border flex items-center justify-center text-primary group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300 shadow-lg mb-6">
                {/* Step badge */}
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center border border-background">
                  {number}
                </div>
                <Icon className="h-8 w-8 transform group-hover:scale-110 transition-transform duration-300" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2 max-w-[240px]">
                <h3 className="text-xl font-playfair font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-inter">
                  {description}
                </p>
              </div>

              {/* Mobile Connector Arrow (Mobile Only) */}
              {index < 3 && (
                <div className="block lg:hidden mt-4 text-primary animate-pulse font-bold text-lg">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
