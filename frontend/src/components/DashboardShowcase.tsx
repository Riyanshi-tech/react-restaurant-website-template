import { useState } from "react";
import { 
  LayoutDashboard, 
  ChefHat, 
  UserCheck, 
  Smartphone, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Utensils, 
  Bell, 
  Plus, 
  Minus, 
  Check, 
  Coffee, 
  Award,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Import custom generated mockups
import AdminDashboardImg from "./../assets/images/admin-dashboard-mockup.png";
import KitchenDashboardImg from "./../assets/images/kitchen-dashboard-mockup.png";

// Reusable pulsing hotspot overlay
const Hotspot = ({ top, left, title, description, align = "top" }: { top: string; left: string; title: string; description: string; align?: "top" | "bottom" }) => {
  return (
    <div className="absolute group z-35" style={{ top, left }}>
      <span className="relative flex h-5 w-5 cursor-pointer">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-80"></span>
        <span className="relative inline-flex rounded-full h-5 w-5 bg-primary/95 border border-primary-foreground/35 items-center justify-center text-[10px] font-bold text-primary-foreground shadow-md cursor-pointer">+</span>
      </span>
      <div className={`absolute hidden group-hover:block bg-card border border-border p-3.5 rounded-xl shadow-2xl w-48 text-left space-y-1 backdrop-blur-md pointer-events-none transition-all duration-200 transform -translate-x-1/2 left-1/2 ${
        align === "top" ? "bottom-7 mb-2" : "top-7 mt-2"
      }`}>
        <h4 className="font-playfair font-bold text-xs text-primary">{title}</h4>
        <p className="text-[10px] text-muted-foreground leading-normal font-inter">{description}</p>
      </div>
    </div>
  );
};

const DashboardShowcase = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "kitchen" | "waiter" | "customer">("admin");

  // --- WAITER STATE SIMULATION ---
  const [waiterRequests, setWaiterRequests] = useState([
    { id: 1, table: "Table 04", type: "Needs Water", time: "1m ago", resolved: false },
    { id: 2, table: "Table 07", type: "Call Waiter", time: "3m ago", resolved: false },
    { id: 3, table: "Table 02", type: "Wants Bill", time: "6m ago", resolved: false }
  ]);

  const resolveRequest = (id: number) => {
    setWaiterRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, resolved: true } : req))
    );
  };

  // --- CUSTOMER MENU SIMULATION ---
  const [cart, setCart] = useState<{ [key: string]: number }>({
    "Caramel Latte": 1,
    "Almond Croissant": 0,
    "Avocado Toast": 0
  });

  const updateCart = (item: string, amount: number) => {
    setCart(prev => {
      const current = prev[item] || 0;
      const next = Math.max(0, current + amount);
      return { ...prev, [item]: next };
    });
  };

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotalPrice = (
    (cart["Caramel Latte"] || 0) * 4.75 +
    (cart["Almond Croissant"] || 0) * 3.50 +
    (cart["Avocado Toast"] || 0) * 9.50
  ).toFixed(2);

  // Tabs layout data
  const TABS = [
    { id: "admin", label: "Admin Dashboard", icon: LayoutDashboard },
    { id: "kitchen", label: "Kitchen Board", icon: ChefHat },
    { id: "waiter", label: "Waiter Console", icon: UserCheck },
    { id: "customer", label: "Customer Menu", icon: Smartphone }
  ] as const;

  return (
    <section id="dashboard" className="section-padding bg-background relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-[10%] left-[-15%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-15%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container-width">
        {/* Section Header */}
        <div className="text-center mb-16" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            Product Demo
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-foreground mb-4">
            Experience the <span className="text-primary">Interactive Dashboards</span>
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-inter">
            Try clicking the tabs and buttons below to see how CafeFlow synchronizes orders and notifications in real time across roles.
          </p>
        </div>

        {/* Tab Controls */}
        <div 
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10 max-w-4xl mx-auto animate-fade-in"
          data-aos="fade-up"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/10 scale-105"
                    : "bg-card border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab Display Screen */}
        <div 
          className="max-w-6xl mx-auto bg-card/40 border border-border/80 rounded-2xl shadow-2xl p-4 md:p-8 min-h-[500px] backdrop-blur-sm flex items-center justify-center relative overflow-hidden"
          data-aos="zoom-in"
        >
          {/* ================= TAB 1: ADMIN DASHBOARD ================= */}
          {activeTab === "admin" && (
            <div className="w-full space-y-6 animate-fade-in">
              <div className="flex justify-between items-center pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-foreground">HQ Operations Control</h3>
                  <p className="text-sm text-muted-foreground">Admin Portal • Live operations simulator</p>
                </div>
                <div className="text-sm font-semibold bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live System
                </div>
              </div>

              {/* High-Fidelity Admin Dashboard Image Container */}
              <div className="relative border border-border/80 rounded-2xl overflow-hidden shadow-xl aspect-[1.6] max-w-4xl mx-auto bg-background">
                <img 
                  src={AdminDashboardImg} 
                  alt="CafeFlow Admin dashboard mockup" 
                  className="w-full h-full object-cover object-top"
                />

                {/* Pulsing Hotspots for Admin Panel */}
                <Hotspot 
                  top="25%" 
                  left="35%" 
                  title="Real-Time Metrics" 
                  description="Observe today's revenue, order numbers, new customers, and table occupancy rate updating live." 
                />
                <Hotspot 
                  top="45%" 
                  left="42%" 
                  title="Hourly Revenue Performance" 
                  description="Analyze historical and live sales charts to adjust kitchen prep lines for peak operational hours." 
                />
                <Hotspot 
                  top="52%" 
                  left="82%" 
                  title="Active Order Dispatch" 
                  description="Track orders by ID and table. Dispatch status color tags (Preparing, Ready to Go) notify floor servers instantly." 
                />
              </div>
            </div>
          )}

          {/* ================= TAB 2: KITCHEN DASHBOARD ================= */}
          {activeTab === "kitchen" && (
            <div className="w-full space-y-6 animate-fade-in">
              <div className="flex justify-between items-center pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-foreground">Kitchen Order Display (KOD)</h3>
                  <p className="text-sm text-muted-foreground">Kitchen display terminal simulator</p>
                </div>
                <div className="text-sm font-semibold bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full">
                  Real-time Prep Sync
                </div>
              </div>

              {/* High-Fidelity Kitchen Display Image Container */}
              <div className="relative border border-border/80 rounded-2xl overflow-hidden shadow-xl aspect-[1.0] max-w-3xl mx-auto bg-background">
                <img 
                  src={KitchenDashboardImg} 
                  alt="CafeFlow Kitchen order display mockup" 
                  className="w-full h-full object-cover"
                />

                {/* Pulsing Hotspots for Kitchen Display */}
                <Hotspot 
                  top="12%" 
                  left="8%" 
                  title="Active Table Tickets" 
                  description="Each table order card lists the table number, order number, timestamp, and time elapsed to manage service speed." 
                />
                <Hotspot 
                  top="15%" 
                  left="25%" 
                  title="Cooking Status Badges" 
                  description="Tickets toggle states between Cooking, Ready, and Done. Staff can bump or cancel tickets directly." 
                />
                <Hotspot 
                  top="55%" 
                  left="48%" 
                  title="Checklist Syncing" 
                  description="Food items are listed with quantities (e.g. Nachos x1, Tacos x1). The kitchen board updates live as tables complete checkouts." 
                />
              </div>
            </div>
          )}

          {/* ================= TAB 3: WAITER CONSOLE ================= */}
          {activeTab === "waiter" && (
            <div className="w-full space-y-6 animate-fade-in">
              <div className="flex justify-between items-center pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-2xl font-playfair font-bold text-foreground">Waiter Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Floor notifications & service calls</p>
                </div>
                <span className="text-xs font-semibold bg-primary/10 border border-primary/20 text-primary px-3 py-1 rounded-full">
                  Live Sync Active
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                {/* Active Calls List */}
                <div className="lg:col-span-7 bg-card border border-border/80 rounded-xl p-5 space-y-4">
                  <h4 className="font-playfair font-bold text-lg text-foreground flex items-center gap-2">
                    <Bell className="h-4.5 w-4.5 text-primary animate-bounce" /> Active Service Calls
                  </h4>
                  
                  <div className="divide-y divide-border/60">
                    {waiterRequests.map(req => (
                      <div 
                        key={req.id} 
                        className={`py-3.5 flex justify-between items-center transition-all ${
                          req.resolved ? "opacity-40" : ""
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{req.table}</span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              req.type === "Wants Bill" 
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" 
                                : req.type === "Needs Water" 
                                  ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" 
                                  : "bg-red-500/10 text-red-500 border border-red-500/20"
                            }`}>
                              {req.type}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground block">{req.time}</span>
                        </div>

                        {req.resolved ? (
                          <span className="text-xs text-green-500 font-semibold flex items-center gap-1">
                            <Check className="h-4 w-4" /> Resolved
                          </span>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground text-xs font-semibold px-4 rounded-lg"
                            onClick={() => resolveRequest(req.id)}
                          >
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floor Table Map simulator */}
                <div className="lg:col-span-5 bg-card border border-border/80 rounded-xl p-5 space-y-4">
                  <h4 className="font-playfair font-bold text-lg text-foreground">Floor Layout Status</h4>
                  <div className="grid grid-cols-3 gap-3.5">
                    {[
                      { num: "T1", status: "occupied" },
                      { num: "T2", status: "billing" },
                      { num: "T3", status: "empty" },
                      { num: "T4", status: "alert" },
                      { num: "T5", status: "occupied" },
                      { num: "T6", status: "empty" }
                    ].map(tab => (
                      <div 
                        key={tab.num} 
                        className={`aspect-square rounded-xl border flex flex-col items-center justify-center p-2 transition-all ${
                          tab.status === "occupied" 
                            ? "bg-muted border-border/80 text-muted-foreground" 
                            : tab.status === "empty" 
                              ? "bg-background border-border/50 text-muted-foreground" 
                              : tab.status === "billing" 
                                ? "bg-amber-500/10 border-amber-500/40 text-amber-500" 
                                : "bg-red-500/10 border-red-500/40 text-red-500 animate-pulse font-bold"
                        }`}
                      >
                        <span className="text-sm font-bold">{tab.num}</span>
                        <span className="text-[8px] uppercase font-semibold mt-1 tracking-wider opacity-85">
                          {tab.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: CUSTOMER PHONE MENU ================= */}
          {activeTab === "customer" && (
            <div className="w-full flex flex-col lg:flex-row gap-8 items-center justify-center animate-fade-in">
              {/* Left explanation info */}
              <div className="lg:w-1/2 space-y-4 text-left">
                <h3 className="text-2xl font-playfair font-bold text-foreground">No-friction Customer Menu</h3>
                <p className="text-muted-foreground text-base leading-relaxed">
                  Guests scan the QR code to open this responsive web application directly. They can instantly browse categories, view detailed pricing, customize toppings, and add items to their local cart.
                </p>
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl space-y-2">
                  <h4 className="font-playfair font-bold text-primary">Interactive Demo:</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Try adding or subtracting items inside the phone screen on the right. Watch the checkout total update automatically!
                  </p>
                </div>
              </div>

              {/* Right phone mockup wrapper */}
              <div className="lg:w-1/2 flex justify-center relative">
                {/* Hotspot pointing out QR Verification */}
                <div className="absolute top-[15%] left-[80%] z-40 transform translate-x-1/2 -translate-y-1/2">
                  <Hotspot 
                    top="0px"
                    left="0px"
                    title="QR Verified Badge" 
                    description="Assures guests that they are ordering for their specific table, routing tickets correctly without login credentials." 
                    align="top"
                  />
                </div>

                <div className="w-[280px] aspect-[0.5] bg-card border-[6px] border-zinc-800 rounded-[32px] shadow-2xl overflow-hidden relative">
                  {/* Speaker bezel */}
                  <div className="w-20 h-4 bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 transform -translate-x-1/2 z-30 flex items-center justify-center">
                    <div className="w-10 h-1 bg-zinc-700 rounded-full"></div>
                  </div>

                  {/* Internal Web Menu View */}
                  <div className="h-full pt-6 pb-2 px-3 flex flex-col justify-between bg-muted/10 text-[9px]">
                    {/* Header */}
                    <div className="flex justify-between items-center pb-2 border-b border-border/40">
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1">
                          <Coffee className="h-3 w-3 text-primary" /> Aroma Café
                        </div>
                        <div className="text-[7px] text-muted-foreground">Table 12</div>
                      </div>
                      <span className="bg-primary/20 text-primary border border-primary/20 px-2 py-0.5 rounded-full text-[7px] font-semibold">
                        QR Verified
                      </span>
                    </div>

                    {/* Menu Items lists */}
                    <div className="flex-1 overflow-y-auto py-2 space-y-2">
                      {/* Item 1 */}
                      <div className="bg-card border border-border/40 p-2 rounded-xl flex gap-2.5 items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-foreground text-xs">Caramel Latte</div>
                          <div className="text-muted-foreground text-[8px] mt-0.5">$4.75</div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button 
                            className="w-5 h-5 rounded-md bg-muted border border-border/80 text-foreground flex items-center justify-center font-bold hover:bg-primary/20 transition"
                            onClick={() => updateCart("Caramel Latte", -1)}
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="font-bold text-foreground text-xs">{cart["Caramel Latte"] || 0}</span>
                          <button 
                            className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold hover:bg-primary/90 transition"
                            onClick={() => updateCart("Caramel Latte", 1)}
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Item 2 */}
                      <div className="bg-card border border-border/40 p-2 rounded-xl flex gap-2.5 items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-foreground text-xs">Almond Croissant</div>
                          <div className="text-muted-foreground text-[8px] mt-0.5">$3.50</div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button 
                            className="w-5 h-5 rounded-md bg-muted border border-border/80 text-foreground flex items-center justify-center font-bold hover:bg-primary/20 transition"
                            onClick={() => updateCart("Almond Croissant", -1)}
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="font-bold text-foreground text-xs">{cart["Almond Croissant"] || 0}</span>
                          <button 
                            className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold hover:bg-primary/90 transition"
                            onClick={() => updateCart("Almond Croissant", 1)}
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Item 3 */}
                      <div className="bg-card border border-border/40 p-2 rounded-xl flex gap-2.5 items-center justify-between">
                        <div className="flex-1">
                          <div className="font-bold text-foreground text-xs">Avocado Toast</div>
                          <div className="text-muted-foreground text-[8px] mt-0.5">$9.50</div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <button 
                            className="w-5 h-5 rounded-md bg-muted border border-border/80 text-foreground flex items-center justify-center font-bold hover:bg-primary/20 transition"
                            onClick={() => updateCart("Avocado Toast", -1)}
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </button>
                          <span className="font-bold text-foreground text-xs">{cart["Avocado Toast"] || 0}</span>
                          <button 
                            className="w-5 h-5 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold hover:bg-primary/90 transition"
                            onClick={() => updateCart("Avocado Toast", 1)}
                          >
                            <Plus className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Cart Footer */}
                    <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-foreground px-1">
                        <span>Cart Total</span>
                        <span className="text-primary font-bold font-playfair">${cartTotalPrice}</span>
                      </div>
                      <Button 
                        disabled={cartTotalItems === 0}
                        className="bg-primary hover:bg-primary/95 text-primary-foreground w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-primary/10 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Place Order ({cartTotalItems} items)
                      </Button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
