import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Welcome from '../components/Welcome';
import ChefSection from '../components/ChefSection';
import CustomCursor from '../components/CustomCursor';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-forest-950 text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden pt-20">
      <CustomCursor />
      <Header />
      <main className="flex-grow">
        <Welcome />
        <ChefSection />
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
