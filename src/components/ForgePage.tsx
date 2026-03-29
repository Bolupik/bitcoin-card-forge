import { useState, useRef, useEffect } from 'react';
import { NFTCard, Trade, Rarity, generateStats, CardStats, ELEMENTS, getCards, saveCards, getTrades } from '@/lib/cardforge';
import NFTCardComponent from './NFTCard';

interface ForgePageProps {
  cards: NFTCard[];
  trades: Trade[];
  onDataChange: () => void;
}

const RARITY_OPTIONS: { key: Rarity; icon: string; label: string }[] = [
  { key: 'common', icon: '◆', label: 'Common' },
  { key: 'rare', icon: '💎', label: 'Rare' },
  { key: 'epic', icon: '🔮', label: 'Epic' },
  { key: 'legendary', icon: '⚡', label: 'Legend' },
];

const rarityColor = (r: Rarity) => {
  const m: Record<Rarity, string> = {
    common: '#b8cfe0', rare: '#88c4ff', epic: '#d870ff', legendary: '#ffe860',
  };
  return m[r];
};

const ForgePage = ({ cards, trades, onDataChange }: ForgePageProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rarity, setRarity] = useState<Rarity>('common');
  const [stats, setStats] = useState<CardStats>(() => generateStats('common'));
  const [imageUrl, setImageUrl] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [pinataJwt, setPinataJwt] = useState(() => localStorage.getItem('cf_pinata') || '');
  const [pinataStatus, setPinataStatus] = useState<'idle' | 'ok' | 'err'>('idle');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (pinataJwt) localStorage.setItem('cf_pinata', pinataJwt);
  }, [pinataJwt]);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setImageUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const rerollStats = () => setStats(generateStats(rarity));

  const changeRarity = (r: Rarity) => {
    setRarity(r);
    setStats(generateStats(r));
  };

  const testPinata = async () => {
    try {
      const res = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        headers: { Authorization: `Bearer ${pinataJwt}` },
      });
      setPinataStatus(res.ok ? 'ok' : 'err');
    } catch {
      setPinataStatus('err');
    }
  };

  const forgeCard = async () => {
    if (!name.trim()) return;
    if (!imageUrl) return;

    const serial = getCards().length + 1;
    const element = ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)];
    let finalImageUrl = imageUrl;
    let metadataUrl = '';

    if (pinataJwt && pinataStatus === 'ok') {
      try {
        setUploading(true);
        setUploadProgress(10);

        // Upload image
        const blob = await fetch(imageUrl).then(r => r.blob());
        const formData = new FormData();
        formData.append('file', blob, `${name}.png`);
        const imgRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: { Authorization: `Bearer ${pinataJwt}` },
          body: formData,
        });
        const imgData = await imgRes.json();
        finalImageUrl = `https://gateway.pinata.cloud/ipfs/${imgData.IpfsHash}`;
        setUploadProgress(60);

        // Upload metadata
        const metaRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pinataContent: { name, description, rarity, stats, element, image: finalImageUrl, serial, collection: 'CardForge Genesis' },
            pinataMetadata: { name },
          }),
        });
        const metaData = await metaRes.json();
        metadataUrl = `https://gateway.pinata.cloud/ipfs/${metaData.IpfsHash}`;
        setUploadProgress(100);
      } catch {
        setUploading(false);
        setUploadProgress(0);
        return;
      }
    }

    const card: NFTCard = {
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      rarity,
      stats,
      element,
      imageUrl: finalImageUrl,
      metadataUrl,
      serial,
      createdAt: new Date().toISOString(),
    };

    const allCards = getCards();
    allCards.push(card);
    saveCards(allCards);

    // Reset form
    setName('');
    setDescription('');
    setImageUrl('');
    setRarity('common');
    setStats(generateStats('common'));
    setUploading(false);
    setUploadProgress(0);
    onDataChange();
  };

  const deleteCard = (id: string) => {
    const updated = getCards().filter(c => c.id !== id);
    saveCards(updated);
    onDataChange();
  };

  const previewCard: NFTCard = {
    id: 'preview',
    name: name || 'Card Name',
    description: description || 'Card description...',
    rarity,
    stats,
    element: '⚡ ELECTRIC',
    imageUrl,
    metadataUrl: '',
    serial: getCards().length + 1,
    createdAt: new Date().toISOString(),
  };

  const tradeCardIds = new Set(trades.map(t => t.cardId));

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div
        className="w-full lg:w-[368px] lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] overflow-y-auto p-7 lg:p-6 shrink-0"
        style={{
          background: 'linear-gradient(180deg, var(--cf-surface), var(--cf-surface2))',
          borderRight: '1px solid var(--cf-border)',
        }}
      >
        {/* Section: Card Art */}
        <SectionLabel text="Card Art" />
        <div
          className="relative rounded-xl mb-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
          style={{
            border: `1.5px dashed ${dragOver ? 'var(--cf-gold)' : 'var(--cf-border2)'}`,
            background: dragOver ? 'rgba(200,168,75,0.04)' : 'transparent',
            minHeight: imageUrl ? 'auto' : '120px',
            boxShadow: dragOver ? 'inset 0 0 20px rgba(200,168,75,0.08)' : 'none',
          }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleImage(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])} />
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="w-[100px] h-[100px] object-cover rounded-lg m-3" />
          ) : (
            <div className="flex flex-col items-center gap-1 py-6" style={{ color: 'var(--cf-muted)' }}>
              <span className="text-2xl opacity-60">🖼️</span>
              <span className="font-body text-[0.65rem]">Drop image here or click to browse</span>
            </div>
          )}
        </div>

        {/* Section: Card Identity */}
        <SectionLabel text="Card Identity" />
        <input
          type="text"
          placeholder="Card Name"
          maxLength={24}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-transparent font-body text-sm py-2 px-3 rounded-lg mb-3 outline-none transition-colors duration-200"
          style={{ border: '1px solid var(--cf-border2)', color: 'var(--cf-text)' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--cf-gold)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--cf-border2)'; }}
        />
        <textarea
          placeholder="Description"
          maxLength={120}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-transparent font-body text-xs py-2 px-3 rounded-lg mb-5 outline-none resize-none transition-colors duration-200"
          style={{ border: '1px solid var(--cf-border2)', color: 'var(--cf-text)', minHeight: '64px' }}
          onFocus={(e) => { e.target.style.borderColor = 'var(--cf-gold)'; }}
          onBlur={(e) => { e.target.style.borderColor = 'var(--cf-border2)'; }}
        />

        {/* Section: Rarity Tier */}
        <SectionLabel text="Rarity Tier" />
        <div className="grid grid-cols-4 gap-2 mb-5">
          {RARITY_OPTIONS.map((r) => {
            const color = rarityColor(r.key);
            const active = rarity === r.key;
            return (
              <button
                key={r.key}
                onClick={() => changeRarity(r.key)}
                className="flex flex-col items-center gap-1 py-2 rounded-lg transition-all duration-200"
                style={{
                  border: `1px solid ${active ? color : 'var(--cf-border2)'}`,
                  background: active ? `${color}12` : 'transparent',
                  boxShadow: active ? `0 0 12px ${color}33` : 'none',
                }}
              >
                <span className="text-lg">{r.icon}</span>
                <span className="font-ui text-[0.56rem] uppercase font-semibold" style={{ color }}>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Section: Battle Stats */}
        <SectionLabel text="Battle Stats" />
        <div className="grid grid-cols-5 gap-1 mb-3">
          {(Object.keys(stats) as (keyof CardStats)[]).map((key) => (
            <div
              key={key}
              className="flex flex-col items-center py-2 rounded-lg"
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--cf-border)' }}
            >
              <span className="font-ui text-[0.5rem] uppercase" style={{ color: 'var(--cf-muted)' }}>{key}</span>
              <span className="font-ui text-[0.95rem] font-bold" style={{ color: 'var(--cf-text)' }}>{stats[key]}</span>
            </div>
          ))}
        </div>
        <button
          onClick={rerollStats}
          className="w-full py-2 rounded-lg font-ui text-xs transition-all duration-200 mb-5 group"
          style={{ border: '1px solid var(--cf-border2)', color: 'var(--cf-muted2)' }}
        >
          <span className="inline-block transition-transform duration-300 group-hover:rotate-180">↻</span>{' '}Reroll Stats
        </button>

        {/* Section: IPFS Storage */}
        <SectionLabel text="IPFS Storage" />
        <div className="rounded-lg p-3 mb-5" style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid var(--cf-border)' }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-ui text-[0.6rem] uppercase" style={{ color: 'var(--cf-muted2)' }}>Pinata JWT</span>
            <span className="w-2 h-2 rounded-full" style={{
              background: pinataStatus === 'ok' ? '#4ade80' : pinataStatus === 'err' ? '#f87171' : 'var(--cf-muted)',
            }} />
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={pinataJwt}
              onChange={(e) => { setPinataJwt(e.target.value); setPinataStatus('idle'); }}
              placeholder="JWT Token"
              className="flex-1 bg-transparent font-mono text-[0.6rem] py-1.5 px-2 rounded outline-none"
              style={{ border: '1px solid var(--cf-border2)', color: 'var(--cf-text)' }}
            />
            <button
              onClick={testPinata}
              className="font-ui text-[0.6rem] px-3 rounded transition-colors"
              style={{ border: '1px solid var(--cf-border2)', color: 'var(--cf-muted2)' }}
            >
              Test
            </button>
          </div>
          {uploading && (
            <div className="mt-2 h-[3px] rounded-full overflow-hidden" style={{ background: 'var(--cf-border)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{
                width: `${uploadProgress}%`,
                background: 'linear-gradient(90deg, var(--cf-gold), #f0d060)',
              }} />
            </div>
          )}
          <p className="font-body text-[0.5rem] mt-2" style={{ color: 'var(--cf-muted)' }}>
            Get JWT at <span style={{ color: 'var(--cf-gold)' }}>app.pinata.cloud</span>
          </p>
        </div>

        {/* Forge Button */}
        <button
          onClick={forgeCard}
          className="relative w-full py-3 font-display text-sm font-bold tracking-wider rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #a07828, #f0d060, #c8a84b, #fff0a0, #c8a84b)',
            backgroundSize: '300% 100%',
            color: 'var(--cf-bg)',
            boxShadow: '0 4px 20px rgba(200,168,75,0.3)',
          }}
        >
          ⚒ Forge Card
        </button>
      </div>

      {/* Right Panel */}
      <div className="flex-1 min-w-0">
        {/* Preview */}
        <div className="flex flex-col items-center py-10 relative" style={{
          background: 'radial-gradient(ellipse at center, rgba(200,168,75,0.04) 0%, transparent 70%)',
        }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="font-display text-[8rem] font-black uppercase" style={{
              color: 'transparent',
              WebkitTextStroke: '1px rgba(200,168,75,0.04)',
            }}>PREVIEW</span>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, var(--cf-border2))' }} />
            <span className="font-ui text-[0.6rem] uppercase tracking-[0.25em]" style={{ color: 'var(--cf-muted2)' }}>Live Preview</span>
            <div className="flex-1 h-px w-16" style={{ background: 'linear-gradient(90deg, var(--cf-border2), transparent)' }} />
          </div>
          <NFTCardComponent card={previewCard} index={0} trades={[]} />
        </div>

        {/* Library */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-display text-xl text-gold-gradient">Your Cards</h2>
            <span className="font-ui text-[0.6rem] px-2 py-0.5 rounded-full" style={{
              background: 'rgba(200,168,75,0.1)',
              border: '1px solid rgba(200,168,75,0.2)',
              color: 'var(--cf-gold)',
            }}>{cards.length}</span>
          </div>
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 opacity-50">
              <span className="text-4xl mb-3 opacity-30">🃏</span>
              <p className="font-display text-sm" style={{ color: 'var(--cf-muted2)' }}>No cards forged yet</p>
              <p className="font-body text-xs" style={{ color: 'var(--cf-muted)' }}>Use the forge to create your first card</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-8 justify-center">
              {cards.map((card, i) => (
                <NFTCardComponent
                  key={card.id}
                  card={card}
                  index={i}
                  trades={trades}
                  showDelete
                  onDelete={() => {
                    if (confirm(`Delete "${card.name}"?`)) deleteCard(card.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 mb-3">
    <span className="font-ui text-[0.6rem] font-semibold uppercase tracking-[0.2em] whitespace-nowrap" style={{ color: 'var(--cf-muted2)' }}>
      {text}
    </span>
    <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, var(--cf-border2), transparent)' }} />
  </div>
);

export default ForgePage;
