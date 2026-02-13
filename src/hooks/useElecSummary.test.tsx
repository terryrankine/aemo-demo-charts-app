import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useElecSummary } from './useElecSummary';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useElecSummary', () => {
  it('parses regions from API response', async () => {
    const { result } = renderHook(() => useElecSummary(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { regions } = result.current.data!;
    expect(regions).toHaveLength(5);
    expect(regions[0].region).toBe('NSW1');
    expect(regions[0].price).toBe(85.42);
    expect(regions[0].demand).toBe(8500);
  });

  it('calculates generation as scheduled + semi-scheduled', async () => {
    const { result } = renderHook(() => useElecSummary(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const nsw = result.current.data!.regions.find(r => r.region === 'NSW1')!;
    expect(nsw.generation).toBe(7200 + 1800); // scheduled + semi
  });

  it('parses interconnector flows from JSON strings', async () => {
    const { result } = renderHook(() => useElecSummary(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { interconnectors } = result.current.data!;
    expect(interconnectors.length).toBeGreaterThan(0);

    const nswQld = interconnectors.find(ic => ic.interconnectorId === 'NSW1-QLD1');
    expect(nswQld).toBeDefined();
    expect(nswQld!.exportRegion).toBe('NSW1');
    expect(nswQld!.mwFlow).toBe(300);
  });

  it('deduces import regions from interconnector IDs', async () => {
    const { result } = renderHook(() => useElecSummary(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const { interconnectors } = result.current.data!;
    const nswQld = interconnectors.find(ic => ic.interconnectorId === 'NSW1-QLD1');
    expect(nswQld!.importRegion).toBe('QLD1');
  });

  it('respects enabled flag', () => {
    const { result } = renderHook(() => useElecSummary(false), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
