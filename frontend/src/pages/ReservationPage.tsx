import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ReservationSection from '../components/ReservationSection';
import CustomCursor from '../components/CustomCursor';

const ReservationPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-forest-950 text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden pt-20">
      <CustomCursor />
      <Header />
      <main className="flex-grow">
        <ReservationSection />
      </main>
      <Footer />
    </div>
  );
};

export default ReservationPage;
