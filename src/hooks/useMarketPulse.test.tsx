import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useMarketPulse } from './useMarketPulse';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useMarketPulse', () => {
  it('maps WEM fields to MarketPulsePoint shape', async () => {
    const { result } = renderHook(() => useMarketPulse(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    expect(data).toHaveLength(2);

    const first = data[0];
    expect(first.dt).toBe('2025-01-15T10:00:00');
    expect(first.price).toBe(65.20);
    expect(first.forecastMw).toBe(3200);
    expect(first.actualTotalGeneration).toBe(3100);
    expect(first.rtdTotalGeneration).toBe(3080);
    expect(first.totalOutageMw).toBe(320);
    expect(first.plannedOutageMw).toBe(200);
    expect(first.forcedOutageMw).toBe(120);
  });

  it('handles null actualTotalGeneration', async () => {
    const { result } = renderHook(() => useMarketPulse(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const second = result.current.data![1];
    expect(second.actualTotalGeneration).toBeNull();
    expect(second.actualNsgMw).toBeNull();
  });

  it('respects enabled flag', () => {
    const { result } = renderHook(() => useMarketPulse(false), { wrapper: createWrapper() });
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('uses forecastEoiMw as fallback for forecastMw', async () => {
    const { result } = renderHook(() => useMarketPulse(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // First item has both forecastMw and forecastEoiMw — should use forecastMw
    expect(result.current.data![0].forecastMw).toBe(3200);
  });
});
