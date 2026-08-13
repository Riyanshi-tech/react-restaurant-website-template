import React, { useState, useEffect } from 'react';
import { tableService, TableInput } from '../../services/tableService';
import { Table, TableStatus } from '../../types';
import { 
  QrCode, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Eye, 
  X,
  MapPin,
  Users,
  Download,
  Printer,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { ModalPortal } from '@/components/ModalPortal';

const TableManagement: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Dialog Controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Form states
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [formData, setFormData] = useState<TableInput>({
    tableNumber: 1,
    name: '',
    capacity: 4,
    location: 'Main Hall',
    status: 'AVAILABLE',
    isActive: true
  });

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await tableService.getTables();
      setTables(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch tables');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tableService.createTable(formData);
      toast.success('Table created successfully');
      setIsCreateOpen(false);
      resetForm();
      fetchTables();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create table');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTable || !selectedTable._id) return;

    try {
      await tableService.updateTable(selectedTable._id, formData);
      toast.success('Table updated successfully');
      setIsEditOpen(false);
      resetForm();
      fetchTables();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update table');
    }
  };

  const handleDeleteTable = async (table: Table) => {
    if (!table._id) return;
    if (table.status === 'OCCUPIED') {
      toast.error('Cannot delete a table that is currently occupied.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${table.name}? This action is irreversible.`)) {
      return;
    }

    try {
      await tableService.deleteTable(table._id);
      toast.success('Table deleted successfully');
      fetchTables();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete table');
    }
  };

  const handleToggleStatus = async (table: Table) => {
    if (!table._id) return;
    try {
      const nextActive = !table.isActive;
      await tableService.updateTable(table._id, {
        isActive: nextActive,
        status: nextActive ? 'AVAILABLE' : 'INACTIVE'
      });
      toast.success(`Table ${table.name} ${nextActive ? 'activated' : 'deactivated'} successfully`);
      fetchTables();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to toggle table status');
    }
  };

  const handleRegenerateQr = async (table: Table) => {
    if (!table._id) return;
    try {
      const updated = await tableService.regenerateTableQr(table._id);
      toast.success(`QR code regenerated for ${table.name}`);
      if (selectedTable && selectedTable._id === table._id) {
        setSelectedTable(updated);
      }
      fetchTables();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to regenerate QR code');
    }
  };

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/orders/${slug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    toast.success('Ordering link copied to clipboard');
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handlePrintQr = (table: Table) => {
    if (!table.qrCodeUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Blocker prevented printing. Please allow popups.');
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR - ${table.name}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              font-family: 'Playfair Display', serif, sans-serif;
              background-color: #ffffff;
              color: #0c1a11;
              text-align: center;
            }
            .container {
              border: 3px double #d4af37;
              padding: 40px;
              border-radius: 20px;
              max-width: 400px;
            }
            img {
              width: 250px;
              height: 250px;
              margin-bottom: 20px;
            }
            h1 {
              font-size: 28px;
              margin: 0 0 10px 0;
              letter-spacing: 2px;
            }
            h2 {
              font-size: 16px;
              color: #666;
              margin: 0 0 20px 0;
              font-weight: normal;
            }
            .footer-text {
              font-size: 12px;
              color: #a8a8a8;
              margin-top: 15px;
              text-transform: uppercase;
              letter-spacing: 1px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${table.qrCodeUrl}" alt="${table.name} QR" />
            <h1>${table.name}</h1>
            <h2>Location: ${table.location} | Capacity: ${table.capacity} seats</h2>
            <div class="footer-text">Scan to Place Order at ForestHub</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const resetForm = () => {
    setFormData({
      tableNumber: tables.length > 0 ? Math.max(...tables.map(t => t.tableNumber)) + 1 : 1,
      name: '',
      capacity: 4,
      location: 'Main Hall',
      status: 'AVAILABLE',
      isActive: true
    });
    setSelectedTable(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditDialog = (table: Table) => {
    setSelectedTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      name: table.name,
      capacity: table.capacity,
      location: table.location,
      status: table.status,
      isActive: table.isActive
    });
    setIsEditOpen(true);
  };

  const openViewDialog = (table: Table) => {
    setSelectedTable(table);
    setIsViewOpen(true);
  };

  const getStatusBadge = (status: TableStatus) => {
    switch (status) {
      case 'AVAILABLE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Available</span>;
      case 'OCCUPIED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400">Occupied</span>;
      case 'RESERVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/20 text-purple-400">Reserved</span>;
      case 'INACTIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400">Inactive</span>;
    }
  };

  const totalTables = tables.length;
  const availableTables = tables.filter(t => t.status === 'AVAILABLE' && t.isActive).length;
  const occupiedTables = tables.filter(t => t.status === 'OCCUPIED' && t.isActive).length;
  const inactiveTables = tables.filter(t => !t.isActive).length;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold">Table Management</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
            Configure restaurant tables, generate QR codes, and monitor active ordering sessions.
          </p>
        </div>
        <button
          onClick={openCreateDialog}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black hover:bg-primary/90 font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          Create Table
        </button>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Total Tables</span>
          <h3 className="text-2xl font-bold">{totalTables}</h3>
        </div>
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Available Tables</span>
          <h3 className="text-2xl font-bold text-emerald-400">{availableTables}</h3>
        </div>
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Occupied Tables</span>
          <h3 className="text-2xl font-bold text-amber-400">{occupiedTables}</h3>
        </div>
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Offline / Inactive</span>
          <h3 className="text-2xl font-bold text-rose-400">{inactiveTables}</h3>
        </div>
      </div>

      {/* Main panel container */}
      <div className="bg-forest-900/20 border border-gold-300/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : tables.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No tables configured in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gold-300/10 bg-forest-950/40 text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="p-4">Table</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Slug ID</th>
                  <th className="p-4 text-center">QR Code</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-300/5">
                {tables.map((t) => (
                  <tr key={t._id} className="hover:bg-forest-900/10 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{t.name}</td>
                    <td className="p-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-primary/70" />
                        {t.location}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-primary/70" />
                        {t.capacity} Seats
                      </span>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(t.status)}
                    </td>
                    <td className="p-4 font-mono text-[10px] text-muted-foreground select-all">
                      {t.slug}
                    </td>
                    <td className="p-4 text-center">
                      {t.qrCodeUrl ? (
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => handlePrintQr(t)}
                            title="Print QR Table Sign"
                            className="p-1 hover:text-primary text-muted-foreground transition-colors"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                          <a
                            href={t.qrCodeUrl}
                            download={`${t.name}_QR.png`}
                            title="Download QR Image"
                            className="p-1 hover:text-primary text-muted-foreground transition-colors"
                          >
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[10px] text-rose-400">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openViewDialog(t)}
                          title="View Details"
                          className="p-1.5 bg-forest-900/60 hover:bg-primary/20 text-primary border border-gold-300/10 rounded-lg transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openEditDialog(t)}
                          title="Edit Table"
                          className="p-1.5 bg-forest-900/60 hover:bg-blue-500/20 text-blue-400 border border-gold-300/10 rounded-lg transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRegenerateQr(t)}
                          title="Regenerate QR & Slug"
                          className="p-1.5 bg-forest-900/60 hover:bg-amber-500/20 text-amber-400 border border-gold-300/10 rounded-lg transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTable(t)}
                          disabled={t.status === 'OCCUPIED'}
                          title={t.status === 'OCCUPIED' ? "Cannot delete an occupied table" : "Delete Table"}
                          className="p-1.5 bg-forest-900/60 hover:bg-rose-500/25 text-rose-400 border border-gold-300/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE DIALOG */}
      {isCreateOpen && (
        <ModalPortal>
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-forest-950 border border-gold-300/15 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h2 className="font-playfair text-lg font-bold">Configure New Table</h2>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Table Number</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.tableNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: parseInt(e.target.value, 10) }))}
                    className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Table Capacity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value, 10) }))}
                    className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Table 06"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Location Section</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Main Hall">Main Hall</option>
                  <option value="Terrace">Terrace</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Garden Canopy">Garden Canopy</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gold-300/10 text-xs font-semibold uppercase tracking-wider hover:bg-forest-900/40 text-muted-foreground transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  Create Table
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* EDIT DIALOG */}
      {isEditOpen && selectedTable && (
        <ModalPortal>
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-forest-950 border border-gold-300/15 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Edit className="h-5 w-5 text-primary" />
              <h2 className="font-playfair text-lg font-bold">Edit Table Config</h2>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Table Number</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.tableNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, tableNumber: parseInt(e.target.value, 10) }))}
                    className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Table Capacity</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value, 10) }))}
                    className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Location Section</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="Main Hall">Main Hall</option>
                  <option value="Terrace">Terrace</option>
                  <option value="VIP Lounge">VIP Lounge</option>
                  <option value="Garden Canopy">Garden Canopy</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Occupancy Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TableStatus }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="OCCUPIED">OCCUPIED</option>
                  <option value="RESERVED">RESERVED</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded bg-forest-900 border-gold-300/10 text-primary focus:ring-0"
                />
                <label htmlFor="isActive" className="text-xs text-muted-foreground cursor-pointer select-none">
                  Table is active and online for ordering
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gold-300/10 text-xs font-semibold uppercase tracking-wider hover:bg-forest-900/40 text-muted-foreground transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* VIEW DETAILS DIALOG */}
      {isViewOpen && selectedTable && (
        <ModalPortal>
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-forest-950 border border-gold-300/15 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsViewOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2.5 mb-6 border-b border-gold-300/10 pb-4">
              <QrCode className="h-5 w-5 text-primary" />
              <div>
                <h2 className="font-playfair text-lg font-bold">{selectedTable.name} Details</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                  Real-time status overview and print layouts
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Metadata */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Table Area / Location</span>
                  <p className="text-foreground font-semibold flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" />
                    {selectedTable.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Seat Capacity</span>
                    <p className="text-foreground font-semibold flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      {selectedTable.capacity} Seats
                    </p>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Status Badge</span>
                    <p className="mt-1">{getStatusBadge(selectedTable.status)}</p>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Unique Slug Code</span>
                  <p className="font-mono text-xs text-primary font-semibold select-all bg-forest-900/30 p-2 rounded-lg border border-gold-300/5">
                    {selectedTable.slug}
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Customer Ordering URL</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/orders/${selectedTable.slug}`}
                      className="flex-grow bg-forest-900/40 border border-gold-300/10 rounded-xl px-3 py-1.5 text-[11px] font-mono text-muted-foreground select-all focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyLink(selectedTable.slug)}
                      className="p-2 bg-gold-300/10 hover:bg-gold-300/20 border border-gold-300/20 rounded-xl text-primary transition-all duration-200 shrink-0"
                    >
                      {copiedSlug === selectedTable.slug ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Session Active Order info */}
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-0.5">Active Session Order</span>
                  {selectedTable.status === 'OCCUPIED' ? (
                    <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="text-[11px] text-amber-400">
                        <p className="font-semibold">Table has an active unpaid ticket.</p>
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground">Order ID: {selectedTable.activeOrder || 'Awaiting Sync'}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-xs">No active order session.</p>
                  )}
                </div>
              </div>

              {/* Right Column: QR Code Preview */}
              <div className="flex flex-col items-center justify-center bg-forest-900/10 border border-gold-300/5 rounded-2xl p-4">
                {selectedTable.qrCodeUrl ? (
                  <div className="space-y-4 w-full flex flex-col items-center">
                    <div className="bg-white p-3 rounded-xl shadow-inner border border-gold-300/15">
                      <img
                        src={selectedTable.qrCodeUrl}
                        alt="QR Code"
                        className="w-44 h-44 select-none"
                      />
                    </div>
                    
                    <div className="flex gap-2 w-full max-w-[200px]">
                      <button
                        onClick={() => handlePrintQr(selectedTable)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-primary text-black font-semibold rounded-xl text-[10px] uppercase tracking-wider hover:bg-primary/95 transition-all duration-200"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        Print Sign
                      </button>
                      <a
                        href={selectedTable.qrCodeUrl}
                        download={`${selectedTable.name}_QR.png`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gold-300/20 text-muted-foreground hover:text-foreground font-semibold rounded-xl text-[10px] uppercase tracking-wider hover:bg-forest-900/40 transition-all duration-200"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-xs">QR Code unavailable</span>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gold-300/10 mt-6 flex justify-between items-center text-[10px] text-muted-foreground">
              <button
                onClick={() => handleRegenerateQr(selectedTable)}
                className="hover:text-primary flex items-center gap-1 font-semibold uppercase tracking-wider"
              >
                <RefreshCw className="h-3 w-3" />
                Regenerate QR Code
              </button>
              <span>Updated At: {selectedTable.updatedAt ? new Date(selectedTable.updatedAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
};

export default TableManagement;
