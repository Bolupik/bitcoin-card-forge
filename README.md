<p align="center">
  <img src="https://img.shields.io/badge/⚡-CARDFORGE-c8a84b?style=for-the-badge&labelColor=05050e" alt="CardForge" />
</p>

<h1 align="center">CardForge</h1>

<p align="center">
  <strong>Bitcoin-secured NFT trading card platform built on Stacks</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Stacks-Bitcoin%20L2-F7931A?style=flat-square&logo=bitcoin&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/SIP--009-NFT%20Standard-5546FF?style=flat-square" /></a>
  <a href="#"><img src="https://img.shields.io/badge/React_18-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" /></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-22c55e?style=flat-square" /></a>
</p>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

---

## 🎴 About

**CardForge** is a genesis NFT card collection platform where admins forge custom trading card templates and users mint randomly from the available pool. Each card features unique stats, elemental attributes, and rarity tiers — inspired by classic TCGs like Pokémon, secured by Bitcoin via the Stacks blockchain.

> **Currently in whitelist phase** — connect your wallet and follow [@smokestx](https://x.com/smokestx) to get early access.

## ✨ Features

### For Collectors
- **🎲 Random Minting** — Weighted random draws from the admin-curated template pool
- **🔊 Immersive Experience** — Synthesized sound effects and slot-machine reveal animations
- **📊 Mint History** — Live feed of recently minted cards
- **⇄ P2P Trading** — List cards for trade and browse active listings
- **🖼️ Gallery** — Browse your collection with rarity-coded borders and glow effects

### For Admins
- **🛡️ Card Forge** — Create card templates with custom art, stats, elements, and supply caps
- **✏️ Template Editor** — Edit existing templates (name, image, supply) post-creation
- **⚙️ Collection Config** — Set total supply cap across all templates
- **📈 Supply Tracking** — Monitor minted vs. remaining per template

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · TypeScript 5 · Vite 5 |
| **Styling** | Tailwind CSS v3 · Custom design tokens |
| **Routing** | React Router v6 |
| **Animation** | Framer Motion · CSS animations |
| **Audio** | Web Audio API (synthesized SFX) |
| **Blockchain** | Stacks (Bitcoin L2) · SIP-009 NFT |
| **State** | localStorage (pre-launch) |

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/your-username/cardforge.git
cd cardforge

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app runs at `http://localhost:5173`. Admin panel is at `/admin`.

## 📁 Architecture

```
src/
├── components/
│   ├── WhitelistPage.tsx    # Pre-launch whitelist signup
│   ├── MintPage.tsx         # Random mint with slot animation
│   ├── GalleryPage.tsx      # Card collection browser
│   ├── TradingPage.tsx      # Admin trade management
│   ├── PublicTradingPage.tsx # Public trade listings
│   ├── ForgePage.tsx        # Template creation & editing
│   ├── NFTCard.tsx          # Card display with rarity effects
│   ├── AppSidebar.tsx       # Navigation sidebar
│   ├── ParticleField.tsx    # Background particle system
│   └── LoginScreen.tsx      # Admin authentication
├── lib/
│   ├── cardforge.ts         # Types, templates, minting logic
│   └── sounds.ts            # Web Audio API sound engine
├── pages/
│   ├── Index.tsx            # Public entry (whitelist phase)
│   └── Admin.tsx            # Protected admin panel
└── index.css                # Design system & CSS tokens
```

## 🃏 Rarity System

| Rarity | Color | HP Range | Stat Range |
|--------|-------|----------|------------|
| **Common** | `Ice Blue` | 60 – 100 | 30 – 70 |
| **Rare** | `Electric Blue` | 80 – 130 | 50 – 90 |
| **Epic** | `Purple` | 100 – 160 | 70 – 110 |
| **Legendary** | `Gold` | 140 – 200 | 90 – 150 |

Supply per template is set by the admin. Mints are weighted by remaining supply — templates with more unclaimed copies are more likely to be drawn.

## 🎨 Design

Dark premium aesthetic with a gold accent system:

- **Palette**: Deep navy `#05050e` → Gold gradient `#c8a84b → #f0d060`
- **Effects**: Glassmorphism, conic gradients, particle fields, glow borders
- **Responsive**: Mobile-first with sidebar navigation

## 🗺️ Roadmap

- [x] Template-based card forge system
- [x] Weighted random minting
- [x] Immersive audio & animations
- [x] Whitelist signup flow
- [ ] Stacks wallet integration (Hiro Wallet)
- [ ] On-chain SIP-009 minting
- [ ] Smart contract deployment
- [ ] IPFS/Pinata metadata storage
- [ ] Marketplace with STX payments

## 📄 License

MIT © CardForge

---

<p align="center">
  <sub>Built with ⚡ by the CardForge team</sub>
</p>
