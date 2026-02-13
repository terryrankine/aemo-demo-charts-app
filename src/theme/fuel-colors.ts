export interface FuelConfig {
  color: string;
  label: string;
  renewable: boolean;
}

export const FUEL_COLORS: Record<string, FuelConfig> = {
  'Black coal':   { color: '#333536', label: 'Black Coal', renewable: false },
  'Black Coal':   { color: '#333536', label: 'Black Coal', renewable: false },
  'Brown coal':   { color: '#97785C', label: 'Brown Coal', renewable: false },
  'Brown Coal':   { color: '#97785C', label: 'Brown Coal', renewable: false },
  'Gas':          { color: '#34B9B3', label: 'Gas', renewable: false },
  'Natural Gas':  { color: '#34B9B3', label: 'Natural Gas', renewable: false },
  'Solar':        { color: '#FFD565', label: 'Solar', renewable: true },
  'Utility-scale Solar': { color: '#FFD565', label: 'Utility-scale Solar', renewable: true },
  'Wind':         { color: '#A1D978', label: 'Wind', renewable: true },
  'Hydro':        { color: '#ADE0EE', label: 'Hydro', renewable: true },
  'Battery':      { color: '#B056BC', label: 'Battery', renewable: true },
  'Biomass':      { color: '#A82140', label: 'Biomass', renewable: true },
  'Liquid Fuel':  { color: '#FE5F55', label: 'Liquid Fuel', renewable: false },
  'Rooftop PV':   { color: '#FFED90', label: 'Rooftop PV', renewable: true },
  'Rooftop Solar': { color: '#FFED90', label: 'Rooftop Solar', renewable: true },
  'Distributed PV': { color: '#FFED90', label: 'Distributed PV', renewable: true },
};

export function getFuelColor(fuelType: string): string {
  return FUEL_COLORS[fuelType]?.color ?? '#888888';
}

export function isRenewable(fuelType: string): boolean {
  return FUEL_COLORS[fuelType]?.renewable ?? false;
}

// Ordered for stacked charts - fossils at bottom, renewables on top
export const FUEL_STACK_ORDER = [
  'Black Coal',
  'Brown Coal',
  'Gas',
  'Liquid Fuel',
  'Biomass',
  'Hydro',
  'Wind',
  'Solar',
  'Rooftop Solar',
  'Rooftop PV',
  'Battery',
];

// Region colors for multi-region charts
export const REGION_COLORS: Record<string, string> = {
  NSW1: '#4A90D9',
  QLD1: '#E74C3C',
  VIC1: '#2ECC71',
  SA1: '#F39C12',
  TAS1: '#9B59B6',
  NEM: '#FFFFFF',
};
