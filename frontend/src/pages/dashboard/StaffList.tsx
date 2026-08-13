import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { User } from '../../types';
import { Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

const StaffList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getUsers()
      .then(setUsers)
      .catch((err) => toast.error(err.response?.data?.message || 'Failed to load staff'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl md:text-3xl font-bold">Staff List</h1>
        <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
          Read-only roster
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : users.length === 0 ? (
        <div className="border border-gold-300/10 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
          No staff found.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gold-300/10 rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-forest-900/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Email</th>
                <th className="text-left p-3">Role</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id || u.id} className="border-t border-gold-300/10">
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3 text-muted-foreground">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.isActive ? 'Active' : 'Inactive'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffList;
