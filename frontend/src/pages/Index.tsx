import React from "react";
import { ReactLenis } from "@studio-freight/react-lenis";

// Layout components
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

// Chapter Section components
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Ambience from "@/components/Ambience";
import SignatureDishes from "@/components/SignatureDishes";
import InteractiveMenu from "@/components/InteractiveMenu";
import ChefSection from "@/components/ChefSection";

const HomePage = () => {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5 }}>
      <div className="min-h-screen flex flex-col bg-forest-950 text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
        {/* Interactive Custom Cursor */}
        <CustomCursor />

        {/* Fixed luxury header navigation */}
        <Header />

        {/* Narrative-based sections */}
        <main className="flex-grow">
          {/* Hero chapter */}
          <Hero />

          {/* Chapter 01: Welcome to the sanctuary */}
          <Welcome />

          {/* Chapter 02: Ambient spaces */}
          <Ambience />

          {/* Chapter 03: Editorial dishes (horizontal scroll) */}
          <SignatureDishes />

          {/* Chapter 04: Interactive gastronomy archive */}
          <InteractiveMenu />

          {/* Chapter 05: Meet the owner */}
          <ChefSection />
        </main>

        {/* Page footer closing credits */}
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default HomePage;
