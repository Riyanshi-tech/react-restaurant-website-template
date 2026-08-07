import { Leaf, Instagram, Facebook, Phone, MapPin, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "Facebook", icon: Facebook, href: "#" }
];

const NAV_LINKS = [
  { name: "Story", href: "#story" },
  { name: "Ambience", href: "#ambience" },
  { name: "Signature Dishes", href: "#signature" },
  { name: "Menu", href: "#menu" },
  { name: "Reservation", href: "#reservation" }
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-forest-950 border-t border-gold-300/10 relative overflow-hidden py-20">
      {/* Decorative ambient lights */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-[80px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-forest-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

      <div className="container-width">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16">
          
          {/* Brand Info */}
          <div className="space-y-6 lg:col-span-5">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group w-fit"
              onClick={() => scrollToSection("#home")}
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 transition-all duration-300">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="font-playfair font-bold text-2xl text-foreground tracking-wider uppercase">
                Forest<span className="text-primary font-normal italic">Feast</span>
              </span>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-inter">
              An immersive fine-dining experience nestled deep in the heart of nature. We weave organic, locally sourced ingredients with luxury gastronomy to create unforgettable culinary journeys.
            </p>

            <div className="flex space-x-4">
              {SOCIAL_LINKS.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  aria-label={name}
                  className="w-10 h-10 bg-forest-900 border border-gold-300/10 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-300"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5 lg:col-span-3">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map(({ name, href }) => (
                <li key={name}>
                  <button
                    onClick={() => scrollToSection(href)}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200 text-left font-inter hover:translate-x-1 transform duration-200"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-5 lg:col-span-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Find Us</h4>
            <div className="space-y-4 text-sm text-muted-foreground font-inter">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">104 Rainforest Ridge, Canopy Valley</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <p>+1 (800) 555-JUNGLE</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <p>reserve@forestfeast.com</p>
              </div>
              <div className="pt-2 border-t border-gold-300/5 space-y-1">
                <h5 className="text-xs font-semibold text-foreground uppercase tracking-wider">Hours</h5>
                <p className="text-xs">Wednesday – Sunday: 5:00 PM – 11:00 PM</p>
                <p className="text-xs text-primary">Valet parking available</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gold-300/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs font-inter text-center md:text-left">
            © {currentYear} Forest Feast Café. Crafted for immersive storytelling. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-inter">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Accepting reservations for this season
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
