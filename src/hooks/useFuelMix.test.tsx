import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useFuelMix } from './useFuelMix';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useFuelMix', () => {
  it('filters by region when not NEM', async () => {
    const { result } = renderHook(() => useFuelMix('NSW1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    // Should only have NSW1 fuels, not QLD1
    expect(data.length).toBeGreaterThan(0);
    // Our mock has 5 NSW1 fuels
    expect(data).toHaveLength(5);
  });

  it('includes all regions when NEM', async () => {
    const { result } = renderHook(() => useFuelMix('NEM'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    // NEM aggregates across regions — Black Coal from NSW1+QLD1 = 4200+3800
    const blackCoal = data.find(d => d.fuelType === 'Black Coal');
    expect(blackCoal?.value).toBe(4200 + 3800);
  });

  it('aggregates by fuel type', async () => {
    const { result } = renderHook(() => useFuelMix('NEM'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    // Solar from NSW1 (1800) + QLD1 (2200) = 4000
    const solar = data.find(d => d.fuelType === 'Solar');
    expect(solar?.value).toBe(1800 + 2200);
  });

  it('sorts by value descending', async () => {
    const { result } = renderHook(() => useFuelMix('NSW1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    for (let i = 1; i < data.length; i++) {
      expect(data[i - 1].value).toBeGreaterThanOrEqual(data[i].value);
    }
  });

  it('filters out zero-value items', async () => {
    const { result } = renderHook(() => useFuelMix('NSW1'), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    for (const item of result.current.data!) {
      expect(item.value).toBeGreaterThan(0);
    }
  });
});
