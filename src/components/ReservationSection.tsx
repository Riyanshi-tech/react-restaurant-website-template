import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Clock, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const ReservationSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    guests: "2",
    date: "",
    time: "19:00"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.date) return;

    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1800);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      guests: "2",
      date: "",
      time: "19:00"
    });
    setIsSuccess(false);
  };

  return (
    <div
      id="reservation"
      className="relative min-h-screen bg-forest-950 py-24 md:py-32 border-t border-gold-300/5 overflow-hidden flex items-center justify-center"
    >
      {/* Heavy candlelight pulse background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] animate-candle"></div>
      </div>

      <div className="container-width relative z-10 w-full max-w-4xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Intimate Call to Reservation */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="inline-block text-xs font-semibold tracking-[6px] uppercase text-primary font-inter">
              Chapter 09
            </span>
            <h2 className="font-playfair text-4xl sm:text-5xl text-foreground font-semibold leading-tight">
              An Invitation Under The Canopy
            </h2>
            <p className="font-inter text-muted-foreground text-sm leading-relaxed">
              We operate exclusively by reservation to maintain an intimate, slow-paced atmosphere. Each table is allocated for a complete three-hour sensory experience.
            </p>
            <div className="space-y-3 pt-2 font-inter text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Seating cycles begin at 5:00 PM, 7:30 PM, and 9:45 PM.
              </p>
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Kindly notify us of dietary constraints 24 hours prior.
              </p>
              <p className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                Valet parking included with all bookings.
              </p>
            </div>
          </div>

          {/* Right Column: Premium Booking Card Widget */}
          <div className="lg:col-span-7 relative">
            <div className="bg-forest-glass border border-gold-300/10 rounded-3xl p-8 md:p-10 shadow-2xl relative min-h-[480px] overflow-hidden flex flex-col justify-center">
              
              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="booking-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <h3 className="font-playfair text-2xl text-foreground font-semibold tracking-wide border-b border-gold-300/5 pb-4">
                      Request A Table
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="font-inter text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Full Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Elena Rostova"
                          className="w-full bg-forest-950/80 border border-gold-300/10 focus:border-primary/50 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors"
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1.5">
                        <label className="font-inter text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="elena@prestige.com"
                          className="w-full bg-forest-950/80 border border-gold-300/10 focus:border-primary/50 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Guests Select */}
                      <div className="space-y-1.5">
                        <label className="font-inter text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3 text-primary" /> Guests
                        </label>
                        <select
                          value={formData.guests}
                          onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                          className="w-full bg-forest-950/80 border border-gold-300/10 focus:border-primary/50 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="1">1 Guest</option>
                          <option value="2">2 Guests</option>
                          <option value="4">4 Guests</option>
                          <option value="6">6 Guests</option>
                          <option value="8">8+ Guests</option>
                        </select>
                      </div>

                      {/* Date Input */}
                      <div className="space-y-1.5">
                        <label className="font-inter text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-primary" /> Date
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-forest-950/80 border border-gold-300/10 focus:border-primary/50 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors cursor-pointer"
                        />
                      </div>

                      {/* Time Select */}
                      <div className="space-y-1.5">
                        <label className="font-inter text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3 text-primary" /> Time Cycle
                        </label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full bg-forest-950/80 border border-gold-300/10 focus:border-primary/50 text-foreground text-sm rounded-xl px-4 py-3 focus:outline-none transition-colors appearance-none cursor-pointer"
                        >
                          <option value="17:00">5:00 PM</option>
                          <option value="19:30">7:30 PM</option>
                          <option value="21:45">9:45 PM</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold tracking-wider text-xs uppercase py-6 rounded-full border border-primary/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(223,185,60,0.3)]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          <span>Piping Request...</span>
                        </div>
                      ) : (
                        "Request Seating"
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-6 py-6"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/30 mx-auto animate-bounce">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-playfair text-2xl text-foreground font-semibold tracking-wide">
                        Table Request Received
                      </h3>
                      <p className="font-inter text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                        Thank you, {formData.name}. Our reservation team is verifying seat availability for {formData.guests} guests on {formData.date} at {formData.time === "17:00" ? "5:00 PM" : formData.time === "19:30" ? "7:30 PM" : "9:45 PM"}.
                      </p>
                      <p className="font-inter text-[10px] text-primary uppercase font-bold tracking-wider pt-2">
                        A verification email was piped to {formData.email}.
                      </p>
                    </div>
                    <Button
                      onClick={handleReset}
                      className="bg-forest-950/60 hover:bg-forest-900 border border-gold-300/10 text-muted-foreground hover:text-foreground text-xs font-semibold tracking-widest uppercase px-6 py-4 rounded-full"
                    >
                      Book Another Table
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReservationSection;
