import { useQuery } from '@tanstack/react-query';
import { wem } from '../api/client';
import type { MarketPulsePoint } from '../api/types';

export function useMarketPulse(enabled = true) {
  return useQuery({
    queryKey: ['marketPulse'],
    queryFn: () => wem.marketPulse(),
    staleTime: 300_000,
    refetchInterval: 300_000,
    enabled,
    select: (raw: any): MarketPulsePoint[] => {
      const items: any[] = raw?.data?.items ?? [];
      return items.map(i => ({
        dt: i.tradingDayInterval,
        price: i.price ?? 0,
        forecastMw: i.forecastMw ?? i.forecastEoiMw ?? 0,
        actualTotalGeneration: i.actualTotalGeneration,
        actualNsgMw: i.actualNsgMw,
        forecastNsgMw: i.forecastNsgMw ?? 0,
        rtdTotalGeneration: i.rtdTotalGeneration ?? 0,
        totalOutageMw: i.totalOutageMw ?? 0,
        plannedOutageMw: i.plannedOutageMw ?? 0,
        forcedOutageMw: i.forcedOutageMw ?? 0,
      }));
    },
  });
}
