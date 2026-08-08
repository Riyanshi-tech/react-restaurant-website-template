import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ChefHat, CalendarDays, ClipboardList, ShieldAlert } from 'lucide-react';

const ManagerHome: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Welcome Header */}
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold">Manager Terminal</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
          Welcome back, {user?.name}
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Kitchen Staff</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <ClipboardList className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">8 Active</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">4 checked in this shift</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Active Reservations</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <CalendarDays className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">6 Today</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">2 VIP seating slots</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Gastronomy Items</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
              <ChefHat className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold">48</h3>
          <p className="text-[10px] text-primary mt-1 font-semibold">All items available in pantry</p>
        </div>

        <div className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Clearance Level</span>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
          </div>
          <h3 className="text-lg font-bold">OPERATIONS</h3>
          <p className="text-[10px] text-amber-400 mt-1 font-semibold">Restricted: Settings / Admins</p>
        </div>
      </div>

      {/* Main Panel Content Box */}
      <div className="bg-forest-900/20 border border-gold-300/10 rounded-3xl p-8">
        <h2 className="font-playfair text-xl font-bold mb-4">Operational Operations Center</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          As a Manager, you handle the day-to-day gastronomy logs, reserve seating approvals, table seating assignments, and coordinate POS records. You cannot delete users or modify security credentials, which are restricted to Admin level clearance.
        </p>
      </div>
    </div>
  );
};

export default ManagerHome;
