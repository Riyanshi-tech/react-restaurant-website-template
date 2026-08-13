import React, { useEffect, useState } from 'react';
import { orderService, settingsService, BillingSettings } from '../../services/posService';
import { Order } from '../../types';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils';
import { printThermalBill, sendBillWhatsApp } from '@/lib/bill';

const AllOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [billing, setBilling] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchOrders = async (showSpin = true) => {
    try {
      if (showSpin) setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data.orders);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
    } finally {
      if (showSpin) setLoading(false);
    }
  };

  useEffect(() => {
    settingsService.getBilling().then(setBilling).catch(() => setBilling(null));
    fetchOrders();
  }, []);

  const printBill = async (order: Order) => {
    if (!billing) return toast.error('Billing settings not loaded');

    const id = order._id || order.id!;
    try {
      setBusyId(id);
      printThermalBill(order, billing);
      await orderService.update(id, { status: 'READY' });
      toast.success('Print dialog opened');
      fetchOrders(false);
    } catch (err: any) {
      toast.error(err.message || err.response?.data?.message || 'Print failed');
    } finally {
      setBusyId(null);
    }
  };

  const sendWhatsApp = async (order: Order) => {
    if (!order.guestPhone) return toast.error('No guest phone on this order');
    if (!billing) return toast.error('Billing settings not loaded');

    const id = order._id || order.id!;
    try {
      setBusyId(id);
      sendBillWhatsApp(order, billing);
      await orderService.update(id, { status: 'READY' });
      toast.success('WhatsApp opened with bill link');
      fetchOrders(false);
    } catch (err: any) {
      toast.error(err.message || err.response?.data?.message || 'WhatsApp failed');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold">All Orders</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
            Full history — Print or WhatsApp bill link
          </p>
        </div>
        <button onClick={() => fetchOrders()} className="p-2 border border-gold-300/20 rounded-lg">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-gold-300/10 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gold-300/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-forest-900/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Order</th>
                <th className="text-left p-3">Guest</th>
                <th className="text-left p-3">Table</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Total</th>
                <th className="text-right p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const table = typeof o.table === 'object' ? o.table : null;
                const id = o._id || o.id!;
                return (
                  <tr key={id} className="border-t border-gold-300/10">
                    <td className="p-3 font-medium">
                      <div>{o.orderNumber}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {o.guestName || '—'}
                      <div>{o.guestPhone || ''}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">{table?.name || '—'}</td>
                    <td className="p-3">
                      <span className="text-[10px] uppercase tracking-wider">
                        {o.status} · {o.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right text-primary font-semibold">{formatINR(o.total)}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={busyId === id}
                          onClick={() => printBill(o)}
                          className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary disabled:opacity-40"
                        >
                          Print
                        </button>
                        <button
                          disabled={!o.guestPhone || busyId === id}
                          onClick={() => sendWhatsApp(o)}
                          className="text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 disabled:opacity-40"
                        >
                          WA
                        </button>
                      </div>
                    </td>
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

export default AllOrders;
