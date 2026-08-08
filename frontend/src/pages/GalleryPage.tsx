import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GallerySection from '../components/GallerySection';
import CustomCursor from '../components/CustomCursor';

const GalleryPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-forest-950 text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden pt-20">
      <CustomCursor />
      <Header />
      <main className="flex-grow">
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
