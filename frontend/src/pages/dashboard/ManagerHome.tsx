import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardService, DashboardStats } from '../../services/posService';
import { Users, ChefHat, ShoppingBag, DollarSign, Loader2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';

const ManagerHome: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Staff', value: stats?.users ?? '—', sub: 'Active users', icon: Users },
    { label: 'Menu Items', value: stats?.menuItems ?? '—', sub: 'Available now', icon: ChefHat },
    { label: 'Open Orders', value: stats?.openOrders ?? '—', sub: 'In kitchen / floor', icon: ShoppingBag },
    { label: "Today's Sales", value: stats ? formatINR(stats.todaySales) : '—', sub: `${stats?.todayOrderCount ?? 0} settled`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold">Manager Terminal</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
          Welcome back, {user?.name}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading live stats…
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div key={c.label} className="bg-forest-900/40 p-6 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{c.label}</span>
                <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                  <c.icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <h3 className="text-2xl font-bold">{c.value}</h3>
              <p className="text-[10px] text-primary mt-1 font-semibold">{c.sub}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagerHome;
