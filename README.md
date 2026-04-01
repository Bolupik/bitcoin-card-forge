# ⚡ CardForge — Bitcoin-Secured NFT Card Platform

<p align="center">
  <strong>Mint, collect, and trade procedurally generated trading cards on the Stacks blockchain (Bitcoin L2)</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-Stacks%20(Bitcoin%20L2)-orange" alt="Stacks" />
  <img src="https://img.shields.io/badge/Standard-SIP--009%20NFT-blue" alt="SIP-009" />
  <img src="https://img.shields.io/badge/Supply-10%2C000-gold" alt="Supply" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT" />
</p>

---

## 🎴 About

**CardForge** is a Genesis NFT card collection built on the Stacks blockchain. Each card features procedurally generated stats, weighted rarity tiers, and elemental attributes — inspired by classic trading card games.

### Key Features

- **⚡ Random Minting** — Weighted rarity drops: Common (50%), Rare (30%), Epic (15%), Legendary (5%)
- **🎲 Procedural Generation** — Stats (ATK, DEF, SPD, SPC, HP) are randomly rolled within rarity-based ranges
- **🔊 Immersive Audio** — Synthesized sound effects for rolling, reveal, and success via Web Audio API
- **📊 Mint History** — Track recently minted cards with live-updating feed
- **⇄ P2P Trading** — List cards for trade and browse active listings
- **🖼️ Card Gallery** — Browse your full collection with rarity-coded borders and glow effects
- **🛡️ Admin Forge** — Password-protected panel for managing the card ecosystem

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Audio | Web Audio API (synthesized) |
| Blockchain | Stacks (Bitcoin L2) |
| NFT Standard | SIP-009 |
| State | localStorage (client-side) |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── MintPage.tsx        # Random mint interface with slot animation
│   ├── GalleryPage.tsx     # Card collection browser
│   ├── TradingPage.tsx     # P2P trading marketplace
│   ├── ForgePage.tsx       # Admin card forge
│   ├── NFTCard.tsx         # Card display component
│   ├── AppSidebar.tsx      # Responsive navigation sidebar
│   └── LoginScreen.tsx     # Admin authentication
├── lib/
│   ├── cardforge.ts        # Types, storage, stat generation
│   └── sounds.ts           # Web Audio API sound effects
├── pages/
│   ├── Index.tsx           # Public app shell
│   └── Admin.tsx           # Admin panel shell
└── index.css               # Design system & animations
```

## 🎨 Design System

CardForge uses a dark, premium aesthetic with gold accent theming:

- **Background**: Deep navy/black (`#05050e`)
- **Accent**: Gold gradient system (`#c8a84b → #f0d060`)
- **Typography**: Display + UI + Body font stack
- **Effects**: Glassmorphism, conic gradients, particle fields

## 🃏 Rarity Tiers

| Rarity | Drop Rate | HP Range | Stat Range | Color |
|--------|-----------|----------|------------|-------|
| Common | 50% | 60-100 | 30-70 | Ice Blue |
| Rare | 30% | 80-130 | 50-90 | Electric Blue |
| Epic | 15% | 100-160 | 70-110 | Purple |
| Legendary | 5% | 140-200 | 90-150 | Gold |

## 📄 License

MIT © CardForge Team
