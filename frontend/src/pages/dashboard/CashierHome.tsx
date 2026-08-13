import React, { useEffect, useMemo, useState } from 'react';
import { menuService, orderService } from '../../services/posService';
import { tableService } from '../../services/tableService';
import { MenuItem, Table } from '../../types';
import { Loader2, Minus, Plus, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils';

const CashierHome: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [tableId, setTableId] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    Promise.all([tableService.getTables(), menuService.getItems()])
      .then(([t, m]) => {
        setTables(t.filter((x) => x.isActive));
        setMenu(m);
        if (t[0]) setTableId(t[0]._id || t[0].id || '');
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load POS data'))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(
    () => (category === 'all' ? menu : menu.filter((i) => i.category === category)),
    [menu, category]
  );

  const cartLines = useMemo(() => {
    return Object.entries(cart)
      .filter(([, qty]) => qty > 0)
      .map(([id, qty]) => {
        const item = menu.find((m) => (m._id || m.id) === id)!;
        return { item, qty, line: item.price * qty };
      });
  }, [cart, menu]);

  const total = cartLines.reduce((s, l) => s + l.line, 0);

  const bump = (id: string, delta: number) => {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  };

  const placeOrder = async () => {
    if (!tableId) return toast.error('Pick a table');
    if (cartLines.length === 0) return toast.error('Cart empty');
    try {
      setSubmitting(true);
      await orderService.create(
        tableId,
        cartLines.map((l) => ({ menuItemId: l.item._id || l.item.id!, quantity: l.qty }))
      );
      toast.success('Order sent');
      setCart({});
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading POS…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold">POS / Billing</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
          Walk-up order for a table
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Table</label>
            <select
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
            >
              {tables.length === 0 && <option value="">No tables — create in Table Management</option>}
              {tables.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>
                  {t.name} ({t.status})
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'breakfast', 'lunch', 'dinner', 'desserts', 'drinks'].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider border ${category === c ? 'bg-primary/20 border-primary text-primary' : 'border-gold-300/20 text-muted-foreground'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="text-sm text-muted-foreground border border-gold-300/10 rounded-2xl p-8 text-center">
              No menu items. Add some in Menu Inventory.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {visible.map((item) => {
                const id = item._id || item.id!;
                const qty = cart[id] || 0;
                return (
                  <div key={id} className="bg-forest-900/40 border border-gold-300/10 rounded-2xl p-3 flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-forest-950 shrink-0">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.name}</div>
                      <div className="text-primary text-xs">{formatINR(item.price)}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => bump(id, -1)} className="p-1 border border-gold-300/20 rounded-lg"><Minus className="h-3 w-3" /></button>
                        <span className="text-xs w-4 text-center">{qty}</span>
                        <button onClick={() => bump(id, 1)} className="p-1 border border-gold-300/20 rounded-lg"><Plus className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-forest-900/40 border border-gold-300/10 rounded-2xl p-5 h-fit sticky top-4">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <h2 className="font-playfair font-bold">Ticket</h2>
          </div>
          {cartLines.length === 0 ? (
            <p className="text-xs text-muted-foreground">Cart empty</p>
          ) : (
            <ul className="space-y-2 mb-4">
              {cartLines.map((l) => (
                <li key={l.item._id || l.item.id} className="flex justify-between text-xs gap-2">
                  <span>{l.qty}× {l.item.name}</span>
                  <span>{formatINR(l.line)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between font-semibold mb-4">
            <span>Total</span>
            <span className="text-primary">{formatINR(total)}</span>
          </div>
          <button
            disabled={submitting || !tableId || cartLines.length === 0}
            onClick={placeOrder}
            className="w-full bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase py-3 rounded-full disabled:opacity-50"
          >
            {submitting ? 'Sending…' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashierHome;
