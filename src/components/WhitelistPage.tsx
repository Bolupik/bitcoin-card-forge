import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle2, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const WhitelistPage = () => {
  const [wallet, setWallet] = useState('');
  const [twitter, setTwitter] = useState('');
  const [followed, setFollowed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!wallet.trim()) { toast.error('Enter your Stacks wallet address'); return; }
    if (!twitter.trim()) { toast.error('Enter your Twitter/X username'); return; }
    if (!followed) { toast.error('You must follow @smokestx first'); return; }

    const cleanTwitter = twitter.replace(/^@/, '');
    const list = getWhitelist();
    
    if (list.some(e => e.walletAddress === wallet.trim())) {
      toast.error('This wallet is already whitelisted!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      list.push({
        walletAddress: wallet.trim(),
        twitterUsername: cleanTwitter,
        timestamp: new Date().toISOString(),
      });
      saveWhitelist(list);
      setSubmitted(true);
      setLoading(false);
      toast.success('You have been whitelisted!');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--cf-gold), var(--cf-gold2))' }}
            >
              <CheckCircle2 className="w-10 h-10" style={{ color: 'var(--cf-bg)' }} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--cf-text)' }}>
              You're Whitelisted!
            </h2>
            <p className="text-sm" style={{ color: 'var(--cf-muted2)' }}>
              Stay tuned for the mint. Follow @smokestx for updates.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="inline-block mb-4"
              >
                <Sparkles className="w-10 h-10" style={{ color: 'var(--cf-gold)' }} />
              </motion.div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2"
                style={{ background: 'linear-gradient(135deg, var(--cf-gold), var(--cf-gold2))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                CARDFORGE
              </h1>
              <p className="text-sm" style={{ color: 'var(--cf-muted2)' }}>
                Get whitelisted for the upcoming mint
              </p>
            </div>

            {/* Form card */}
            <div className="rounded-2xl p-6 space-y-5"
              style={{ background: 'var(--cf-surface)', border: '1px solid var(--cf-border)' }}>
              
              {/* Wallet */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--cf-muted2)' }}>
                  Stacks Wallet Address
                </label>
                <Input
                  value={wallet}
                  onChange={e => setWallet(e.target.value)}
                  placeholder="SP2... or SM..."
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Twitter */}
              <div className="space-y-2">
                <label className="text-xs font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--cf-muted2)' }}>
                  Twitter / X Username
                </label>
                <Input
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="@yourusername"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Follow check */}
              <div className="rounded-xl p-4 space-y-3"
                style={{ background: 'var(--cf-surface2)', border: '1px solid var(--cf-border)' }}>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" style={{ color: 'var(--cf-gold)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--cf-muted2)' }}>
                    Required
                  </span>
                </div>
                
                <a
                  href="https://x.com/smokestx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: 'var(--cf-gold)' }}
                >
                  Follow @smokestx on X
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setFollowed(!followed)}
                    className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                    style={{
                      borderColor: followed ? 'var(--cf-gold)' : 'var(--cf-border2)',
                      background: followed ? 'var(--cf-gold)' : 'transparent',
                    }}
                  >
                    {followed && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--cf-bg)' }} />
                      </motion.div>
                    )}
                  </div>
                  <span className="text-sm" style={{ color: 'var(--cf-text)' }}>
                    I'm following @smokestx
                  </span>
                </label>
              </div>

              {/* Submit */}
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full h-12 text-sm font-bold uppercase tracking-wider rounded-xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, var(--cf-gold), var(--cf-gold2))',
                  color: 'var(--cf-bg)',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 rounded-full"
                    style={{ borderColor: 'var(--cf-bg)', borderTopColor: 'transparent' }}
                  />
                ) : (
                  'Get Whitelisted'
                )}
              </Button>

              <p className="text-center text-[11px]" style={{ color: 'var(--cf-muted)' }}>
                {getWhitelist().length} wallets whitelisted so far
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhitelistPage;
