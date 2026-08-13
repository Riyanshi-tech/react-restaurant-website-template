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
  CreditCard,
  XCircle,
  User,
  Phone,
  History
} from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface GuestInfo {
  name: string;
  phone: string;
}

const guestKey = (slug: string) => `foresthub-guest-${slug}`;

const resolveImage = (image?: string) => {
  if (!image) return undefined;
  if (image.startsWith('http://') || image.startsWith('https://') || image.startsWith('data:')) {
    return image;
  }
  return undefined;
};

const digitsOnly = (v: string) => v.replace(/\D/g, '');

const CustomerOrdering: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<PublicTablePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [guest, setGuest] = useState<GuestInfo | null>(null);
  const [gateName, setGateName] = useState('');
  const [gatePhone, setGatePhone] = useState('');
  const [guestOrders, setGuestOrders] = useState<Order[]>([]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('breakfast');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [assistanceSent, setAssistanceSent] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    try {
      const raw = sessionStorage.getItem(guestKey(slug));
      if (raw) {
        const parsed = JSON.parse(raw) as GuestInfo;
        if (parsed?.name && parsed?.phone) setGuest(parsed);
      }
    } catch {
      // ignore bad cache
    }
  }, [slug]);

  const fetchTableDetails = async (showLoading = true) => {
    if (!slug) return;
    try {
      if (showLoading) setLoading(true);
      const details = await tableService.getPublicTableDetails(slug);
      setData(details);
      setError(null);
      if (details.menu.categories.length && !details.menu.categories.includes(activeCategory)) {
        setActiveCategory(details.menu.categories[0]);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load table details. Please re-scan the QR code.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const fetchGuestOrders = async (phone: string) => {
    try {
      const orders = await tableService.getGuestOrders(phone);
      setGuestOrders(orders);
    } catch {
      setGuestOrders([]);
    }
  };

  useEffect(() => {
    fetchTableDetails();
  }, [slug]);

  useEffect(() => {
    if (guest?.phone) fetchGuestOrders(guest.phone);
  }, [guest?.phone]);

  useEffect(() => {
    if (!slug || !data?.activeOrder || !guest) return;
    const interval = setInterval(() => fetchTableDetails(false), 10000);
    return () => clearInterval(interval);
  }, [slug, data?.activeOrder, guest]);

  const enterAsGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const name = gateName.trim();
    const phone = digitsOnly(gatePhone);
    if (name.length < 2) return toast.error('Enter your full name');
    if (phone.length < 8) return toast.error('Enter a valid phone number');
    const info = { name, phone };
    if (slug) sessionStorage.setItem(guestKey(slug), JSON.stringify(info));
    setGuest(info);
  };

  const addToCart = (item: MenuItem) => {
    const itemId = item.id || item._id;
    setCart((prev) => {
      const existing = prev.find((i) => (i.menuItem.id || i.menuItem._id) === itemId);
      if (existing) {
        return prev.map((i) =>
          (i.menuItem.id || i.menuItem._id) === itemId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to order`);
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart(
      (prev) =>
        prev
          .map((item) => {
            const currentId = item.menuItem.id || item.menuItem._id;
            if (currentId === itemId) {
              const newQty = item.quantity + delta;
              return newQty > 0 ? { ...item, quantity: newQty } : null;
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const getCartTotal = () => cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!slug || cart.length === 0 || !guest) return;
    if (guest.name.trim().length < 2 || digitsOnly(guest.phone).length < 8) {
      return toast.error('Name and phone are required');
    }

    try {
      setSubmittingOrder(true);
      const payload = cart.map((item) => ({
        menuItemId: (item.menuItem.id || item.menuItem._id)!,
        quantity: item.quantity
      }));

      await tableService.placeTableOrder(slug, payload, {
        guestName: guest.name.trim(),
        guestPhone: guest.phone
      });
      toast.success('Your order has been transmitted to the kitchen!');
      setCart([]);
      setIsCartOpen(false);
      await fetchTableDetails(true);
      await fetchGuestOrders(guest.phone);
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
        <p className="text-muted-foreground text-sm max-w-md mb-6">
          {error || 'Table parameters could not be read.'}
        </p>
        <div className="p-4 bg-forest-900/40 border border-gold-300/10 rounded-2xl max-w-sm text-xs text-muted-foreground">
          Please contact staff or re-scan the QR code at your table to initiate Ordering.
        </div>
      </div>
    );
  }

  const { table, restaurant, menu, activeOrder } = data;

  // Gate: name + phone before menu
  if (!guest) {
    return (
      <div className="min-h-screen bg-forest-950 text-foreground flex items-center justify-center p-6">
        <form
          onSubmit={enterAsGuest}
          className="w-full max-w-md bg-forest-900/40 border border-gold-300/15 rounded-3xl p-8 space-y-5"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
              <Utensils className="h-5 w-5" />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-primary font-semibold">
              {restaurant.name} · {table.name}
            </p>
            <h1 className="font-playfair text-2xl font-bold">Welcome</h1>
            <p className="text-xs text-muted-foreground">
              Enter name and phone to start ordering. We use phone to show your past tickets.
            </p>
          </div>

          <label className="block space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Full name *
            </span>
            <input
              required
              minLength={2}
              value={gateName}
              onChange={(e) => setGateName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-4 py-3 text-sm"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Phone *
            </span>
            <input
              required
              type="tel"
              inputMode="tel"
              value={gatePhone}
              onChange={(e) => setGatePhone(e.target.value)}
              placeholder="10-digit mobile"
              className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-4 py-3 text-sm"
            />
          </label>

          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-black font-semibold rounded-xl text-xs uppercase tracking-wider"
          >
            Continue to Menu
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest-950 text-foreground pb-24 selection:bg-primary selection:text-primary-foreground">
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
              {table.name}{' '}
              <span className="text-muted-foreground font-sans font-normal text-xs">({table.location})</span>
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {guest.name} · {guest.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRequestAssistance('Waiter Service')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
              assistanceSent === 'Waiter Service'
                ? 'bg-primary/20 border-primary text-primary'
                : 'bg-forest-950/60 border-gold-300/15 text-muted-foreground hover:border-primary/40'
            }`}
          >
            <Bell
              className={`h-3.5 w-3.5 ${
                assistanceSent === 'Waiter Service' ? 'text-primary animate-bounce' : 'text-primary/70'
              }`}
            />
            Call Waiter
          </button>
          <button
            onClick={() => handleRequestAssistance('Help / Query')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest-950/60 border border-gold-300/15 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary/40"
          >
            <HelpCircle className="h-3.5 w-3.5 text-primary/70" />
            Help
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-forest-950/60 border border-gold-300/15 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:border-primary/40"
          >
            <History className="h-3.5 w-3.5 text-primary/70" />
            My Orders
          </button>
        </div>
      </header>

      {activeOrder && (
        <div className="bg-amber-500/5 border-b border-amber-500/10 px-4 py-3 flex items-center justify-center gap-2 text-xs">
          <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-muted-foreground">
            Your order is currently{' '}
            <span className="text-primary font-semibold font-mono">{activeOrder.status}</span>. Total:{' '}
            {formatINR(activeOrder.total)}
          </span>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-gold-300/5 mb-6">
          {menu.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-200 whitespace-nowrap border ${
                activeCategory === category
                  ? 'bg-primary/15 border-primary/40 text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.items
            .filter((item) => item.category === activeCategory)
            .map((item) => {
              const imageSrc = resolveImage(item.image);
              const itemId = item.id || item._id;
              const cartItem = cart.find((i) => (i.menuItem.id || i.menuItem._id) === itemId);

              return (
                <div
                  key={itemId}
                  className="bg-forest-900/20 border border-gold-300/10 rounded-2xl overflow-hidden flex gap-4 p-4 hover:border-gold-300/20 transition-all duration-200 backdrop-blur-sm"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-gold-300/5 bg-forest-950 flex items-center justify-center">
                    {imageSrc ? (
                      <img src={imageSrc} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <Utensils className="h-6 w-6 text-muted-foreground/40" />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-playfair text-sm font-bold truncate text-foreground">{item.name}</h3>
                        <span className="font-playfair text-xs font-semibold text-primary shrink-0">
                          {formatINR(item.price)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                      {item.tag && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] text-primary/80 uppercase tracking-wider">
                          <Sparkles className="h-2.5 w-2.5" />
                          {item.tag}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-end mt-2">
                      {cartItem ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(itemId!, -1)}
                            className="w-6 h-6 rounded-lg bg-forest-800 hover:bg-forest-700 flex items-center justify-center text-primary"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold w-4 text-center">{cartItem.quantity}</span>
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

        {guestOrders.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gold-300/10">
            <h2 className="font-playfair text-xl font-bold mb-4 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" /> Your Orders
            </h2>
            <div className="space-y-3">
              {guestOrders.map((o) => {
                const t = typeof o.table === 'object' ? o.table : null;
                return (
                  <div
                    key={o._id || o.id}
                    className="bg-forest-900/30 border border-gold-300/10 rounded-2xl p-4 flex flex-wrap justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-semibold">{o.orderNumber}</div>
                      <div className="text-muted-foreground mt-0.5">
                        {t ? `${t.name}` : 'Table'} · {o.status} · {o.paymentStatus}
                      </div>
                      <div className="text-muted-foreground mt-1">
                        {o.items.map((i) => `${i.quantity}× ${i.name}`).join(', ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary font-bold">{formatINR(o.total)}</div>
                      <div className="text-muted-foreground text-[10px]">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

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
              <p className="font-playfair text-sm font-bold text-primary">{formatINR(getCartTotal())}</p>
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

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md bg-forest-950 border-l border-gold-300/15 h-full flex flex-col p-6 relative">
            <button
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-4 border-b border-gold-300/10 pb-4">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-playfair text-lg font-bold">Your Table Ticket</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  Confirm guest + items
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              <div className="space-y-3">
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-primary">Guest details *</h3>
                <label className="block space-y-1">
                  <span className="text-[10px] text-muted-foreground">Name</span>
                  <input
                    required
                    value={guest.name}
                    onChange={(e) => {
                      const next = { ...guest, name: e.target.value };
                      setGuest(next);
                      if (slug) sessionStorage.setItem(guestKey(slug), JSON.stringify(next));
                    }}
                    className="w-full bg-forest-900/40 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] text-muted-foreground">Phone</span>
                  <input
                    required
                    type="tel"
                    value={guest.phone}
                    onChange={(e) => {
                      const next = { ...guest, phone: digitsOnly(e.target.value) };
                      setGuest(next);
                      if (slug) sessionStorage.setItem(guestKey(slug), JSON.stringify(next));
                    }}
                    className="w-full bg-forest-900/40 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div>
                <h3 className="text-[10px] uppercase font-bold tracking-widest text-primary mb-3">Items in Draft</h3>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground text-xs italic">No draft items selected.</p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const itemId = item.menuItem.id || item.menuItem._id;
                      return (
                        <div
                          key={itemId}
                          className="flex justify-between items-center gap-3 bg-forest-900/20 border border-gold-300/5 p-3 rounded-xl"
                        >
                          <div className="min-w-0">
                            <h4 className="font-semibold text-xs truncate">{item.menuItem.name}</h4>
                            <span className="text-[10px] text-primary/80 font-mono">
                              {formatINR(item.menuItem.price)} each
                            </span>
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
                      <span className="font-playfair text-sm text-primary font-bold">
                        {formatINR(getCartTotal())}
                      </span>
                    </div>

                    <button
                      onClick={handlePlaceOrder}
                      disabled={submittingOrder}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-primary disabled:opacity-50 text-black font-semibold rounded-xl text-xs uppercase tracking-wider hover:bg-primary/95 transition-all duration-200"
                    >
                      {submittingOrder ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Transmit Order to Kitchen
                    </button>
                  </div>
                )}
              </div>

              {activeOrder && (
                <div className="pt-6 border-t border-gold-300/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
                      Transmitted Ticket
                    </h3>
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
                            {item.name}{' '}
                            <span className="text-primary font-bold font-mono">x{item.quantity}</span>
                          </span>
                          <span className="font-mono text-muted-foreground">
                            {formatINR(item.priceAtOrder * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-gold-300/5 flex justify-between items-center text-xs font-semibold">
                      <span>Grand Total</span>
                      <span className="text-primary font-bold">{formatINR(activeOrder.total)}</span>
                    </div>
                    {activeOrder.paymentStatus === 'UNPAID' && (
                      <button
                        onClick={() => handleRequestAssistance('Bill Request / POS')}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-gold-300/10 border border-gold-300/20 text-primary hover:bg-gold-300/20 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        Request Bill Settlement
                      </button>
                    )}
                  </div>
                </div>
              )}

              {guestOrders.length > 0 && (
                <div className="pt-6 border-t border-gold-300/10">
                  <h3 className="text-[10px] uppercase font-bold tracking-widest text-primary mb-3">
                    All your tickets
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {guestOrders.map((o) => (
                      <div
                        key={o._id || o.id}
                        className="text-[11px] bg-forest-900/20 border border-gold-300/5 rounded-xl p-3 flex justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold">{o.orderNumber}</div>
                          <div className="text-muted-foreground">
                            {o.status} · {o.paymentStatus}
                          </div>
                        </div>
                        <div className="text-primary font-bold">{formatINR(o.total)}</div>
                      </div>
                    ))}
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
