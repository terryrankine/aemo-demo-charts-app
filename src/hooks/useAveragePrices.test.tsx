import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useDailyAveragePrices, useMonthlyAveragePrices, useAnnualAveragePrices } from './useAveragePrices';

function createWrapper() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useDailyAveragePrices', () => {
  it('parses daily price data', async () => {
    const { result } = renderHook(() => useDailyAveragePrices('2025', '01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    expect(data).toHaveLength(3);
    expect(data[0].period).toBe('2025-01-13');
    expect(data[0].region).toBe('NSW1');
  });

  it('coerces avgRrp from string to number via parseFloat', async () => {
    const { result } = renderHook(() => useDailyAveragePrices('2025', '01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data![0].avgRrp).toBe(78.50);
    expect(typeof result.current.data![0].avgRrp).toBe('number');
  });

  it('parses peakRrp when present', async () => {
    const { result } = renderHook(() => useDailyAveragePrices('2025', '01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data![0].peakRrp).toBe(120.30);
  });

  it('maps day field to period', async () => {
    const { result } = renderHook(() => useDailyAveragePrices('2025', '01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data![0].period).toBe('2025-01-13');
  });
});

describe('useMonthlyAveragePrices', () => {
  it('parses monthly price data', async () => {
    const { result } = renderHook(() => useMonthlyAveragePrices('2025', '01'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    expect(data).toHaveLength(2);
    expect(data[0].period).toBe('2025-01');
    expect(data[0].avgRrp).toBe(75.80);
  });
});

describe('useAnnualAveragePrices', () => {
  it('parses annual price data', async () => {
    const { result } = renderHook(() => useAnnualAveragePrices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const data = result.current.data!;
    expect(data).toHaveLength(2);
    expect(data[0].period).toBe('2025');
    expect(data[0].region).toBe('NSW1');
    expect(data[0].avgRrp).toBe(80.00);
  });

  it('respects enabled flag', () => {
    const { result } = renderHook(() => useAnnualAveragePrices(false), {
      wrapper: createWrapper(),
    });
    expect(result.current.isFetching).toBe(false);
  });
});
