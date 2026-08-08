import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/button';

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you shortly.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-forest-950 text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden pt-24">
      <CustomCursor />
      <Header />
      
      <main className="flex-grow container-width py-12 px-4">
        {/* Title Section */}
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-primary text-xs font-semibold tracking-[0.3em] uppercase block mb-3">Get in Touch</span>
          <h1 className="font-playfair text-3xl md:text-5xl font-bold text-foreground mb-4">
            Connect with the Sanctuary
          </h1>
          <div className="w-16 h-[1.5px] bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Have a question, request, or specialized dietary inquiry? Reach out to our concierge team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Info Card */}
          <div className="space-y-8 bg-forest-900/40 p-8 rounded-3xl border border-gold-300/10 backdrop-blur-md" data-aos="fade-right">
            <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">Concierge Details</h2>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-1">Our Location</h3>
                <p className="text-muted-foreground text-sm">
                  128 Canopy Walkway, Forest Sanctuary,<br />
                  Green Valley, Western Ghats
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-1">Reservations & Inquiries</h3>
                <p className="text-muted-foreground text-sm">+91 (800) 555-FOREST</p>
                <p className="text-muted-foreground text-sm">+91 (800) 555-9876</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-1">Email Correspondence</h3>
                <p className="text-muted-foreground text-sm">concierge@forestfeast.com</p>
                <p className="text-muted-foreground text-sm">events@forestfeast.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground uppercase tracking-wider mb-1">Operating Hours</h3>
                <div className="text-muted-foreground text-sm space-y-1">
                  <p><span className="text-foreground font-medium">Lunch:</span> Wed – Sun | 12:00 PM – 3:30 PM</p>
                  <p><span className="text-foreground font-medium">Dinner:</span> Tue – Sun | 6:30 PM – 11:00 PM</p>
                  <p className="text-xs text-primary/70 italic mt-1">*Mondays closed for deep sanctuary restoration</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-forest-900/40 p-8 rounded-3xl border border-gold-300/10 backdrop-blur-md" data-aos="fade-left">
            <h2 className="font-playfair text-2xl font-semibold text-foreground mb-6">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Your Name</label>
                <input 
                  type="text" 
                  required 
                  className="w-full bg-forest-950/60 border border-gold-300/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  placeholder="Aarav Sharma"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Email Address</label>
                <input 
                  type="email" 
                  required 
                  className="w-full bg-forest-950/60 border border-gold-300/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground"
                  placeholder="aarav@domain.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</label>
                <textarea 
                  required 
                  rows={4}
                  className="w-full bg-forest-950/60 border border-gold-300/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-foreground resize-none"
                  placeholder="How can we assist you?"
                ></textarea>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase py-6 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(223,185,60,0.15)] flex items-center justify-center gap-2 group">
                Submit Inquiry
                <Send className="h-4 w-4 transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
