import { Card, CardContent } from "@/components/ui/card";
import {
  QrCode,
  Flame,
  BookOpen,
  ChefHat,
  BarChart3,
  Layout,
  MessageSquare,
  Bell,
  Smartphone,
  Gauge,
  Heart,
  RefreshCw,
  Sliders,
  CreditCard
} from "lucide-react";

// Feature configuration
const CORE_FEATURES = [
  {
    icon: QrCode,
    title: "QR Ordering",
    description: "Customers scan a unique QR code at their table to open the digital menu and place orders instantly without waiting."
  },
  {
    icon: Flame,
    title: "Real-Time Orders",
    description: "Kitchen and admin panels receive order details instantly with websocket connections to prevent delay or loss."
  },
  {
    icon: BookOpen,
    title: "Digital Menu",
    description: "Customize categories, set seasonal pricing, add photos, and update item availability on the fly from any device."
  },
  {
    icon: ChefHat,
    title: "Kitchen Dashboard",
    description: "A clean, prioritized display for back-of-house staff to track incoming prep queues and set cooking status."
  },
  {
    icon: BarChart3,
    title: "Sleek Analytics",
    description: "Gain deep insights into daily sales, peak traffic hours, top-selling items, and table utilization rates."
  },
  {
    icon: Layout,
    title: "Table Management",
    description: "Visually map out your floor plan, monitor occupied tables, and manage guest rotations in real time."
  },
  {
    icon: MessageSquare,
    title: "Customer Feedback",
    description: "Collect ratings and qualitative reviews at checkout to continuously monitor and improve restaurant service."
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description: "Send automatic alerts to staff when table guests call for assistance, request water, or ask for the check."
  }
];

// Why Choose Us configuration
const ADVANTAGES = [
  {
    icon: Smartphone,
    title: "No App Required",
    description: "Zero friction. Customers order directly via mobile web browsers. No app store downloads or sign-ups needed."
  },
  {
    icon: Gauge,
    title: "Faster Table Turnaround",
    description: "Saves valuable minutes per table. Speeds up ordering and payment cycles to increase daily seat capacity by 40%."
  },
  {
    icon: Heart,
    title: "Seamless Experience",
    description: "Delight your guests. They order what they want, when they want it, without waving down busy servers."
  },
  {
    icon: RefreshCw,
    title: "Real-Time Updates",
    description: "Mark sold-out items instantly. Avoid guest disappointment by updating the digital menu dynamically."
  },
  {
    icon: Sliders,
    title: "Unified Operations",
    description: "Bring order to chaos. Align front-of-house staff, kitchen crew, and administrative back-office in one dashboard."
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Let guests pay online instantly at the table, or choose traditional counter-based cash/terminal payments."
  }
];

const Features = () => {
  return (
    <section id="features" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-[30%] right-[-10%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[35%] h-[35%] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-width">
        {/* ================= SECTION 1: CORE FEATURES ================= */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Product Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Everything You Need to <span className="text-primary">Run Smarter</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-inter">
            A comprehensive, all-in-one system designed specifically to handle ordering, staff workflows, and restaurant growth.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 md:mb-32">
          {CORE_FEATURES.map(({ icon: Icon, title, description }, index) => (
            <Card
              key={title}
              data-aos="fade-up"
              data-aos-delay={index * 50}
              className="group bg-card/60 hover:bg-card border-border/80 hover:border-primary/40 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden backdrop-blur-sm"
            >
              <CardContent className="p-6 space-y-4">
                {/* Icon Box */}
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground border border-primary/20 transition-all duration-300">
                  <Icon className="h-5.5 w-5.5 transform group-hover:scale-110 transition-transform duration-300" />
                </div>
                {/* Text Content */}
                <div className="space-y-2">
                  <h3 className="text-xl font-playfair font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-inter">
                    {description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ================= SECTION 2: WHY CHOOSE US ================= */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Why Choose Us
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Built for the <span className="text-primary">Modern Café & Kitchen</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-inter">
            Why do growing restaurant brands trust CafeFlow? Because we solve the real bottlenecks of daily floor service.
          </p>
        </div>

        {/* Why Choose Us Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ADVANTAGES.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
              className="flex gap-4 p-6 bg-muted/20 border border-border/50 rounded-xl hover:border-primary/30 transition-colors duration-300"
            >
              {/* Icon Container */}
              <div className="flex-shrink-0 w-10 h-10 bg-primary/15 rounded-lg flex items-center justify-center text-primary border border-primary/10">
                <Icon className="h-5 w-5" />
              </div>
              {/* Content */}
              <div className="space-y-1 text-left">
                <h3 className="font-playfair font-bold text-lg text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-inter">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
