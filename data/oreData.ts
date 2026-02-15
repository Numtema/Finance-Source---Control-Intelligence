
import { CompanyData } from '../types';

export const ORE_DATA: CompanyData[] = [
  {
    company: {
      name: "The Vanguard Group",
      ticker: "VANGUARD",
      year: 2026,
      sector: "Asset Management",
      type: "private_company"
    },
    profile: {
      description: "Structure mutualiste unique où les fonds gérés possèdent la société de gestion. Pas d'actionnaires externes classiques.",
      headquarters: "Malvern, Pennsylvania",
      market_cap: "N/A (Mutual)",
      website: "vanguard.com",
      founded: "1975"
    },
    products: [{ name: "Index Funds", category: "Finance" }, { name: "ETFs", category: "Finance" }],
    visual_assets: { executives: [{ name: "Mortimer J. Buckley", role: "CEO" }] },
    ownership: {
      institutional_percent: 100,
      retail_percent: 0,
      insider_percent: 0,
      top_holders: [
        { name: "Client-Owners (Retail Investors Pool)", percent: 30.6, type: "retail", family: "Direct Clients" },
        { name: "Vanguard Total Stock Market Index Fund", percent: 18.5, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard 500 Index Fund", percent: 15.2, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard Institutional Index Fund", percent: 8.4, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard Total International Stock Index Fund", percent: 7.1, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard Growth Index Fund", percent: 5.5, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard Value Index Fund", percent: 4.9, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard Mid-Cap Index Fund", percent: 3.8, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard Small-Cap Index Fund", percent: 3.2, type: "institutional", family: "Internal Fund" },
        { name: "Vanguard Dividend Appreciation Index Fund", percent: 2.8, type: "institutional", family: "Internal Fund" }
      ]
    },
    analysis: {
      formal_control: { score: 1, summary: "Structure circulaire fermée", notes: "La société est détenue par ses propres fonds." },
      capital_control: { score: 10, summary: "Auto-contrôle systémique", notes: "Boucle de rétroaction parfaite." },
      market_constraint: { score: 1, summary: "Immunisé à la bourse", notes: "Non coté." },
      revenue_power: { score: 5, summary: "Frais de gestion bas", notes: "Volume > Marge." },
      productive_power: { score: 8, summary: "Scale Moat", notes: "Économies d'échelle." },
      regulatory: { score: 9, summary: "Risque systémique", notes: "Too big to fail." }
    },
    pressure_levers: [],
    indices: { CF: 1, CC: 10, CM: 1, CR: 5, CP: 8, ISC: 5.5, dominant_mode: "Mutualized Circular Control" }
  },
  {
    company: {
      name: "BlackRock Inc.",
      ticker: "BLK",
      year: 2026,
      sector: "Asset Management",
      type: "public_company"
    },
    profile: {
      description: "Le plus grand gestionnaire d'actifs au monde. Société cotée publique avec une structure d'actionnariat institutionnelle classique.",
      headquarters: "New York, USA",
      market_cap: "~$140B",
      website: "blackrock.com",
      founded: "1988"
    },
    products: [{ name: "iShares", category: "ETF" }, { name: "Aladdin", category: "Tech" }],
    visual_assets: { executives: [{ name: "Larry Fink", role: "CEO" }] },
    ownership: {
      institutional_percent: 80,
      retail_percent: 20,
      insider_percent: 1,
      top_holders: [
        { name: "Vanguard Group", percent: 9.2, type: "institutional", family: "Passive Giants" },
        { name: "BlackRock (Passive Giants)", percent: 6.8, type: "institutional", family: "Internal Fund" },
        { name: "State Street Corporation", percent: 4.1, type: "institutional", family: "Passive Giants" },
        { name: "Temasek Holdings", percent: 3.4, type: "sovereign", family: "Sovereign" },
        { name: "Bank of America", percent: 3.1, type: "institutional", family: "Active Funds" },
        { name: "JPMorgan Chase & Co.", percent: 2.5, type: "institutional", family: "Active Funds" },
        { name: "Capital Group", percent: 2.2, type: "institutional", family: "Active Funds" },
        { name: "Mizuho Financial Group", percent: 2.1, type: "institutional", family: "Active Funds" },
        { name: "Geode Capital Management", percent: 1.7, type: "institutional", family: "Passive Giants" },
        { name: "Morgan Stanley", percent: 1.5, type: "institutional", family: "Active Funds" }
      ]
    },
    analysis: {
      formal_control: { score: 4, summary: "Coté en bourse", notes: " Larry Fink a une influence disproportionnée." },
      capital_control: { score: 6, summary: "Contrôlé par ses pairs", notes: "Vanguard possède BlackRock." },
      market_constraint: { score: 7, summary: "Sensible au cours", notes: "Fiduciaire." },
      revenue_power: { score: 8, summary: "Diversifié", notes: "Tech + Frais." },
      productive_power: { score: 10, summary: "Aladdin", notes: "Monopole Tech." },
      regulatory: { score: 9, summary: "ESG / Systémique", notes: "Cible politique." }
    },
    pressure_levers: [],
    indices: { CF: 4, CC: 6, CM: 7, CR: 8, CP: 10, ISC: 6.8, dominant_mode: "Managerial & Peer Control" }
  },
  {
    company: {
      name: "Geode Capital Management",
      ticker: "GEODE",
      year: 2026,
      sector: "Asset Management",
      type: "private_company"
    },
    profile: {
      description: "Spin-off de Fidelity. Structure hybride opaque servant de 'back-office' indiciel pour l'empire Fidelity.",
      headquarters: "Boston, Massachusetts",
      market_cap: "Private",
      website: "geodecapital.com",
      founded: "2001"
    },
    products: [{ name: "Index Strategies", category: "Finance" }],
    visual_assets: { executives: [] },
    ownership: {
      institutional_percent: 0,
      retail_percent: 0,
      insider_percent: 100,
      top_holders: [
        { name: "Employee Ownership Trust", percent: 45.0, type: "insider", family: "Internal Fund" },
        { name: "Geode Partners L.P.", percent: 25.0, type: "insider", family: "Partnership" },
        { name: "FMR LLC (Legacy Interests)", percent: 10.0, type: "strategic", family: "Family Control" },
        { name: "Strategic Executive Pool", percent: 5.0, type: "insider", family: "Management" },
        { name: "Institutional Private Placements", percent: 5.0, type: "strategic", family: "Strategic/Industrial" },
        { name: "Retired Partner Trusts", percent: 4.0, type: "insider", family: "Alumni" },
        { name: "Operational Reserve Fund", percent: 3.0, type: "insider", family: "Treasury" },
        { name: "Boston Financial Trust", percent: 1.5, type: "strategic", family: "Strategic/Industrial" },
        { name: "Private Equity Seed Investors", percent: 1.0, type: "strategic", family: "Venture" },
        { name: "Tech Development Fund", percent: 0.5, type: "strategic", family: "Internal Fund" }
      ]
    },
    analysis: {
      formal_control: { score: 8, summary: "Partenariat Privé", notes: "Contrôle interne fort." },
      capital_control: { score: 7, summary: "Legacy Fidelity", notes: "Liens forts avec la famille Johnson." },
      market_constraint: { score: 1, summary: "Privé", notes: "Aucune pression boursière." },
      revenue_power: { score: 4, summary: "Mandats", notes: "Dépend des flux Fidelity." },
      productive_power: { score: 5, summary: "Algo-trading", notes: "Spécialiste niche." },
      regulatory: { score: 3, summary: "Faible visibilité", notes: "Sous le radar." }
    },
    pressure_levers: [],
    indices: { CF: 8, CC: 7, CM: 1, CR: 4, CP: 5, ISC: 5.15, dominant_mode: "Private Partnership / Proxy" }
  },
  {
    company: {
      name: "JPMorgan Chase & Co.",
      ticker: "JPM",
      year: 2026,
      sector: "Banking",
      type: "public_company"
    },
    profile: {
      description: "La plus grande banque des États-Unis et l'une des plus grandes institutions financières au monde.",
      headquarters: "New York, USA",
      market_cap: "~$580B",
      website: "jpmorganchase.com",
      founded: "2000"
    },
    products: [{ name: "Banking", category: "Finance" }, { name: "Investment", category: "Finance" }],
    visual_assets: { executives: [{ name: "Jamie Dimon", role: "CEO" }] },
    ownership: {
      institutional_percent: 72,
      retail_percent: 28,
      insider_percent: 0.5,
      top_holders: [
        { name: "Vanguard Group", percent: 9.3, type: "institutional", family: "Passive Giants" },
        { name: "BlackRock", percent: 6.8, type: "institutional", family: "Passive Giants" },
        { name: "State Street", percent: 4.4, type: "institutional", family: "Passive Giants" },
        { name: "FMR (Fidelity)", percent: 2.1, type: "institutional", family: "Active Funds" },
        { name: "Geode Capital Management", percent: 1.9, type: "institutional", family: "Passive Giants" },
        { name: "Morgan Stanley", percent: 1.4, type: "institutional", family: "Active Funds" },
        { name: "Bank of America", percent: 1.2, type: "institutional", family: "Active Funds" },
        { name: "Northern Trust", percent: 1.1, type: "institutional", family: "Passive Giants" },
        { name: "T. Rowe Price", percent: 1.1, type: "institutional", family: "Active Funds" },
        { name: "Norges Bank", percent: 1.0, type: "sovereign", family: "Sovereign" }
      ]
    },
    analysis: {
      formal_control: { score: 5, summary: "CEO Puissant", notes: "Jamie Dimon est une exception." },
      capital_control: { score: 5, summary: "Institutionnel", notes: "Les géants possèdent la banque." },
      market_constraint: { score: 8, summary: "Systémique", notes: "Régulation massive." },
      revenue_power: { score: 7, summary: "Too big to fail", notes: "Rente bancaire." },
      productive_power: { score: 6, summary: "Réseau", notes: "Ubiquité." },
      regulatory: { score: 10, summary: "Ultra-régulé", notes: "Fed / Bâle III." }
    },
    pressure_levers: [],
    indices: { CF: 5, CC: 5, CM: 8, CR: 7, CP: 6, ISC: 6.05, dominant_mode: "Systemic Banking Power" }
  }
];
