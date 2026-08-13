import React, { useEffect, useState } from 'react';
import { orderService, settingsService, BillingSettings } from '../../services/posService';
import { Order } from '../../types';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils';
import { printThermalBill, sendBillWhatsApp } from '@/lib/bill';

const ActiveOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [billing, setBilling] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchOrders = async (showSpin = true) => {
    try {
      if (showSpin) setLoading(true);
      const data = await orderService.getOrders({
        status: 'PENDING,PREPARING,READY,SERVED'
      });
      setOrders(data.orders.filter((o) => o.paymentStatus !== 'PAID'));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
    } finally {
      if (showSpin) setLoading(false);
    }
  };

  useEffect(() => {
    settingsService.getBilling().then(setBilling).catch(() => setBilling(null));
    fetchOrders();
    const id = setInterval(() => fetchOrders(false), 8000);
    return () => clearInterval(id);
  }, []);

  const setPreparing = async (order: Order) => {
    try {
      await orderService.update(order._id || order.id!, { status: 'PREPARING' });
      toast.success('Marked preparing');
      fetchOrders(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const printBill = async (order: Order) => {
    if (!billing) return toast.error('Billing settings not loaded');

    const id = order._id || order.id!;
    try {
      setBusyId(id);
      // print sync on click first — browsers block print/open after await
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

  const markPaid = async (order: Order) => {
    try {
      await orderService.update(order._id || order.id!, { paymentStatus: 'PAID' });
      toast.success('Marked paid');
      fetchOrders(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Payment update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold">Active Orders</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
            Preparing → Print / WhatsApp → Paid
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
          No open orders. QR guests or POS will show up here.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const table = typeof order.table === 'object' ? order.table : null;
            const id = order._id || order.id!;
            return (
              <div key={id} className="bg-forest-900/40 border border-gold-300/10 rounded-2xl p-5">
                <div className="flex flex-wrap justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold">{order.orderNumber}</div>
                    <div className="text-xs text-muted-foreground">
                      {table ? `${table.name} · ${table.location}` : 'Table'} · {formatINR(order.total)}
                      {order.guestName ? ` · ${order.guestName}` : ''}
                      {order.guestPhone ? ` · ${order.guestPhone}` : ''}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-primary/30 text-primary h-fit">
                    {order.status}
                  </span>
                </div>
                <ul className="text-xs text-muted-foreground mb-4 space-y-1">
                  {order.items.map((it, idx) => (
                    <li key={idx}>
                      {it.quantity}× {it.name}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setPreparing(order)}
                    disabled={order.status === 'PREPARING'}
                    className="text-[10px] uppercase tracking-wider px-4 py-2 rounded-full border border-gold-300/20 hover:border-primary/40 disabled:opacity-40"
                  >
                    Preparing
                  </button>
                  <button
                    onClick={() => printBill(order)}
                    disabled={busyId === id}
                    className="text-[10px] uppercase tracking-wider px-4 py-2 rounded-full bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 disabled:opacity-40"
                  >
                    {busyId === id ? '…' : 'Print'}
                  </button>
                  <button
                    onClick={() => sendWhatsApp(order)}
                    disabled={!order.guestPhone || busyId === id}
                    className="text-[10px] uppercase tracking-wider px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-40"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => markPaid(order)}
                    className="text-[10px] uppercase tracking-wider px-4 py-2 rounded-full border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                  >
                    Paid
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveOrders;
