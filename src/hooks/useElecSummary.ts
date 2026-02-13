import { useQuery } from '@tanstack/react-query';
import { nem } from '../api/client';
import type { ElecSummaryRegion, InterconnectorFlow } from '../api/types';

interface ElecSummaryData {
  regions: ElecSummaryRegion[];
  interconnectors: InterconnectorFlow[];
}

export function useElecSummary(enabled = true) {
  return useQuery({
    queryKey: ['elecSummary'],
    queryFn: () => nem.elecSummary(),
    staleTime: 300_000,
    refetchInterval: 300_000,
    enabled,
    select: (raw: any): ElecSummaryData => {
      const summary = raw?.data?.summary ?? [];

      // Parse interconnector flows from all regions (they're JSON strings embedded in each region)
      const icMap = new Map<string, InterconnectorFlow>();
      const regions: ElecSummaryRegion[] = summary.map((r: any) => {
        // Parse the interconnectorFlows JSON string
        let flows: any[] = [];
        try {
          flows = typeof r.interconnectorFlows === 'string'
            ? JSON.parse(r.interconnectorFlows)
            : r.interconnectorFlows ?? [];
        } catch (e) {
          console.warn('Failed to parse interconnector flows:', e);
        }

        for (const f of flows) {
          if (!icMap.has(f.name)) {
            icMap.set(f.name, {
              interconnectorId: f.name,
              exportRegion: r.regionId,
              importRegion: '', // filled from the other side
              mwFlow: f.value,
              exportLimit: f.exportlimit ?? 0,
              importLimit: f.importlimit ?? 0,
            });
          }
        }

        return {
          region: r.regionId,
          price: r.price,
          demand: r.totalDemand,
          generation: (r.scheduledGeneration ?? 0) + (r.semischeduledGeneration ?? 0),
          netInterchange: r.netInterchange,
          scheduledGeneration: r.scheduledGeneration ?? 0,
          semiScheduledGeneration: r.semischeduledGeneration ?? 0,
        };
      });

      // Deduce import regions from interconnector naming conventions
      const regionIds = regions.map((r: ElecSummaryRegion) => r.region);
      const interconnectors = [...icMap.values()].map(ic => {
        // Try to extract regions from the interconnector ID (e.g. NSW1-QLD1, V-SA, T-V-MNSP1)
        const id = ic.interconnectorId;
        const exportRegion = ic.exportRegion;
        let importRegion = '';

        for (const rid of regionIds) {
          if (rid !== exportRegion && (id.includes(rid) || id.includes(rid.replace('1', '')))) {
            importRegion = rid;
            break;
          }
        }
        return { ...ic, importRegion };
      });

      return { regions, interconnectors };
    },
  });
}
