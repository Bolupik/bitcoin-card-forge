import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, Users, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

interface WhitelistEntry {
  walletAddress: string;
  twitterUsername: string;
  timestamp: string;
}

const getWhitelist = (): WhitelistEntry[] => {
  try { return JSON.parse(localStorage.getItem('cf_whitelist_v1') || '[]'); }
  catch { return []; }
};

const saveWhitelist = (list: WhitelistEntry[]) =>
  localStorage.setItem('cf_whitelist_v1', JSON.stringify(list));

const WhitelistAdmin = () => {
  const [entries, setEntries] = useState<WhitelistEntry[]>(getWhitelist);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(e =>
      e.walletAddress.toLowerCase().includes(q) ||
      e.twitterUsername.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const exportCSV = () => {
    if (entries.length === 0) { toast.error('No entries to export'); return; }
    const header = 'Wallet Address,Twitter Username,Timestamp';
    const rows = entries.map(e => `${e.walletAddress},@${e.twitterUsername},${e.timestamp}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cardforge-whitelist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${entries.length} entries`);
  };

  const removeEntry = (wallet: string) => {
    const updated = entries.filter(e => e.walletAddress !== wallet);
    saveWhitelist(updated);
    setEntries(updated);
    toast.success('Entry removed');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-6 max-w-5xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--cf-gold), var(--cf-gold2))' }}>
            <Users className="w-5 h-5" style={{ color: 'var(--cf-bg)' }} />
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--cf-text)' }}>Whitelist</h2>
            <p className="text-xs" style={{ color: 'var(--cf-muted2)' }}>
              {entries.length} wallet{entries.length !== 1 ? 's' : ''} registered
            </p>
          </div>
        </div>
        <Button onClick={exportCSV} className="h-9 text-xs font-semibold gap-2 rounded-lg"
          style={{ background: 'linear-gradient(135deg, var(--cf-gold), var(--cf-gold2))', color: 'var(--cf-bg)' }}>
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--cf-muted)' }} />
        <Input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by wallet or Twitter..."
          className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground" />
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--cf-border)', background: 'var(--cf-surface)' }}>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: 'var(--cf-muted2)' }}>
            {entries.length === 0 ? 'No whitelist entries yet' : 'No results found'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow style={{ borderColor: 'var(--cf-border)' }}>
                <TableHead className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--cf-muted2)' }}>#</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--cf-muted2)' }}>Wallet</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--cf-muted2)' }}>Twitter</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider hidden sm:table-cell" style={{ color: 'var(--cf-muted2)' }}>Date</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((entry, i) => (
                <motion.tr key={entry.walletAddress}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b transition-colors hover:bg-muted/50"
                  style={{ borderColor: 'var(--cf-border)' }}>
                  <TableCell className="text-xs font-mono" style={{ color: 'var(--cf-muted)' }}>{i + 1}</TableCell>
                  <TableCell className="font-mono text-xs max-w-[120px] truncate" style={{ color: 'var(--cf-text)' }}>
                    {entry.walletAddress}
                  </TableCell>
                  <TableCell>
                    <a href={`https://x.com/${entry.twitterUsername}`} target="_blank" rel="noopener noreferrer"
                      className="text-xs font-medium hover:underline" style={{ color: 'var(--cf-gold)' }}>
                      @{entry.twitterUsername}
                    </a>
                  </TableCell>
                  <TableCell className="text-xs hidden sm:table-cell" style={{ color: 'var(--cf-muted2)' }}>
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button onClick={() => removeEntry(entry.walletAddress)}
                      className="p-1.5 rounded-md transition-colors hover:bg-red-500/10">
                      <Trash2 className="w-3.5 h-3.5 text-red-400/60 hover:text-red-400" />
                    </button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
};

export default WhitelistAdmin;
