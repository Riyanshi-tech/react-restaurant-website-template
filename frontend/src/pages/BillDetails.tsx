import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Printer, Leaf } from 'lucide-react';
import { tableService } from '@/services/tableService';
import { Order } from '@/types';
import { BillingSettings } from '@/services/posService';
import { calcBillTotals, printThermalBill } from '@/lib/bill';
import { formatINR } from '@/lib/utils';

const BillDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [billing, setBilling] = useState<BillingSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!slug) {
      setError('Bill not found');
      setLoading(false);
      return;
    }

    tableService
      .getPublicBill(slug)
      .then(({ order: o, billing: b }) => {
        setOrder(o);
        setBilling(b);
      })
      .catch(() => setError('Bill not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-forest-950 flex items-center justify-center text-muted-foreground gap-2">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading bill…
      </div>
    );
  }

  if (error || !order || !billing) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center text-center px-6">
        <p className="text-muted-foreground mb-4">{error || 'Bill not found'}</p>
        <Link to="/" className="text-primary text-sm uppercase tracking-widest hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  const table = typeof order.table === 'object' ? order.table : null;
  const when = order.createdAt
    ? new Date(order.createdAt).toLocaleString('en-IN')
    : new Date().toLocaleString('en-IN');
  const { subtotal, cgstRate, sgstRate, cgst, sgst, grand } = calcBillTotals(order, billing);

  return (
    <div className="min-h-screen bg-forest-950 text-foreground py-10 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Leaf className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest">Forest Feast</span>
          </Link>
          <button
            onClick={() => printThermalBill(order, billing)}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider px-3 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
        </div>

        <div className="bg-forest-glass border border-gold-300/10 rounded-2xl p-6 sm:p-8 space-y-5 font-mono text-sm">
          <div className="text-center space-y-1 border-b border-dashed border-gold-300/20 pb-5">
            <h1 className="font-playfair text-2xl font-semibold tracking-wide uppercase">
              {billing.restaurantName || 'Restaurant'}
            </h1>
            {billing.address && <p className="text-xs text-muted-foreground">{billing.address}</p>}
            {billing.phone && <p className="text-xs text-muted-foreground">Ph: {billing.phone}</p>}
            {billing.gstin && <p className="text-xs text-muted-foreground">GSTIN: {billing.gstin}</p>}
          </div>

          <div className="space-y-1 text-xs sm:text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Bill No.</span>
              <span className="font-semibold">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Date</span>
              <span>{when}</span>
            </div>
            {table && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Table</span>
                <span>{table.name}</span>
              </div>
            )}
            {order.guestName && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Guest</span>
                <span>{order.guestName}</span>
              </div>
            )}
            {order.guestPhone && (
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">Phone</span>
                <span>{order.guestPhone}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Status</span>
              <span>
                {order.status} · {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-gold-300/20 pt-4">
            <div className="grid grid-cols-[2rem_1fr_5rem] gap-2 text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              <span>Qty</span>
              <span>Item</span>
              <span className="text-right">Amount</span>
            </div>
            {order.items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-[2rem_1fr_5rem] gap-2 py-1.5 border-b border-gold-300/5 last:border-0">
                <span>{item.quantity}</span>
                <div>
                  <div>{item.name}</div>
                  <div className="text-[10px] text-muted-foreground">@ {formatINR(item.priceAtOrder)}</div>
                </div>
                <span className="text-right">{formatINR(item.priceAtOrder * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-gold-300/20 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            {cgstRate > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">CGST ({cgstRate}%)</span>
                <span>{formatINR(cgst)}</span>
              </div>
            )}
            {sgstRate > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">SGST ({sgstRate}%)</span>
                <span>{formatINR(sgst)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-primary pt-2 border-t border-gold-300/20">
              <span>TOTAL</span>
              <span>{formatINR(grand)}</span>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2 border-t border-dashed border-gold-300/20">
            {billing.billFooter || 'Thank you for dining with us!'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
