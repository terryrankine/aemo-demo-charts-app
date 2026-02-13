import { describe, it, expect } from 'vitest';
import { getFuelColor, isRenewable, FUEL_COLORS, FUEL_STACK_ORDER, REGION_COLORS } from './fuel-colors';

describe('getFuelColor', () => {
  it('returns correct color for known fuel types', () => {
    expect(getFuelColor('Solar')).toBe('#FFD565');
    expect(getFuelColor('Wind')).toBe('#A1D978');
    expect(getFuelColor('Black Coal')).toBe('#333536');
    expect(getFuelColor('Gas')).toBe('#34B9B3');
    expect(getFuelColor('Hydro')).toBe('#ADE0EE');
  });

  it('returns fallback grey for unknown fuel types', () => {
    expect(getFuelColor('Nuclear')).toBe('#888888');
    expect(getFuelColor('')).toBe('#888888');
  });

  it('handles case-variant entries (Black coal vs Black Coal)', () => {
    expect(getFuelColor('Black coal')).toBe('#333536');
    expect(getFuelColor('Brown coal')).toBe('#97785C');
  });
});

describe('isRenewable', () => {
  it('identifies renewable fuel types', () => {
    expect(isRenewable('Solar')).toBe(true);
    expect(isRenewable('Wind')).toBe(true);
    expect(isRenewable('Hydro')).toBe(true);
    expect(isRenewable('Battery')).toBe(true);
    expect(isRenewable('Biomass')).toBe(true);
    expect(isRenewable('Rooftop PV')).toBe(true);
    expect(isRenewable('Rooftop Solar')).toBe(true);
    expect(isRenewable('Distributed PV')).toBe(true);
  });

  it('identifies non-renewable fuel types', () => {
    expect(isRenewable('Black Coal')).toBe(false);
    expect(isRenewable('Brown Coal')).toBe(false);
    expect(isRenewable('Gas')).toBe(false);
    expect(isRenewable('Liquid Fuel')).toBe(false);
  });

  it('returns false for unknown fuel types', () => {
    expect(isRenewable('Nuclear')).toBe(false);
    expect(isRenewable('')).toBe(false);
  });
});

describe('FUEL_COLORS constant', () => {
  it('contains expected fuel types', () => {
    const keys = Object.keys(FUEL_COLORS);
    expect(keys.length).toBeGreaterThanOrEqual(10);
    expect(keys).toContain('Solar');
    expect(keys).toContain('Wind');
    expect(keys).toContain('Gas');
  });

  it('each entry has required fields', () => {
    for (const [, config] of Object.entries(FUEL_COLORS)) {
      expect(config).toHaveProperty('color');
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('renewable');
      expect(typeof config.color).toBe('string');
      expect(config.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe('FUEL_STACK_ORDER', () => {
  it('puts fossils before renewables', () => {
    const blackCoalIdx = FUEL_STACK_ORDER.indexOf('Black Coal');
    const solarIdx = FUEL_STACK_ORDER.indexOf('Solar');
    expect(blackCoalIdx).toBeLessThan(solarIdx);
  });

  it('contains expected fuel types', () => {
    expect(FUEL_STACK_ORDER).toContain('Black Coal');
    expect(FUEL_STACK_ORDER).toContain('Solar');
    expect(FUEL_STACK_ORDER).toContain('Wind');
    expect(FUEL_STACK_ORDER).toContain('Battery');
  });
});

describe('REGION_COLORS', () => {
  it('has colors for all NEM regions', () => {
    expect(REGION_COLORS).toHaveProperty('NSW1');
    expect(REGION_COLORS).toHaveProperty('QLD1');
    expect(REGION_COLORS).toHaveProperty('VIC1');
    expect(REGION_COLORS).toHaveProperty('SA1');
    expect(REGION_COLORS).toHaveProperty('TAS1');
    expect(REGION_COLORS).toHaveProperty('NEM');
  });
});
