
import { CompanyData } from '../types';

export const APPLE_DATA: CompanyData = {
  company: {
    name: "Apple Inc.",
    ticker: "AAPL",
    year: 2026,
    sector: "Technology",
    type: "public_company"
  },
  profile: {
    description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories, alongside selling a variety of related services.",
    headquarters: "Cupertino, California, USA",
    market_cap: "~$3.4 Trillion",
    website: "apple.com",
    founded: "1976",
    geo: { lat: 37.3318, lng: -122.0312, country_code: "US", city: "Cupertino" }
  },
  products: [
    { name: "iPhone", category: "Hardware" },
    { name: "MacBook / Mac", category: "Hardware" },
    { name: "iPad", category: "Hardware" },
    { name: "Services (App Store, iCloud)", category: "Software" },
    { name: "Wearables (Watch, AirPods)", category: "Hardware" }
  ],
  visual_assets: {
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    cover_image_prompt: "Minimalist technology ecosystem",
    executives: [
      { name: "Tim Cook", role: "CEO", image_url: "https://picsum.photos/100/100" }
    ]
  },
  ownership: {
    institutional_percent: 64,
    retail_percent: 36,
    insider_percent: 0.2,
    top_holders: [
      { name: "Vanguard Group", percent: 9.7, type: "institutional", family: "Passive Giants", is_passive: true, geo: { lat: 40.037, lng: -75.514, country_code: "US", city: "Malvern" } },
      { name: "BlackRock", percent: 7.8, type: "institutional", family: "Passive Giants", is_passive: true, geo: { lat: 40.7128, lng: -74.0060, country_code: "US", city: "New York" } },
      { name: "State Street", percent: 4.1, type: "institutional", family: "Passive Giants", is_passive: true, geo: { lat: 42.3601, lng: -71.0589, country_code: "US", city: "Boston" } },
      { name: "Geode Capital Management", percent: 2.4, type: "institutional", family: "Passive Giants", is_passive: true, geo: { lat: 42.3601, lng: -71.0589, country_code: "US", city: "Boston" } },
      { name: "Berkshire Hathaway", percent: 1.9, type: "institutional", family: "Strategic/Industrial", is_passive: false, geo: { lat: 41.2565, lng: -95.9345, country_code: "US", city: "Omaha" } },
      { name: "FMR (Fidelity)", percent: 1.8, type: "institutional", family: "Active Funds", geo: { lat: 42.3601, lng: -71.0589, country_code: "US", city: "Boston" } },
      { name: "Morgan Stanley", percent: 1.6, type: "institutional", family: "Active Funds", geo: { lat: 40.7128, lng: -74.0060, country_code: "US", city: "New York" } },
      { name: "JPMorgan", percent: 1.5, type: "institutional", family: "Active Funds", geo: { lat: 40.7128, lng: -74.0060, country_code: "US", city: "New York" } },
      { name: "T. Rowe Price", percent: 1.4, type: "institutional", family: "Active Funds", geo: { lat: 39.2904, lng: -76.6122, country_code: "US", city: "Baltimore" } },
      { name: "Norges Bank", percent: 1.3, type: "sovereign", family: "Sovereign", geo: { lat: 59.9139, lng: 10.7522, country_code: "NO", city: "Oslo" } }
    ]
  },
  analysis: {
    formal_control: {
      score: 3,
      summary: "Gouvernance institutionnelle dispersée",
      notes: "Pas de structure super-votante (1 share = 1 vote). Pas de fondateur dominant. Le conseil est soumis aux grands électeurs institutionnels."
    },
    capital_control: {
      score: 6,
      summary: "Dominance massive des Passive Giants",
      notes: "Les fonds indiciels détiennent la majorité économique. Le contrôle n'est pas individuel mais systémique."
    },
    market_constraint: {
      score: 4,
      summary: "Pression modérée mais stabilisatrice",
      notes: "La génération de cash-flow massif protège Apple d'une dépendance existentielle au cours de bourse, bien que la valorisation reste clé pour les incentives."
    },
    revenue_power: {
      score: 2,
      summary: "Machine à cash diversifiée et robuste",
      notes: "L'iPhone reste le moteur, mais les Services créent une rente récurrente. Faible risque de concentration client."
    },
    productive_power: {
      score: 9,
      summary: "Écosystème verrouillé et Supply Chain",
      notes: "Switching costs énormes pour les utilisateurs (iOS). Intégration verticale (Silicon). Dépendance critique à la Chine."
    },
    regulatory: {
      score: 8, // High constraint
      summary: "Cible prioritaire des régulateurs (DMA/Antitrust)",
      notes: "Le risque principal n'est pas le marché mais le démantèlement ou l'ouverture forcée (App Store)."
    }
  },
  pressure_levers: [
    { force: "Régulateurs (EU/US)", type: "Legal/Block", strength: "high", notes: "DMA, Antitrust" },
    { force: "Passive Giants", type: "Capital/Governance", strength: "medium", notes: "Discipline financière" },
    { force: "Chine (Supply Chain)", type: "Operations", strength: "high", notes: "Risque géopolitique" }
  ],
  indices: {
    CF: 3,
    CC: 6,
    CM: 4,
    CR: 2,
    CP: 9,
    ISC: 5.25,
    dominant_mode: "Ecosystem Structural Power"
  }
};
