import React, { useEffect, useMemo, useState } from 'react';
import { menuService, MenuInput } from '../../services/posService';
import { MenuItem } from '../../types';
import { ChefHat, Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { formatINR } from '@/lib/utils';
import { ModalPortal } from '@/components/ModalPortal';

const CATEGORIES: MenuItem['category'][] = ['breakfast', 'lunch', 'dinner', 'desserts', 'drinks'];

const emptyForm: MenuInput = {
  name: '',
  price: 0,
  category: 'lunch',
  description: '',
  tag: '',
  image: ''
};

const MenuManagement: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setItems(await menuService.getItems());
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.category === filter)),
    [items, filter]
  );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      price: item.price,
      category: item.category,
      description: item.description,
      tag: item.tag || '',
      image: item.image || ''
    });
    setOpen(true);
  };

  const onUpload = async (file?: File | null) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await menuService.uploadImage(file);
      setForm((f) => ({ ...f, image: url }));
      toast.success('Image uploaded');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...form, tag: form.tag || undefined };
      if (editing) {
        await menuService.update(editing._id || editing.id!, payload);
        toast.success('Item updated');
      } else {
        await menuService.create(payload);
        toast.success('Item created');
      }
      setOpen(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try {
      await menuService.remove(item._id || item.id!);
      toast.success('Deleted');
      fetchItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold">Menu Inventory</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
            Cafe catalog + Cloudinary images
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase px-4 py-3 rounded-full"
        >
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider border ${filter === 'all' ? 'bg-primary/20 border-primary text-primary' : 'border-gold-300/20 text-muted-foreground'}`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider border ${filter === c ? 'bg-primary/20 border-primary text-primary' : 'border-gold-300/20 text-muted-foreground'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading menu…
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-forest-900/40 border border-gold-300/10 rounded-2xl p-10 text-center text-muted-foreground text-sm">
          <ChefHat className="h-8 w-8 mx-auto mb-3 text-primary" />
          No menu items yet. Add your first dish.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((item) => (
            <div key={item._id || item.id} className="bg-forest-900/40 border border-gold-300/10 rounded-2xl overflow-hidden">
              <div className="h-40 bg-forest-950/60">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between gap-2">
                  <h3 className="font-playfair font-semibold">{item.name}</h3>
                  <span className="text-primary font-semibold text-sm">{formatINR(item.price)}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-gold-300/80">{item.category}{item.tag ? ` · ${item.tag}` : ''}</span>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-2 rounded-lg border border-gold-300/20 hover:bg-forest-800">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => onDelete(item)} className="p-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <ModalPortal>
        <div className="fixed inset-0 z-[200] bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={onSave} className="w-full max-w-lg bg-forest-900 border border-gold-300/20 rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center">
              <h2 className="font-playfair text-xl font-bold">{editing ? 'Edit Item' : 'New Item'}</h2>
              <button type="button" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
            </div>

            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                type="number"
                min={0}
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as MenuItem['category'] })}
                className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <textarea
              required
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm min-h-[80px]"
            />
            <input
              placeholder="Tag (optional)"
              value={form.tag}
              onChange={(e) => setForm({ ...form, tag: e.target.value })}
              className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
            />

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Image</label>
              {form.image && <img src={form.image} alt="" className="h-24 w-full object-cover rounded-xl" />}
              <label className="inline-flex items-center gap-2 cursor-pointer text-xs border border-gold-300/20 rounded-full px-4 py-2">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? 'Uploading…' : 'Upload to Cloudinary'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onUpload(e.target.files?.[0])} />
              </label>
            </div>

            <button
              disabled={saving || uploading}
              className="w-full bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase py-3 rounded-full disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Item'}
            </button>
          </form>
        </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default MenuManagement;
