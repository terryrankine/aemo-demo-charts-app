import { useState } from 'react';
import { useRenewablePenetration } from '../hooks/useRenewablePenetration';
import { useFuelMix } from '../hooks/useFuelMix';
import RenewableGauge from '../components/charts/RenewableGauge';
import HorizontalBar from '../components/charts/HorizontalBar';
import KpiCard from '../components/charts/KpiCard';
import RegionSelector from '../components/controls/RegionSelector';
import CompareToggle from '../components/controls/CompareToggle';
import ViewModeToggle, { type ViewMode } from '../components/controls/ViewModeToggle';
import { NEM_REGIONS, REGION_LABELS, type FuelMixItem } from '../api/types';
import { REGION_COLORS, getFuelColor, isRenewable } from '../theme/fuel-colors';
import type { BarItem } from '../components/charts/HorizontalBar';
import './Pages.css';

const REGION_OPTIONS = [{ id: 'NEM', label: 'NEM' }, ...NEM_REGIONS];

interface ParsedFuels {
  renewables: BarItem[];
  fossils: BarItem[];
}

function parseFuels(fuelMix: FuelMixItem[]): ParsedFuels {
  const allFuels = fuelMix.map((item: FuelMixItem) => ({
    name: item.fuelType ?? 'Unknown',
    value: item.value ?? 0,
    color: getFuelColor(item.fuelType ?? ''),
    renewable: isRenewable(item.fuelType ?? ''),
  })).filter(i => i.value > 0);

  return {
    renewables: allFuels.filter(f => f.renewable),
    fossils: allFuels.filter(f => !f.renewable),
  };
}

function calcPenetration(renewables: BarItem[], fossils: BarItem[]): number {
  const renewTotal = renewables.reduce((s: number, i: BarItem) => s + i.value, 0);
  const allTotal = renewTotal + fossils.reduce((s: number, i: BarItem) => s + i.value, 0);
  return allTotal > 0 ? (renewTotal / allTotal) * 100 : 0;
}

export default function RenewablesPage() {
  const [region, setRegion] = useState('NEM');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [regionB, setRegionB] = useState<string>('VIC1');
  const [viewMode, setViewMode] = useState<ViewMode>('overlay');

  // Derive effective regionB (auto-fix when it matches regionA)
  const effectiveRegionB = (compareEnabled && regionB === region)
    ? (REGION_OPTIONS.find(r => r.id !== region)?.id ?? regionB)
    : regionB;

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    if (compareEnabled && regionB === newRegion) {
      const alt = REGION_OPTIONS.find(r => r.id !== newRegion);
      if (alt) setRegionB(alt.id);
    }
  };

  const handleCompareChange = (enabled: boolean) => {
    setCompareEnabled(enabled);
    if (enabled && regionB === region) {
      const alt = REGION_OPTIONS.find(r => r.id !== region);
      if (alt) setRegionB(alt.id);
    }
  };

  // renewablePenetration only provides NEM-wide min/max records
  const { data: penetration, isLoading: loadingPen, isError: errPen } = useRenewablePenetration(region);
  const { data: fuelMix, isLoading: loadingFuel, isError: errFuel } = useFuelMix(region, 'CURRENT');
  const { data: fuelMixB, isLoading: loadingFuelB } = useFuelMix(effectiveRegionB, 'CURRENT', compareEnabled);

  const isLoading = loadingPen || loadingFuel || (compareEnabled && loadingFuelB);

  // NEM-wide min/max from the dedicated endpoint
  const minPen = penetration?.minPenetration ?? 0;
  const maxPen = penetration?.maxPenetration ?? 0;

  // Per-region current penetration computed from fuelMix data
  const { renewables, fossils } = parseFuels(fuelMix ?? []);
  const { renewables: renewablesB, fossils: fossilsB } = parseFuels(fuelMixB ?? []);

  const currentPenetration = calcPenetration(renewables, fossils);
  const currentPenetrationB = calcPenetration(renewablesB, fossilsB);

  const regionBOptions = REGION_OPTIONS.filter(r => r.id !== region);
  const regionALabel = REGION_LABELS[region] ?? region;
  const regionBLabel = REGION_LABELS[effectiveRegionB] ?? effectiveRegionB;

  const renderPanel = (
    label: string,
    pen: number,
    renew: BarItem[],
    fossil: BarItem[],
  ) => (
    <div className="comparison-panel">
      <div className="gauge-kpi-row">
        <RenewableGauge value={pen} title={`${label} Renewable`} size={220} />
        <div className="kpi-col">
          <KpiCard label="Current" value={`${pen.toFixed(1)}%`} color="#22c55e" />
        </div>
      </div>
      <div className="two-col">
        <div className="card">
          <h3 className="card-title">Renewable Sources</h3>
          {renew.length > 0 ? (
            <HorizontalBar items={renew} unit="MW" />
          ) : (
            <p className="no-data">No renewable data</p>
          )}
        </div>
        <div className="card">
          <h3 className="card-title">Non-Renewable Sources</h3>
          {fossil.length > 0 ? (
            <HorizontalBar items={fossil} unit="MW" />
          ) : (
            <p className="no-data">No fossil data</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Renewable Penetration</h2>
        <div className="page-controls">
          <RegionSelector
            regions={REGION_OPTIONS}
            selected={region}
            onChange={handleRegionChange}
          />
          <CompareToggle
            enabled={compareEnabled}
            onChange={handleCompareChange}
          />
          {compareEnabled && (
            <>
              <div>
                <div className="region-label">vs</div>
                <RegionSelector
                  regions={regionBOptions}
                  selected={effectiveRegionB}
                  onChange={setRegionB}
                />
              </div>
              <ViewModeToggle mode={viewMode} onChange={setViewMode} />
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="page-loading">Loading renewables data...</div>
      ) : (errPen || errFuel) ? (
        <div className="page-loading" style={{ color: '#ef4444' }}>Failed to load renewables data.</div>
      ) : compareEnabled && viewMode === 'split' ? (
        <div className="comparison-split">
          {renderPanel(regionALabel, currentPenetration, renewables, fossils)}
          {renderPanel(regionBLabel, currentPenetrationB, renewablesB, fossilsB)}
        </div>
      ) : compareEnabled ? (
        /* Overlay mode */
        <>
          <div className="comparison-gauges">
            <div style={{ textAlign: 'center' }}>
              <RenewableGauge value={currentPenetration} title={`${regionALabel} Renewable`} size={240} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <RenewableGauge value={currentPenetrationB} title={`${regionBLabel} Renewable`} size={240} />
            </div>
          </div>

          <div className="comparison-split" style={{ marginBottom: 16 }}>
            <div className="kpi-col">
              <KpiCard label={`${regionALabel} Current`} value={`${currentPenetration.toFixed(1)}%`} color="#22c55e" />
            </div>
            <div className="kpi-col">
              <KpiCard label={`${regionBLabel} Current`} value={`${currentPenetrationB.toFixed(1)}%`} color="#22c55e" />
            </div>
          </div>

          <div className="two-col">
            <div className="card">
              <h3 className="card-title">Renewable Sources</h3>
              <HorizontalBar
                items={renewables}
                unit="MW"
                regionALabel={regionALabel}
                regionBLabel={regionBLabel}
                regionAColor={REGION_COLORS[region] ?? '#4A90D9'}
                regionBColor={REGION_COLORS[effectiveRegionB] ?? '#E74C3C'}
                itemsB={renewablesB}
              />
            </div>
            <div className="card">
              <h3 className="card-title">Non-Renewable Sources</h3>
              <HorizontalBar
                items={fossils}
                unit="MW"
                regionALabel={regionALabel}
                regionBLabel={regionBLabel}
                regionAColor={REGION_COLORS[region] ?? '#4A90D9'}
                regionBColor={REGION_COLORS[effectiveRegionB] ?? '#E74C3C'}
                itemsB={fossilsB}
              />
            </div>
          </div>
        </>
      ) : (
        /* Default single-region mode */
        <>
          <div className="gauge-kpi-row">
            <RenewableGauge value={currentPenetration} size={260} />
            <div className="kpi-col">
              <KpiCard label="Current" value={`${currentPenetration.toFixed(1)}%`} color="#22c55e" />
              <KpiCard label="Min (NEM Record)" value={`${minPen.toFixed(1)}%`} color="#ef4444" />
              <KpiCard label="Max (NEM Record)" value={`${maxPen.toFixed(1)}%`} color="#3b82f6" />
            </div>
          </div>

          <div className="two-col">
            <div className="card">
              <h3 className="card-title">Renewable Sources</h3>
              {renewables.length > 0 ? (
                <HorizontalBar items={renewables} unit="MW" />
              ) : (
                <p className="no-data">No renewable data</p>
              )}
            </div>
            <div className="card">
              <h3 className="card-title">Non-Renewable Sources</h3>
              {fossils.length > 0 ? (
                <HorizontalBar items={fossils} unit="MW" />
              ) : (
                <p className="no-data">No fossil data</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
