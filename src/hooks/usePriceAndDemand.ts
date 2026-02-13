import { useQuery } from '@tanstack/react-query';
import { nem } from '../api/client';
import type { PriceAndDemandPoint, TimeScale, ApiItemsResponse, RawPriceAndDemandItem } from '../api/types';

export function usePriceAndDemand(
  region: string,
  timeScale: TimeScale = '5MIN',
  enabled = true,
) {
  return useQuery({
    queryKey: ['priceAndDemand', region, timeScale],
    queryFn: () => nem.priceAndDemand(region, timeScale),
    staleTime: 300_000,
    enabled,
    select: (raw: ApiItemsResponse<RawPriceAndDemandItem>): PriceAndDemandPoint[] => {
      const items: RawPriceAndDemandItem[] = raw?.data?.items ?? [];
      return items.map(i => ({
        dt: i.settlementDate,
        rrp: i.rrp,
        totalDemand: i.totalDemand,
        scheduledGen: i.scheduledGeneration ?? 0,
        semiScheduledGen: i.semiScheduledGeneration ?? 0,
        netInterchange: i.netInterchange ?? 0,
      }));
    },
  });
}
