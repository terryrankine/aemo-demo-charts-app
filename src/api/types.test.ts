import { describe, it, expect } from 'vitest';
import { NEM_REGIONS, REGION_LABELS } from './types';

describe('NEM_REGIONS', () => {
  it('contains exactly 5 NEM regions', () => {
    expect(NEM_REGIONS).toHaveLength(5);
  });

  it('has correct region IDs', () => {
    const ids = NEM_REGIONS.map(r => r.id);
    expect(ids).toContain('NSW1');
    expect(ids).toContain('QLD1');
    expect(ids).toContain('VIC1');
    expect(ids).toContain('SA1');
    expect(ids).toContain('TAS1');
  });

  it('has correct labels', () => {
    const nsw = NEM_REGIONS.find(r => r.id === 'NSW1');
    expect(nsw?.label).toBe('NSW');

    const sa = NEM_REGIONS.find(r => r.id === 'SA1');
    expect(sa?.label).toBe('SA');
  });

  it('each region has id and label', () => {
    for (const r of NEM_REGIONS) {
      expect(r.id).toBeTruthy();
      expect(r.label).toBeTruthy();
      expect(r.id).toMatch(/^[A-Z]+\d$/);
    }
  });
});

describe('REGION_LABELS', () => {
  it('maps all NEM region IDs to short labels', () => {
    expect(REGION_LABELS['NSW1']).toBe('NSW');
    expect(REGION_LABELS['QLD1']).toBe('QLD');
    expect(REGION_LABELS['VIC1']).toBe('VIC');
    expect(REGION_LABELS['SA1']).toBe('SA');
    expect(REGION_LABELS['TAS1']).toBe('TAS');
  });

  it('includes NEM as a label', () => {
    expect(REGION_LABELS['NEM']).toBe('NEM');
  });

  it('has 6 entries (5 regions + NEM)', () => {
    expect(Object.keys(REGION_LABELS)).toHaveLength(6);
  });
});
