import { useQuery } from '@tanstack/react-query';
import { nem } from '../api/client';
import { isRenewable } from '../theme/fuel-colors';

interface RenewPenData {
  currentPenetration: number;
  minPenetration: number;
  maxPenetration: number;
  minDate: string;
  maxDate: string;
  fuelMix: { fuelType: string; supply: number }[];
}

export function useRenewablePenetration(region: string, enabled = true) {
  return useQuery({
    queryKey: ['renewablePenetration', region],
    queryFn: () => nem.renewablePenetration(region),
    staleTime: 300_000,
    enabled,
    select: (raw: any): RenewPenData => {
      const items: any[] = raw?.data?.items ?? [];

      // Items have type "Min" or "Max" with fuel breakdowns for each
      // The "Max" record date is when renewable penetration was highest
      const maxItems = items.filter((i: any) => i.type === 'Max');
      const minItems = items.filter((i: any) => i.type === 'Min');

      const calcRenewPct = (fuels: any[]) => {
        let totalRenew = 0, totalAll = 0;
        for (const f of fuels) {
          const s = f.supply ?? 0;
          totalAll += s;
          if (isRenewable(f.fuelType) || f.fuelType === 'Distributed PV' || f.fuelType === 'Utility-scale Solar') {
            totalRenew += s;
          }
        }
        return totalAll > 0 ? (totalRenew / totalAll) * 100 : 0;
      };

      const maxPenetration = calcRenewPct(maxItems);
      const minPenetration = calcRenewPct(minItems);

      // Use the max record as "current" fuel mix
      const fuelMix = maxItems.map((i: any) => ({
        fuelType: i.fuelType,
        supply: i.supply ?? 0,
      }));

      return {
        currentPenetration: maxPenetration,
        minPenetration,
        maxPenetration,
        minDate: minItems[0]?.dateTime ?? '',
        maxDate: maxItems[0]?.dateTime ?? '',
        fuelMix,
      };
    },
  });
}
