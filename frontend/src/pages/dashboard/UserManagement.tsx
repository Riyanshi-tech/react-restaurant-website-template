import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService, UserInput } from '../../services/userService';
import { User, UserRole } from '../../types';
import { 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  RefreshCw, 
  Eye, 
  UserCheck,
  X,
  Settings,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: [
    'menu.read', 'menu.write',
    'booking.read', 'booking.write',
    'staff.read', 'staff.write',
    'logs.read',
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read',
    'users.read', 'users.write',
    'settings.read', 'settings.write'
  ],
  MANAGER: [
    'menu.read', 'menu.write',
    'booking.read', 'booking.write',
    'staff.read',
    'logs.read'
  ],
  CASHIER: [
    'pos.read', 'pos.write',
    'order.read', 'order.write',
    'sales.read'
  ]
};

const ALL_PERMISSIONS = [
  'menu.read', 'menu.write',
  'booking.read', 'booking.write',
  'staff.read', 'staff.write',
  'logs.read',
  'pos.read', 'pos.write',
  'order.read', 'order.write',
  'sales.read',
  'users.read', 'users.write',
  'settings.read', 'settings.write'
];

const UserManagement: React.FC = () => {
  const { user: currentUser, setViewingAs } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Dialog controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  // Form states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    email: '',
    password: '',
    role: 'CASHIER',
    isActive: true,
    permissions: []
  });
  
  const [newPassword, setNewPassword] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      toast.success('User created successfully');
      setIsCreateOpen(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedUser._id) return;
    
    try {
      await userService.updateUser(selectedUser._id, {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive
      });
      toast.success('User updated successfully');
      setIsEditOpen(false);
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedUser._id) return;

    try {
      await userService.updateUser(selectedUser._id, {
        password: newPassword
      });
      toast.success('Password reset successfully');
      setIsPasswordOpen(false);
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
  };

  const handlePermissionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedUser._id) return;

    try {
      await userService.updateUser(selectedUser._id, {
        permissions: selectedPermissions
      });
      toast.success('Permissions updated successfully');
      setIsPermissionsOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update permissions');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      return;
    }
    try {
      await userService.deleteUser(id);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (!user._id) return;
    
    // Safeguard for primary administrator
    if (user.email === 'admin@restaurant.com') {
      toast.error('The primary System Administrator account cannot be deactivated.');
      return;
    }

    try {
      await userService.updateUser(user._id, {
        isActive: !user.isActive
      });
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleAccessAs = async (user: User) => {
    if (!user._id) return;

    // Direct check for self simulation
    if (currentUser?.email === user.email) {
      toast.error('You are already logged in as this administrator.');
      return;
    }

    try {
      // Log ACCESS_AS transition on the backend
      await userService.logAccessAs(user._id);
      
      // Set simulation context on frontend AuthContext
      setViewingAs(user.role);
      
      toast.success(`Simulating system access as ${user.role} (${user.name})`);
      
      // Redirect to the simulated dashboard
      navigate(`/dashboard/${user.role.toLowerCase()}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate simulated access');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'CASHIER',
      isActive: true,
      permissions: []
    });
    setSelectedUser(null);
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      permissions: user.permissions || []
    });
    setIsEditOpen(true);
  };

  const openPasswordDialog = (user: User) => {
    setSelectedUser(user);
    setNewPassword('');
    setIsPasswordOpen(true);
  };

  const openPermissionsDialog = (user: User) => {
    setSelectedUser(user);
    setSelectedPermissions(user.permissions || []);
    setIsPermissionsOpen(true);
  };

  const togglePermission = (perm: string) => {
    setSelectedPermissions(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400">Admin</span>;
      case 'MANAGER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400">Manager</span>;
      case 'CASHIER':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">Cashier</span>;
    }
  };

  const activeCount = users.filter(u => u.isActive).length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const managerCount = users.filter(u => u.role === 'MANAGER').length;
  const cashierCount = users.filter(u => u.role === 'CASHIER').length;

  return (
    <div className="space-y-6" data-aos="fade-up">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
            Administer system roles, access clearances, and deactivations.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsCreateOpen(true); }}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-black hover:bg-primary/90 font-semibold rounded-xl text-xs uppercase tracking-wider transition-colors duration-200"
        >
          <UserPlus className="h-4 w-4" />
          Create User
        </button>
      </div>

      {/* Metrics board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Total Staff</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold">{users.length}</h3>
            <span className="text-xs text-primary font-semibold">({activeCount} Active)</span>
          </div>
        </div>
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">System Administrators</span>
          <h3 className="text-2xl font-bold">{adminCount}</h3>
        </div>
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">General Managers</span>
          <h3 className="text-2xl font-bold">{managerCount}</h3>
        </div>
        <div className="bg-forest-900/40 p-5 rounded-2xl border border-gold-300/10 backdrop-blur-sm">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-2">Billing Cashiers</span>
          <h3 className="text-2xl font-bold">{cashierCount}</h3>
        </div>
      </div>

      {/* Main panel container */}
      <div className="bg-forest-900/20 border border-gold-300/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">
            No users registered in the database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gold-300/10 bg-forest-950/40 text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Permissions</th>
                  <th className="p-4 text-center">Simulation</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-300/5">
                {users.map((u) => {
                  const isCurrentUser = currentUser?.email === u.email;
                  const isPrimaryAdmin = u.email === 'admin@restaurant.com';

                  return (
                    <tr key={u._id} className="hover:bg-forest-900/10 transition-colors">
                      <td className="p-4 font-medium text-foreground">{u.name}</td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">{getRoleBadge(u.role)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={isPrimaryAdmin}
                          title={isPrimaryAdmin ? "Primary admin cannot be deactivated" : "Toggle status"}
                          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            u.isActive 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                          } ${isPrimaryAdmin ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:bg-emerald-500/20'}`}
                        >
                          {u.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {u.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>
                      <td className="p-4 max-w-[200px] truncate">
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {u.permissions?.join(', ') || 'None'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {u.role === 'ADMIN' ? (
                          <span className="text-[10px] text-muted-foreground/40 font-medium">N/A (Admin)</span>
                        ) : (
                          <button
                            onClick={() => handleAccessAs(u)}
                            disabled={!u.isActive}
                            title={!u.isActive ? "User is deactivated" : `Access system as ${u.name}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-gold-300/10 hover:bg-gold-300/20 border border-gold-300/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-primary text-[10px] font-semibold uppercase tracking-wider transition-all duration-200"
                          >
                            <Eye className="h-3 w-3" />
                            Access Dashboard
                          </button>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPermissionsDialog(u)}
                            title="Edit Permissions"
                            className="p-1.5 bg-forest-900/60 hover:bg-primary/20 text-primary border border-gold-300/10 rounded-lg transition-colors"
                          >
                            <Settings className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openPasswordDialog(u)}
                            title="Reset Password"
                            className="p-1.5 bg-forest-900/60 hover:bg-amber-500/20 text-amber-400 border border-gold-300/10 rounded-lg transition-colors"
                          >
                            <Lock className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => openEditDialog(u)}
                            disabled={isPrimaryAdmin}
                            title={isPrimaryAdmin ? "Primary admin details are locked" : "Edit Profile"}
                            className="p-1.5 bg-forest-900/60 hover:bg-blue-500/20 text-blue-400 border border-gold-300/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => u._id && handleDeleteUser(u._id)}
                            disabled={isCurrentUser || isPrimaryAdmin}
                            title={isCurrentUser ? "You cannot delete yourself" : isPrimaryAdmin ? "Primary admin cannot be deleted" : "Delete Account"}
                            className="p-1.5 bg-forest-900/60 hover:bg-rose-500/25 text-rose-400 border border-gold-300/10 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-forest-950 border border-gold-300/15 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="h-5 w-5 text-primary" />
              <h2 className="font-playfair text-lg font-bold">Register New Account</h2>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Security Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Clearance Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="CASHIER">CASHIER</option>
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
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-forest-950 border border-gold-300/15 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-4">
              <Edit className="h-5 w-5 text-primary" />
              <h2 className="font-playfair text-lg font-bold">Edit Account Details</h2>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">Clearance Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                >
                  <option value="MANAGER">MANAGER</option>
                  <option value="CASHIER">CASHIER</option>
                </select>
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
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {isPasswordOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-forest-950 border border-gold-300/15 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsPasswordOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-5 w-5 text-amber-400" />
              <h2 className="font-playfair text-lg font-bold">Reset Password</h2>
            </div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-4">
              Updating credentials for: <span className="text-foreground font-semibold font-mono">{selectedUser.name}</span>
            </p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-muted-foreground mb-1">New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-forest-900/40 border border-gold-300/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gold-300/10 text-xs font-semibold uppercase tracking-wider hover:bg-forest-900/40 text-muted-foreground transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-500/90 text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PERMISSIONS MODAL */}
      {isPermissionsOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-forest-950 border border-gold-300/15 rounded-3xl p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsPermissionsOpen(false)}
              className="absolute top-4 right-4 p-1.5 bg-forest-900/80 hover:bg-forest-800 border border-gold-300/10 rounded-full transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2 mb-2">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="font-playfair text-lg font-bold">Customize User Permissions</h2>
            </div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-4">
              Active clearance for: <span className="text-foreground font-semibold font-mono">{selectedUser.name} ({selectedUser.role})</span>
            </p>

            <div className="bg-amber-500/5 border border-amber-500/10 px-4 py-3 rounded-xl flex gap-2.5 items-start mb-4 text-xs text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Caution: Assigning ad-hoc permissions overrides the role default lists. Admin users automatically bypass all permission blocks.
              </p>
            </div>
            
            <form onSubmit={handlePermissionsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto p-1.5 bg-forest-900/10 rounded-xl border border-gold-300/5">
                {ALL_PERMISSIONS.map(perm => {
                  const isChecked = selectedPermissions.includes(perm);
                  return (
                    <label 
                      key={perm}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs font-mono select-none cursor-pointer transition-all duration-150 ${
                        isChecked 
                          ? 'bg-primary/10 border-primary/30 text-primary font-semibold' 
                          : 'bg-forest-900/20 border-gold-300/5 hover:border-gold-300/15 text-muted-foreground'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePermission(perm)}
                        className="hidden"
                      />
                      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[8px] ${
                        isChecked ? 'bg-primary border-primary text-black' : 'border-gold-300/20'
                      }`}>
                        {isChecked && '✓'}
                      </span>
                      {perm}
                    </label>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-muted-foreground">
                <button
                  type="button"
                  onClick={() => setSelectedPermissions(DEFAULT_PERMISSIONS[selectedUser.role] || [])}
                  className="hover:text-primary underline font-medium"
                >
                  Reset to Role Defaults
                </button>
                <span>{selectedPermissions.length} selected permissions</span>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPermissionsOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gold-300/10 text-xs font-semibold uppercase tracking-wider hover:bg-forest-900/40 text-muted-foreground transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
