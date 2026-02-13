import { useQuery } from '@tanstack/react-query';
import { nem } from '../api/client';
import type { FuelMixItem, FuelMixPeriod } from '../api/types';

export function useFuelMix(
  region: string,
  period: FuelMixPeriod = 'CURRENT',
  enabled = true,
) {
  return useQuery({
    queryKey: ['fuelMix', region, period],
    queryFn: () => nem.fuelMix(region, period),
    staleTime: 300_000,
    enabled,
    select: (raw: any): FuelMixItem[] => {
      let items: any[] = raw?.data?.items ?? [];

      // API ignores region param — filter by state client-side
      if (region !== 'NEM') {
        items = items.filter((i: any) => i.state === region);
      }

      // Aggregate by fuelType
      const byFuel = new Map<string, number>();
      for (const item of items) {
        const ft = item.fuelType ?? 'Unknown';
        const val = item.supply ?? item.value ?? 0;
        byFuel.set(ft, (byFuel.get(ft) ?? 0) + val);
      }

      return [...byFuel.entries()]
        .map(([fuelType, value]) => ({ fuelType, value }))
        .filter(i => i.value > 0)
        .sort((a, b) => b.value - a.value);
    },
  });
}
