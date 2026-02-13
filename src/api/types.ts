// Region identifiers
export type NemRegion = 'NSW1' | 'QLD1' | 'VIC1' | 'SA1' | 'TAS1';
export type RegionOrNem = NemRegion | 'NEM';

export const NEM_REGIONS: { id: NemRegion; label: string }[] = [
  { id: 'NSW1', label: 'NSW' },
  { id: 'QLD1', label: 'QLD' },
  { id: 'VIC1', label: 'VIC' },
  { id: 'SA1', label: 'SA' },
  { id: 'TAS1', label: 'TAS' },
];

export const REGION_LABELS: Record<string, string> = {
  NSW1: 'NSW',
  QLD1: 'QLD',
  VIC1: 'VIC',
  SA1: 'SA',
  TAS1: 'TAS',
  NEM: 'NEM',
};

// Time scale / period types
export type TimeScale = '5MIN' | '30MIN';
export type FuelMixPeriod = 'CURRENT' | '24H' | '48H' | '3M' | '12M';

// elecSummary response
export interface ElecSummaryRegion {
  region: string;
  price: number;
  demand: number;
  generation: number;
  netInterchange: number;
  scheduledGeneration: number;
  semiScheduledGeneration: number;
}

export interface InterconnectorFlow {
  interconnectorId: string;
  exportRegion: string;
  importRegion: string;
  mwFlow: number;
  exportLimit: number;
  importLimit: number;
}

export interface ElecSummaryResponse {
  regions: ElecSummaryRegion[];
  interconnectors: InterconnectorFlow[];
}

// priceAndDemand response
export interface PriceAndDemandPoint {
  dt: string;
  rrp: number;
  totalDemand: number;
  scheduledGen: number;
  semiScheduledGen: number;
  netInterchange: number;
}

// fuelMix response
export interface FuelMixItem {
  fuelType: string;
  value: number;
  percent?: number;
}

export interface FuelMixTimeSeries {
  dt: string;
  items: FuelMixItem[];
}

// renewablePenetration response
export interface RenewablePenetrationData {
  currentPenetration: number;
  minPenetration: number;
  maxPenetration: number;
  fuelMix: FuelMixItem[];
}

// averagePrices response
export interface AveragePricePoint {
  period: string;
  region: string;
  avgRrp: number;
  peakRrp?: number;
}

// WEM marketPulse
export interface MarketPulsePoint {
  dt: string;
  price: number;
  forecastMw: number;
  actualTotalGeneration: number | null;
  actualNsgMw: number | null;
  forecastNsgMw: number;
  rtdTotalGeneration: number;
  totalOutageMw: number;
  plannedOutageMw: number;
  forcedOutageMw: number;
}
