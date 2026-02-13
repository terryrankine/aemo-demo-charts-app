import { useElecSummary } from '../hooks/useElecSummary';
import { useMarketPulse } from '../hooks/useMarketPulse';
import { useFuelMix } from '../hooks/useFuelMix';
import KpiCard from '../components/charts/KpiCard';
import HorizontalBar from '../components/charts/HorizontalBar';
import FlowMap from '../components/charts/FlowMap';
import { getFuelColor } from '../theme/fuel-colors';
import { REGION_LABELS, type ElecSummaryRegion, type FuelMixItem } from '../api/types';
import './Pages.css';

export default function OverviewPage() {
  const { data: summary, isLoading: loadingSummary, isError: errSummary } = useElecSummary();
  const { data: wemPoints, isLoading: loadingWem } = useMarketPulse();
  const { data: fuelMix, isLoading: loadingFuel } = useFuelMix('NEM', 'CURRENT');

  if (loadingSummary || loadingFuel || loadingWem) {
    return <div className="page-loading">Loading live data...</div>;
  }

  if (errSummary) {
    return <div className="page-loading page-error">Failed to load market data. AEMO API may be unavailable.</div>;
  }

  const regions = summary?.regions ?? [];
  const interconnectors = summary?.interconnectors ?? [];

  // WEM latest data point
  const wemAll = wemPoints ?? [];
  const wemLatestActual = [...wemAll].reverse().find(p => p.actualTotalGeneration != null);
  const wemLatest = wemAll[wemAll.length - 1];
  const wemPrice = wemLatest?.price ?? 0;
  const wemDemand = wemLatestActual?.actualTotalGeneration ?? wemLatest?.forecastMw ?? 0;

  const fuelItems = (fuelMix ?? []).map((item: FuelMixItem) => ({
    name: item.fuelType ?? 'Unknown',
    value: item.value ?? 0,
    color: getFuelColor(item.fuelType ?? ''),
  })).filter(i => i.value > 0);

  return (
    <div className="page">
      <div className="page-header">
        <h2>Market Overview</h2>
        <span className="page-subtitle">Real-time NEM + WEM</span>
      </div>

      <div className="kpi-grid">
        {regions.map((r: ElecSummaryRegion) => (
          <KpiCard
            key={r.region}
            label={REGION_LABELS[r.region] ?? r.region}
            value={r.price ?? 0}
            unit="$/MWh"
            subtitle={`Demand: ${(r.demand ?? 0).toLocaleString()} MW`}
            color={r.price < 0 ? '#ef4444' : r.price > 100 ? '#f59e0b' : '#22c55e'}
          />
        ))}
        <KpiCard
          label="WA (WEM)"
          value={wemPrice}
          unit="$/MWh"
          subtitle={`Gen: ${Math.round(wemDemand).toLocaleString()} MW`}
          color={wemPrice < 0 ? '#ef4444' : wemPrice > 100 ? '#f59e0b' : '#22c55e'}
        />
      </div>

      <div className="two-col">
        <div className="card">
          <h3 className="card-title">NEM Interconnector Flows</h3>
          <FlowMap regions={regions} interconnectors={interconnectors} />
        </div>
        <div className="card">
          <h3 className="card-title">NEM Fuel Mix (Current)</h3>
          {fuelItems.length > 0 ? (
            <HorizontalBar items={fuelItems} unit="MW" />
          ) : (
            <p className="no-data">No fuel mix data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
