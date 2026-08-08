import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, ChefHat, CalendarDays, ShieldCheck } from 'lucide-react';

const AdminHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Welcome Header */}
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Total Staff</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">12</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">System users active</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Menu Items</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <ChefHat className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">48</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">Active gastronomy items</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Reservations</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <CalendarDays className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">18</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">Booked for this week</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">System Security</span>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold">OPTIMAL</h3>
          <p className="text-[10px] text-emerald-400 mt-1 font-semibold">RBAC Firewall Active</p>
        </div>
      </div>

      {/* Main Panel Content Box */}
      <div className="bg-forest-900/20 border border-gold-300/10 rounded-3xl p-8">
        <h2 className="font-playfair text-xl font-bold mb-4">Administrative Center</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          As a System Administrator, you hold full root capabilities. From this panel, you can add new employee credentials, alter the operational menu, manage incoming reservations, and customize critical restaurant parameters.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="px-4 py-2 bg-gold-300/5 border border-gold-300/10 rounded-xl text-xs font-mono">
            IP: 127.0.0.1 (Docker Cluster)
          </div>
          <div className="px-4 py-2 bg-gold-300/5 border border-gold-300/10 rounded-xl text-xs font-mono">
            Node Version: v18+
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
