import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { 
  FileText, 
  RefreshCw, 
  Search, 
  Clock, 
  User, 
  ShieldAlert, 
  Terminal,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface AuditLogEntry {
  _id: string;
  actor: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  targetUser?: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  targetRole?: string;
  details: string;
  timestamp: string;
}

const OperationalLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/audit-logs');
      if (response.data && response.data.data && response.data.data.logs) {
        setLogs(response.data.data.logs);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch operational logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Filter logs based on search query and action dropdown
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      (log.targetUser && log.targetUser.name.toLowerCase().includes(search.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'ACCESS_AS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400">
            Access As Simulation
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
            {action}
          </span>
        );
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-rose-400 font-bold';
      case 'MANAGER': return 'text-blue-400 font-bold';
      case 'CASHIER': return 'text-emerald-400 font-bold';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-2xl md:text-3xl font-bold">Operational Logs</h1>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mt-1 text-primary">
            Audit trail of system administrative actions and role simulations.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gold-300/10 hover:bg-forest-900/40 rounded-xl text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-200"
        >
          <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Audit
        </button>
      </div>

      {/* Filters panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-forest-900/20 border border-gold-300/10 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search details, actors, targets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-forest-950 border border-gold-300/10 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground placeholder-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary shrink-0" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-forest-950 border border-gold-300/10 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
          >
            <option value="ALL">All Event Types</option>
            <option value="ACCESS_AS">ACCESS_AS (Simulations)</option>
          </select>
        </div>
        
        <div className="flex items-center justify-end text-[10px] text-muted-foreground font-mono">
          Showing {filteredLogs.length} audit trail entries
        </div>
      </div>

      {/* Main panel table */}
      <div className="bg-forest-900/20 border border-gold-300/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <RefreshCw className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-2">
            <Terminal className="h-8 w-8 text-gold-300/30" />
            <span>No security logs recorded matching the criteria.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gold-300/10 bg-forest-950/40 text-muted-foreground font-semibold uppercase tracking-wider">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Action Event</th>
                  <th className="p-4">Target Context</th>
                  <th className="p-4">Log Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-300/5">
                {filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-forest-900/10 transition-colors">
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <Clock className="h-3.5 w-3.5 text-primary/65" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold">{log.actor?.name || 'Unknown'}</div>
                      <div className="text-[10px] text-muted-foreground">
                        Role: <span className={getRoleColor(log.actor?.role)}>{log.actor?.role}</span>
                      </div>
                    </td>
                    <td className="p-4">{getActionBadge(log.action)}</td>
                    <td className="p-4">
                      {log.targetUser ? (
                        <>
                          <div className="font-semibold text-foreground">{log.targetUser.name}</div>
                          <div className="text-[10px] text-muted-foreground">
                            Role: <span className={getRoleColor(log.targetRole || '')}>{log.targetRole}</span>
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground/40">-</span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-[10px] text-gold-300/80 leading-relaxed min-w-[280px]">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationalLogs;
