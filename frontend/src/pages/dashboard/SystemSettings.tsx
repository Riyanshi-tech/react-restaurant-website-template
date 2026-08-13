import React, { useEffect, useState } from 'react';
import { settingsService, BillingSettings } from '../../services/posService';
import { Loader2, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

const empty: BillingSettings = {
  restaurantName: 'ForestHub',
  address: '',
  phone: '',
  gstin: '',
  gstPercent: 5,
  cgstPercent: 2.5,
  sgstPercent: 2.5,
  whatsappCountryCode: '91',
  billFooter: 'Thank you for dining with us!'
};

const SystemSettings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BillingSettings>(empty);
  const [runtime, setRuntime] = useState<{
    frontendUrl: string;
    resolvedBaseUrl: string;
    cloudinaryConfigured: boolean;
    port: string | number;
    nodeEnv: string;
  } | null>(null);

  useEffect(() => {
    settingsService
      .get()
      .then((data) => {
        setForm({
          restaurantName: data.restaurantName || empty.restaurantName,
          address: data.address || '',
          phone: data.phone || '',
          gstin: data.gstin || '',
          gstPercent: data.gstPercent ?? 5,
          cgstPercent: data.cgstPercent ?? 2.5,
          sgstPercent: data.sgstPercent ?? 2.5,
          whatsappCountryCode: data.whatsappCountryCode || '91',
          billFooter: data.billFooter || empty.billFooter
        });
        setRuntime({
          frontendUrl: data.frontendUrl,
          resolvedBaseUrl: data.resolvedBaseUrl,
          cloudinaryConfigured: data.cloudinaryConfigured,
          port: data.port,
          nodeEnv: data.nodeEnv
        });
      })
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const updated = await settingsService.update(form);
      setForm(updated);
      toast.success('Billing settings saved');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const set = (key: keyof BillingSettings, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold">System Settings</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
          Restaurant bill + GST (thermal print)
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <>
          <form
            onSubmit={save}
            className="bg-forest-900/40 border border-gold-300/10 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-primary mb-2">
              <Settings className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider font-semibold">Billing profile</span>
            </div>

            <Field label="Restaurant name" value={form.restaurantName} onChange={(v) => set('restaurantName', v)} />
            <Field label="Address" value={form.address} onChange={(v) => set('address', v)} />
            <Field label="Phone" value={form.phone} onChange={(v) => set('phone', v)} />
            <Field label="GSTIN" value={form.gstin} onChange={(v) => set('gstin', v)} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <NumField label="GST %" value={form.gstPercent} onChange={(v) => set('gstPercent', v)} />
              <NumField label="CGST %" value={form.cgstPercent} onChange={(v) => set('cgstPercent', v)} />
              <NumField label="SGST %" value={form.sgstPercent} onChange={(v) => set('sgstPercent', v)} />
            </div>

            <label className="block space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Bill footer</span>
              <textarea
                value={form.billFooter}
                onChange={(e) => set('billFooter', e.target.value)}
                className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm min-h-[72px]"
              />
            </label>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase px-5 py-3 rounded-full disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save settings
            </button>
          </form>

          {runtime && (
            <div className="bg-forest-900/40 border border-gold-300/10 rounded-2xl p-6 space-y-3 text-sm">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Runtime</p>
              <Row label="FRONTEND_URL" value={runtime.frontendUrl} />
              <Row label="QR base" value={runtime.resolvedBaseUrl} />
              <Row label="Cloudinary" value={runtime.cloudinaryConfigured ? 'Connected' : 'Not configured'} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Field = ({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <label className="block space-y-1">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
    />
  </label>
);

const NumField = ({
  label,
  value,
  onChange
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <label className="block space-y-1">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <input
      type="number"
      min={0}
      max={100}
      step={0.5}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full bg-forest-950 border border-gold-300/20 rounded-xl px-3 py-2 text-sm"
    />
  </label>
);

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-gold-300/10 pb-2">
    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    <span className="text-sm font-mono">{value}</span>
  </div>
);

export default SystemSettings;
