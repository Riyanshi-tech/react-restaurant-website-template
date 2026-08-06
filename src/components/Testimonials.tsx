import { Card, CardContent } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";

const TESTIMONIALS_DATA = [
  {
    quote: "This system reduced our waiting time by 40%. Our weekend rush used to be a nightmare of lost tickets and long queues. Now, guests sit down, scan, and order instantly. The kitchen is calmer and our table turn rate is up.",
    author: "Elena Rostova",
    role: "Founder & Owner",
    business: "Brew & Bite Bistro",
    initials: "EB"
  },
  {
    quote: "Setting up CafeFlow took less than an hour. The generated QR codes look sleek on our wooden tables. The best part? Our server tips have actually gone up by 20% since they can spend more time delivering orders instead of taking down lists.",
    author: "Marcus Thorne",
    role: "General Manager",
    business: "Aroma Garden Café",
    initials: "AG"
  },
  {
    quote: "Out-of-stock items used to cause massive friction at checkout. Now we just toggle availability in the admin panel and it updates on customer phones instantly. No app required was the biggest selling point for us.",
    author: "Samantha Lin",
    role: "Operations Director",
    business: "The Grindhouse Co.",
    initials: "GC"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative details */}
      <div className="absolute top-[20%] left-[-10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Success Stories
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Loved by <span className="text-primary">Cafe Owners</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-inter">
            Read how CafeFlow helps independent coffee shops, bistros, and restaurants scale their business and improve floor operations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <Card
              key={t.author}
              data-aos="fade-up"
              data-aos-delay={idx * 150}
              className="bg-card border-border/80 hover:border-primary/30 transition-all duration-300 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-primary/15 group-hover:text-primary/25 transition-colors duration-300">
                <MessageSquare className="h-8 w-8" />
              </div>

              <CardContent className="p-8 flex flex-col justify-between h-full space-y-6">
                {/* Stars */}
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-muted-foreground text-sm leading-relaxed italic flex-1 font-inter">
                  "{t.quote}"
                </p>

                {/* Divider */}
                <div className="h-px bg-border/60 w-full"></div>

                {/* Author Info */}
                <div className="flex items-center gap-3.5">
                  {/* Initial avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm shadow-inner uppercase">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-playfair font-bold text-foreground text-sm">
                      {t.author}
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {t.role}, <span className="text-primary font-medium">{t.business}</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
