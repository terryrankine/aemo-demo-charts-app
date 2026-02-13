import { useQuery } from '@tanstack/react-query';
import { nem } from '../api/client';
import type { AveragePricePoint } from '../api/types';

const ONE_HOUR = 3_600_000;

export function useDailyAveragePrices(
  year: string,
  month: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['dailyAveragePrices', year, month],
    queryFn: () => nem.dailyAveragePrices(year, month),
    staleTime: ONE_HOUR,
    enabled,
    select: (raw: any): AveragePricePoint[] => {
      const items: any[] = raw?.data?.items ?? [];
      return items.map(i => ({
        period: i.day ?? i.date ?? i.period ?? '',
        region: i.regionId ?? i.region ?? '',
        avgRrp: parseFloat(i.avgRrp) || 0,
        peakRrp: parseFloat(i.peakRrp) || undefined,
      }));
    },
  });
}

export function useMonthlyAveragePrices(
  year: string,
  month: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['monthlyAveragePrices', year, month],
    queryFn: () => nem.monthlyAveragePrices(year, month),
    staleTime: ONE_HOUR,
    enabled,
    select: (raw: any): AveragePricePoint[] => {
      const items: any[] = raw?.data?.items ?? [];
      return items.map(i => ({
        period: i.month ?? i.period ?? '',
        region: i.regionId ?? i.region ?? '',
        avgRrp: parseFloat(i.avgRrp) || 0,
        peakRrp: parseFloat(i.peakRrp) || undefined,
      }));
    },
  });
}

export function useAnnualAveragePrices(enabled = true) {
  return useQuery({
    queryKey: ['annualAveragePrices'],
    queryFn: () => nem.annualAveragePrices(),
    staleTime: ONE_HOUR,
    enabled,
    select: (raw: any): AveragePricePoint[] => {
      const items: any[] = raw?.data?.items ?? [];
      return items.map(i => ({
        period: i.year ?? '',
        region: i.regionId ?? '',
        avgRrp: parseFloat(i.avgRrp) || 0,
        peakRrp: parseFloat(i.peakRrp) || undefined,
      }));
    },
  });
}
