import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small coffee shops and food trucks starting out.",
    features: [
      "Up to 5 Tables",
      "Digital Menu Builder",
      "Dynamic QR Code Generator",
      "Standard Order Dispatching",
      "Email Support"
    ],
    isPopular: false,
    cta: "Join Waitlist"
  },
  {
    name: "Pro",
    price: "$79",
    description: "Best for busy cafés, bistros, and full-service dining tables.",
    features: [
      "Unlimited Tables",
      "Real-Time Kitchen Board (KOD)",
      "Waiter Call System (Service Alerts)",
      "SMS & Sound Notifications",
      "Advanced Sales Analytics",
      "Priority Email & Chat Support"
    ],
    isPopular: true,
    cta: "Join Waitlist"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Tailored for multi-location restaurant chains and franchises.",
    features: [
      "Multi-Location Central Sync",
      "Custom Branded Domains",
      "Custom POS Integrations",
      "Offline Cashier Backups",
      "Dedicated Account Manager",
      "24/7 Phone Support"
    ],
    isPopular: false,
    cta: "Contact Sales"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="section-padding bg-muted/20 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[40%] right-[-15%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[130px] pointer-events-none"></div>

      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Pricing Plans
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Transparent Pricing, <span className="text-primary">Built to Scale</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-inter">
            Choose the package that matches your floor count. Get in on the waitlist for exclusive early-adopter pricing.
          </p>
        </div>

        {/* Coming Soon Announcement Banner */}
        <div 
          data-aos="zoom-in"
          className="max-w-4xl mx-auto mb-16 bg-gradient-to-r from-primary/15 via-primary/5 to-primary/15 border border-primary/20 p-5 rounded-2xl text-center space-y-2 backdrop-blur-sm"
        >
          <div className="inline-flex items-center gap-1 bg-primary text-primary-foreground font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
            <Sparkles className="h-3 w-3 fill-primary-foreground animate-spin" /> Coming Soon
          </div>
          <h3 className="font-playfair font-bold text-lg text-foreground">
            CafeFlow Early Access Beta Launches Fall 2026
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto font-inter">
            Join the waitlist today. Selected cafés will receive a **30-Day Free Trial** and **20% Lifetime Discount** when we open public beta.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan, idx) => (
            <Card
              key={plan.name}
              data-aos="fade-up"
              data-aos-delay={idx * 150}
              className={`bg-card border-border/80 relative flex flex-col justify-between overflow-hidden transition-all duration-300 transform hover:-translate-y-1 ${
                plan.isPopular 
                  ? "border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/20 md:-translate-y-2 hover:-translate-y-3" 
                  : "hover:border-primary/30"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-semibold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-bl-xl flex items-center gap-1 shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                {/* Plan Header */}
                <CardHeader className="p-6 pb-2 space-y-2">
                  <span className="text-sm font-semibold uppercase text-primary tracking-wider">{plan.name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-playfair text-foreground">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-xs text-muted-foreground">/ month</span>}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-inter">{plan.description}</p>
                </CardHeader>

                {/* Plan Features */}
                <CardContent className="p-6 pt-4 space-y-4">
                  <div className="h-px bg-border/60"></div>
                  <ul className="space-y-3">
                    {plan.features.map(feat => (
                      <li key={feat} className="flex gap-2.5 items-start text-xs text-muted-foreground font-inter">
                        <div className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </div>

              {/* Plan Footer */}
              <CardFooter className="p-6 pt-2">
                <Button
                  className={`w-full font-semibold rounded-xl py-2.5 transition-all duration-300 ${
                    plan.isPopular
                      ? "bg-primary hover:bg-primary/95 text-primary-foreground shadow-lg shadow-primary/25"
                      : "bg-muted hover:bg-muted-foreground/15 border border-border/80 text-foreground"
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
