import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { DollarSign, ShoppingBag, ClipboardList, Wallet } from 'lucide-react';

const CashierHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Welcome Header */}
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold">POS Billing Station</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Today's Sales</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">$1,245.50</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">14 orders settled</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Active Orders</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <ShoppingBag className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">4 Pending</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">Sent to kitchen queue</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Active Tables</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">9 / 24</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">Occupied and ordering</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Drawer Status</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <Wallet className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold">BALANCED</h3>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">Shift register synchronized</p>
        </div>
      </div>

      {/* POS Billing Interactive Box */}
      <div className="bg-forest-900/20 border border-gold-300/10 rounded-3xl p-8">
        <h2 className="font-playfair text-xl font-bold mb-4">Point of Sale (POS) Hub</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          As a Cashier, you have access to order settlement, bill generation, and customer checkout receipts. You can check order tickets sent to the kitchen and update order flags once they are served and paid.
        </p>
      </div>
    </div>
  );
};

export default CashierHome;
