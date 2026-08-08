import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { tableService } from '../services/tableService';
import { MenuItem, PublicTablePayload, Order } from '../types';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Bell, 
  Check, 
  Loader2, 
  Utensils, 
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

// Import images from assets to match static seeded paths
import dishSteak from "@/assets/images/dish-steak.webp";
import dishCoffee from "@/assets/images/dish-coffee.webp";
import ourStory from "@/assets/images/our-story.webp";
import ambience1 from "@/assets/images/ambience-1.webp";
import jungleHero from "@/assets/images/jungle-hero.webp";
import heroBg from "@/assets/images/hero-bg.webp";

const imageMap: Record<string, string> = {
  'dish-steak': dishSteak,
  'dish-coffee': dishCoffee,
  'our-story': ourStory,
  'ambience-1': ambience1,
  'jungle-hero': jungleHero,
  'heroBg': heroBg,
};

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

const CustomerOrdering: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PublicTablePayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('breakfast');
  const [submittingOrder, setSubmittingOrder] = useState<boolean>(false);
  const [assistanceSent, setAssistanceSent] = useState<string | null>(null);

  const fetchTableDetails = async (showLoading = true) => {
    if (!slug) return;
    try {
      if (showLoading) setLoading(true);
      const details = await tableService.getPublicTableDetails(slug);
      setData(details);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load table details. Please re-scan the QR code.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchTableDetails();
  }, [slug]);

  // Polling for active order status updates
  useEffect(() => {
    if (!slug || !data?.activeOrder) return;
    const interval = setInterval(() => {
      fetchTableDetails(false);
    }, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [slug, data?.activeOrder]);

  const addToCart = (item: MenuItem) => {
    const itemId = item.id || item._id;
    setCart(prev => {
      const existing = prev.find(i => (i.menuItem.id || i.menuItem._id) === itemId);
      if (existing) {
        return prev.map(i => (i.menuItem.id || i.menuItem._id) === itemId ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to order`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        const currentId = item.menuItem.id || item.menuItem._id;
        if (currentId === itemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.menuItem.price * item.quantity), 0);
  };

  const handlePlaceOrder = async () => {
    if (!slug || cart.length === 0) return;

    try {
      setSubmittingOrder(true);
      const payload = cart.map(item => ({
        menuItemId: (item.menuItem.id || item.menuItem._id)!,
        quantity: item.quantity
      }));

      await tableService.placeTableOrder(slug, payload);
      toast.success('Your order has been transmitted to the kitchen!');
      setCart([]);
      setIsCartOpen(false);
      // Re-fetch details to synchronize active order info
      await fetchTableDetails(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to transmit order');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleRequestAssistance = (type: string) => {
    setAssistanceSent(type);
    toast.success(`${type} request sent to host staff!`);
    setTimeout(() => setAssistanceSent(null), 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center text-foreground">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="font-playfair text-sm uppercase tracking-widest text-primary animate-pulse">
          Connecting to ForestHub Table...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center text-foreground p-6 text-center">
        <XCircle className="h-16 w-16 text-rose-500 mb-4" />
        <h1 className="font-playfair text-2xl font-bold mb-2">Connection Error</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-6">{error || 'Table parameters could not be read.'}</p>
        <div className="p-4 bg-forest-900/40 border border-gold-300/10 rounded-2xl max-w-sm text-xs text-muted-foreground">
          Please contact staff or re-scan the QR code at your table to initiate Ordering.
        </div>
      </div>
    );
  }

  const { table, restaurant, menu, activeOrder } = data;

  return (
    <div className="min-h-screen bg-forest-950 text-foreground pb-24 selection:bg-primary selection:text-primary-foreground">
      {/* 1. TOP HERO / BRAND BANNER */}
      <header className="relative bg-forest-900 border-b border-gold-300/15 py-6 px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-primary font-mono block">
              {restaurant.name} Exclusive
            </span>
            <h1 className="font-playfair text-lg font-bold tracking-wide">
              {table.name} <span className="text-muted-foreground font-sans font-normal text-xs">({table.location})</span>
            </h1>
          </div>
        </div>

        {/* Quick Assistance Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => handleRequestAssistance('Waiter Service')}
            disabled={assistanceSent !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-800 hover:bg-forest-700/80 border border-gold-300/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors duration-200"
          >
            <Bell className={`h-3.5 w-3.5 ${assistanceSent === 'Waiter Service' ? 'text-primary animate-bounce' : 'text-primary/70'}`} />
            {assistanceSent === 'Waiter Service' ? 'Requested' : 'Call Host'}
          </button>
          <button
            onClick={() => handleRequestAssistance('Water Service')}
            disabled={assistanceSent !== null}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-800 hover:bg-forest-700/80 border border-gold-300/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors duration-200"
          >
            <HelpCircle className="h-3.5 w-3.5 text-primary/70" />
            Water
          </button>
        </div>
      </header>

      {/* 2. BODY CONTENT: MENU DISHES */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Active Ticket Notification Banner */}
        {activeOrder && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400">
                  Active Ticket: {activeOrder.orderNumber}
                </h4>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Your order is currently <span className="text-primary font-semibold font-mono">{activeOrder.status}</span>. Total: ${activeOrder.total}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 rounded-lg text-[10px] font-bold uppercase tracking-wider text-emerald-400 transition-colors"
            >
              View Ticket Details
            </button>
          </div>
        )}

        {/* Categories Tab Selector */}
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-gold-300/5">
          {menu.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap border ${
                activeCategory === category
                  ? 'bg-primary text-black border-primary'
                  : 'bg-forest-900/30 text-muted-foreground border-gold-300/5 hover:border-gold-300/10 hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.items
            .filter(item => item.category === activeCategory)
            .map(item => {
              const imageSrc = item.image ? imageMap[item.image] || ourStory : ourStory;
              const itemId = item.id || item._id;
              const cartItem = cart.find(i => (i.menuItem.id || i.menuItem._id) === itemId);

              return (
                <div 
                  key={itemId}
                  className="bg-forest-900/20 border border-gold-300/10 rounded-2xl overflow-hidden flex gap-4 p-4 hover:border-gold-300/20 transition-all duration-200 backdrop-blur-sm"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-gold-300/5 bg-forest-950">
                    <img 
                      src={imageSrc} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-playfair text-sm font-bold truncate text-foreground">
                          {item.name}
                        </h3>
                        <span className="font-playfair text-xs font-semibold text-primary shrink-0">
                          ${item.price}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      {item.tag && (
                        <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-gold-300/10 border border-gold-300/20 text-primary">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end items-center mt-3 pt-2 border-t border-gold-300/5">
                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(itemId!, -1)}
                            className="w-6 h-6 rounded-lg bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-primary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold px-1.5">{cartItem.quantity}</span>
                          <button
                            onClick={() => updateQuantity(itemId!, 1)}
                            className="w-6 h-6 rounded-lg bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-primary"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1 px-3 py-1 bg-gold-300/10 hover:bg-gold-300/20 border border-gold-300/20 rounded-lg text-[9px] font-bold uppercase tracking-wider text-primary transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                          Add to Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </main>

      {/* 3. PERSISTENT CART BAR AT BOTTOM */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-forest-900 border-t border-gold-300/15 py-4 px-6 flex items-center justify-between max-w-4xl mx-auto rounded-t-3xl shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-black rounded-full text-[9px] font-bold flex items-center justify-center border border-forest-900">
                {cart.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Basket Estimate</span>
              <p className="font-playfair text-sm font-bold text-primary">${getCartTotal()}</p>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black hover:bg-primary/90 font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors duration-200"
          >
            Review Order
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 4. CART & ACTIVE TICKET SHEET MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-forest-950 border-l border-gold-300/15 h-full flex flex-col p-6 relative">
            <button 
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-6 border-b border-gold-300/10 pb-4">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-playfair text-lg font-bold">Your Table Ticket</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  Confirm items or track active tickets
                </p>
              </div>
            </div>

            {/* Scrollable ticket panel */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* SECTION A: Pending items in cart */}
              <div>
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-primary mb-3">Items in Draft</h3>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-xs italic">No draft items selected.</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => {
                      const itemId = item.menuItem.id || item.menuItem._id;
                      return (
                        <div key={itemId} className="flex justify-between items-center gap-3 bg-forest-900/20 border border-gold-300/5 p-3 rounded-xl">
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs truncate">{item.menuItem.name}</h4>
                            <span className="text-[10px] text-primary/80 font-mono">${item.menuItem.price} each</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => updateQuantity(itemId!, -1)}
                              className="w-5 h-5 rounded bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-primary"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-xs font-mono font-bold w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(itemId!, 1)}
                              className="w-5 h-5 rounded bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-primary"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    
                    <div className="pt-2 border-t border-gold-300/5 flex justify-between items-center text-xs">
                      <span className="text-muted-foreground font-semibold">Total Draft Cost</span>
                      <span className="font-playfair text-sm text-primary font-bold">${getCartTotal()}</span>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={submittingOrder}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary disabled:opacity-50 text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-primary/95 transition-all duration-200"
                    >
                      {submittingOrder ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Transmit Order to Kitchen
                    </button>
                  </div>
                )}
              </div>

              {/* SECTION B: Submitted active order items */}
              {activeOrder && (
                <div className="pt-6 border-t border-gold-300/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Transmitted Ticket</h3>
                    <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {activeOrder.status}
                    </span>
                  </div>
                  
                  <div className="bg-forest-900/30 border border-gold-300/5 p-4 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider border-b border-gold-300/5 pb-2">
                      <span>Ticket #{activeOrder.orderNumber}</span>
                      <span>Payment: {activeOrder.paymentStatus}</span>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {activeOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-muted-foreground truncate max-w-[200px]">
                            {item.name} <span className="text-primary font-bold font-mono">x{item.quantity}</span>
                          </span>
                          <span className="font-mono text-muted-foreground">${item.priceAtOrder * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-gold-300/5 flex justify-between items-center text-xs font-semibold">
                      <span>Grand Total</span>
                      <span className="text-primary font-bold">${activeOrder.total}</span>
                    </div>

                    {activeOrder.paymentStatus === 'UNPAID' && (
                      <div className="pt-2">
                        <button
                          onClick={() => handleRequestAssistance('Bill Request / POS')}
                          className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gold-300/10 border border-gold-300/20 text-primary hover:bg-gold-300/20 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          Request Bill Settlement
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerOrdering;
