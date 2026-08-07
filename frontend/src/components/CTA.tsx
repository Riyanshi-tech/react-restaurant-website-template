import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Coffee } from "lucide-react";

const CTA = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="contact" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative details */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(161,136,112,0.12),transparent_60%)] pointer-events-none"></div>

      <div className="container-width max-w-5xl relative z-10">
        <div 
          data-aos="zoom-in"
          className="bg-card/75 border border-border/80 rounded-3xl p-8 md:p-16 text-center space-y-8 backdrop-blur-md relative overflow-hidden shadow-2xl"
        >
          {/* Subtle Background Glow Circle */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Icon Badge */}
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 mx-auto shadow-inner">
            <Coffee className="h-7 w-7" />
          </div>

          {/* Heading Content */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-playfair font-bold text-foreground leading-tight">
              Ready to Modernize Your <span className="text-primary">Restaurant?</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed font-inter">
              Eliminate order bottlenecks, speed up table service, and grow your sales. Set up your digital menu and QR ordering system today.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-8 py-4 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 w-full sm:w-auto"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-muted/40 font-semibold px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-300 w-full sm:w-auto"
              onClick={() => scrollToSection("#faq")}
            >
              <MessageSquare className="h-4.5 w-4.5 text-primary" />
              Contact Sales
            </Button>
          </div>

          {/* Mini trust checklist */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 pt-4 border-t border-border/50 max-w-xl mx-auto text-xs text-muted-foreground font-medium font-inter">
            <span>✓ No setup fee</span>
            <span>✓ Generous free tier</span>
            <span>✓ Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
