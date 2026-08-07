import { useState, useEffect } from "react";
import { Menu, X, Leaf, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Navigation links mapping the cinematic storytelling chapters
const NAV_ITEMS = [
  { name: "Story", href: "#story" },
  { name: "Ambience", href: "#ambience" },
  { name: "Signature", href: "#signature" },
  { name: "Menu", href: "#menu" },
  { name: "Chef", href: "#chef" },
  { name: "Ingredients", href: "#ingredients" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Monitor scrolling to:
  // 1. Hide navbar when scrolling down, show when scrolling up
  // 2. Add glassmorphic background once scrolled past 50px
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine direction and navbar visibility
      const scrollingUp = prevScrollPos > currentScrollPos;
      setIsVisible(scrollingUp || currentScrollPos < 10);
      
      setHasScrolled(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Smooth scroll using target selectors and Lenis anchors
  const handleNavigation = (href: string) => {
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${
        hasScrolled
          ? "bg-forest-glass shadow-xl py-3 border-b border-gold-300/10"
          : "bg-transparent py-6"
      }`}
    >
      <nav className="container-width">
        <div className="flex items-center justify-between">
          {/* Forest Feast Brand Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleNavigation("#home")}
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 transition-all duration-300 group-hover:scale-105">
              <Leaf className="h-5 w-5 transform group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="font-playfair font-bold text-xl md:text-2xl text-foreground tracking-wider uppercase">
              Forest<span className="text-primary font-normal italic">Feast</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map(({ name, href }) => (
              <button
                key={name}
                onClick={() => handleNavigation(href)}
                className="text-muted-foreground hover:text-foreground px-1 py-2 text-xs font-semibold tracking-widest uppercase transition-colors duration-200 relative group"
              >
                {name}
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
              </button>
            ))}
          </div>

          {/* Desktop Action (Reserve Button) */}
          <div className="hidden md:flex items-center">
            <Button
              className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold tracking-wider text-xs uppercase px-6 py-5 rounded-full border border-primary/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(223,185,60,0.3)] hover:-translate-y-0.5 group"
              onClick={() => handleNavigation("#reservation")}
            >
              Reserve Table
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground hover:text-primary transition-colors duration-200 p-2 bg-muted/40 rounded-full border border-border/50"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-4.5 w-4.5" />
              ) : (
                <Menu className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-[380px] opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 py-5 space-y-3 bg-forest-glass rounded-2xl shadow-xl border border-gold-300/10">
            {NAV_ITEMS.map(({ name, href }) => (
              <button
                key={name}
                onClick={() => handleNavigation(href)}
                className="text-muted-foreground hover:text-foreground block px-3 py-2 text-sm font-semibold tracking-wider uppercase w-full text-left rounded-lg hover:bg-primary/5 transition-all duration-200"
              >
                {name}
              </button>
            ))}
            <div className="pt-4 border-t border-border/60">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold tracking-wider uppercase w-full py-5 rounded-full shadow-[0_0_15px_rgba(223,185,60,0.15)]"
                onClick={() => handleNavigation("#reservation")}
              >
                Reserve Table
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
