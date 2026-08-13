import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/posService';
import { Order } from '../../types';
import { Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils';

const SalesLedger: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  });

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const start = new Date(from);
      start.setHours(0, 0, 0, 0);
      const data = await orderService.getOrders({
        paymentStatus: 'PAID',
        from: start.toISOString()
      });
      setOrders(data.orders);
      setTotalSales(data.totalSales);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, [from]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold">Sales Ledger</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
            Paid orders
          </p>
        </div>
        <label className="text-xs space-y-1">
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">From date</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2"
          />
        </label>
      </div>

      <div className="bg-forest-900/40 border border-gold-300/10 rounded-2xl p-6 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
          <DollarSign className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total collected</div>
          <div className="text-2xl font-bold text-primary">{formatINR(totalSales)}</div>
          <div className="text-xs text-muted-foreground">{orders.length} paid tickets</div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-gold-300/10 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No paid orders in this range.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gold-300/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-forest-900/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Order</th>
                <th className="text-left p-3">Table</th>
                <th className="text-left p-3">When</th>
                <th className="text-right p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const table = typeof o.table === 'object' ? o.table : null;
                return (
                  <tr key={o._id || o.id} className="border-t border-gold-300/10">
                    <td className="p-3 font-medium">{o.orderNumber}</td>
                    <td className="p-3 text-muted-foreground">{table?.name || '—'}</td>
                    <td className="p-3 text-muted-foreground">
                      {o.updatedAt ? new Date(o.updatedAt).toLocaleString() : '—'}
                    </td>
                    <td className="p-3 text-right text-primary font-semibold">{formatINR(o.total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesLedger;
