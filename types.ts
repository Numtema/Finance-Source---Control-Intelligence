
export type ControlLevel = 'low' | 'medium' | 'high';
export type InvestorType = 'institutional' | 'insider' | 'retail' | 'strategic' | 'sovereign';
export type InvestorFamily = 
  'Passive Giants' | 
  'Active Funds' | 
  'Strategic/Industrial' | 
  'Sovereign' | 
  'Insiders' | 
  'Retail' |
  'Internal Fund' |     
  'Direct Clients' |    
  'Partnership' |       
  'Alumni' |            
  'Treasury' |          
  'Venture' |           
  'Management' |        
  'Family Control';     

export interface GeoLocation {
    lat: number;
    lng: number;
    country_code: string;
    city: string;
}

export interface Investor {
  name: string;
  percent: number;
  type: InvestorType;
  family: InvestorFamily;
  is_passive?: boolean;
  geo?: GeoLocation; // Added for Map
}

export interface StepResult {
  score: number; // 0-10
  summary: string;
  details?: Record<string, any>;
  notes?: string;
}

export interface ControlIndex {
  CF: number; // Formal Control
  CC: number; // Capital Control
  CM: number; // Market Constraint
  CR: number; // Revenue Power
  CP: number; // Productive Power
  ISC: number; // Indice Synthétique de Contrôle
  dominant_mode: string;
}

export interface HistoricalPoint {
    year: number;
    passive_percent: number;
    active_percent: number;
    insider_percent: number;
    isc_score: number;
}

export interface CompanyData {
  company: {
    name: string;
    ticker: string;
    year: number;
    sector: string;
    type: 'public_company' | 'private_company';
  };
  profile: {
    description: string;
    headquarters: string;
    market_cap: string;
    website: string;
    founded: string;
    geo: GeoLocation; // Added for Map
  };
  products: {
    name: string;
    category: string;
  }[];
  visual_assets: {
    logo_url?: string;
    cover_image_prompt?: string; 
    executives: { name: string; role: string; image_url?: string }[];
  };
  ownership: {
    institutional_percent: number;
    retail_percent: number;
    insider_percent: number;
    top_holders: Investor[];
  };
  analysis: {
    formal_control: StepResult;
    capital_control: StepResult;
    market_constraint: StepResult;
    revenue_power: StepResult;
    productive_power: StepResult;
    regulatory: StepResult;
  };
  pressure_levers: {
    force: string;
    type: string;
    strength: ControlLevel;
    notes: string;
  }[];
  indices: ControlIndex;
  history?: HistoricalPoint[]; // Added for Time Machine
}

export interface FrameworkStepDefinition {
  id: string;
  label: string;
  description: string;
  weight: number;
}
