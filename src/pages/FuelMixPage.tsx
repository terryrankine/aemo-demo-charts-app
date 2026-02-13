import { useState } from 'react';
import { useFuelMix } from '../hooks/useFuelMix';
import HorizontalBar from '../components/charts/HorizontalBar';
import RegionSelector from '../components/controls/RegionSelector';
import TimeRangePicker from '../components/controls/TimeRangePicker';
import CompareToggle from '../components/controls/CompareToggle';
import ViewModeToggle, { type ViewMode } from '../components/controls/ViewModeToggle';
import { NEM_REGIONS, REGION_LABELS, type FuelMixPeriod, type FuelMixItem } from '../api/types';
import { REGION_COLORS, getFuelColor } from '../theme/fuel-colors';
import type { BarItem } from '../components/charts/HorizontalBar';
import './Pages.css';

const REGION_OPTIONS = [{ id: 'NEM', label: 'NEM' }, ...NEM_REGIONS];

function getEffectiveRegionB(region: string, regionB: string, compareEnabled: boolean): string {
  if (compareEnabled && regionB === region) {
    return REGION_OPTIONS.find(r => r.id !== region)?.id ?? regionB;
  }
  return regionB;
}

export default function FuelMixPage() {
  const [region, setRegion] = useState('NEM');
  const [period, setPeriod] = useState<FuelMixPeriod>('CURRENT');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [regionB, setRegionB] = useState<string>('VIC1');
  const [viewMode, setViewMode] = useState<ViewMode>('overlay');

  const effectiveRegionB = getEffectiveRegionB(region, regionB, compareEnabled);

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

  const { data: fuelMix, isLoading, isError } = useFuelMix(region, period);
  const { data: fuelMixB, isLoading: loadingB } = useFuelMix(effectiveRegionB, period, compareEnabled);

  const toBarItems = (data: FuelMixItem[]): BarItem[] =>
    data.map((item: FuelMixItem) => ({
      name: item.fuelType ?? 'Unknown',
      value: item.value ?? 0,
      color: getFuelColor(item.fuelType ?? ''),
    })).filter((i: BarItem) => i.value > 0);

  const items = toBarItems(fuelMix ?? []);
  const itemsBArr = toBarItems(fuelMixB ?? []);
  const totalMW = items.reduce((sum: number, i: BarItem) => sum + i.value, 0);
  const totalMWB = itemsBArr.reduce((sum: number, i: BarItem) => sum + i.value, 0);

  const regionBOptions = REGION_OPTIONS.filter(r => r.id !== region);
  const regionALabel = REGION_LABELS[region] ?? region;
  const regionBLabelText = REGION_LABELS[effectiveRegionB] ?? effectiveRegionB;
  const unitLabel = period === 'CURRENT' ? 'MW' : 'MWh';

  const loading = isLoading || (compareEnabled && loadingB);

  const renderPctGrid = (barItems: BarItem[], total: number, label?: string) => (
    <div className="card fuel-pct-grid">
      {label && <div className="card-title">{label}</div>}
      {barItems.map((item: BarItem) => (
        <div key={item.name} className="fuel-pct-item">
          <div className="fuel-pct-bar-bg">
            <div
              className="fuel-pct-bar-fill"
              style={{
                width: `${(item.value / total) * 100}%`,
                backgroundColor: item.color,
              }}
            />
          </div>
          <span className="fuel-pct-label">{item.name}</span>
          <span className="fuel-pct-value">
            {((item.value / total) * 100).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="page">
      <div className="page-header">
        <h2>Fuel Mix</h2>
        <div className="page-controls">
          <RegionSelector
            regions={REGION_OPTIONS}
            selected={region}
            onChange={handleRegionChange}
          />
          <TimeRangePicker selected={period} onChange={setPeriod} />
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

      {loading ? (
        <div className="page-loading">Loading fuel mix data...</div>
      ) : isError ? (
        <div className="page-loading" style={{ color: '#ef4444' }}>Failed to load fuel mix data.</div>
      ) : compareEnabled && viewMode === 'split' ? (
        <>
          <div className="comparison-split">
            <div className="comparison-panel">
              <div className="card">
                <div className="card-header-row">
                  <h3 className="card-title">{regionALabel} - Generation by Fuel Type</h3>
                  <span className="card-subtitle">Total: {totalMW.toLocaleString()} {unitLabel}</span>
                </div>
                {items.length > 0 ? (
                  <HorizontalBar items={items} unit={unitLabel} />
                ) : (
                  <p className="no-data">No fuel mix data available</p>
                )}
              </div>
              {items.length > 0 && renderPctGrid(items, totalMW)}
            </div>
            <div className="comparison-panel">
              <div className="card">
                <div className="card-header-row">
                  <h3 className="card-title">{regionBLabelText} - Generation by Fuel Type</h3>
                  <span className="card-subtitle">Total: {totalMWB.toLocaleString()} {unitLabel}</span>
                </div>
                {itemsBArr.length > 0 ? (
                  <HorizontalBar items={itemsBArr} unit={unitLabel} />
                ) : (
                  <p className="no-data">No fuel mix data available</p>
                )}
              </div>
              {itemsBArr.length > 0 && renderPctGrid(itemsBArr, totalMWB)}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card">
            <div className="card-header-row">
              <h3 className="card-title">
                {compareEnabled
                  ? `${regionALabel} vs ${regionBLabelText} - Generation by Fuel Type`
                  : 'Generation by Fuel Type'}
              </h3>
              <span className="card-subtitle">
                {compareEnabled
                  ? `${regionALabel}: ${totalMW.toLocaleString()} ${unitLabel} | ${regionBLabelText}: ${totalMWB.toLocaleString()} ${unitLabel}`
                  : `Total: ${totalMW.toLocaleString()} ${unitLabel}`}
              </span>
            </div>
            {items.length > 0 ? (
              <HorizontalBar
                items={items}
                unit={unitLabel}
                {...(compareEnabled && {
                  regionALabel,
                  regionBLabel: regionBLabelText,
                  regionAColor: REGION_COLORS[region] ?? '#4A90D9',
                  regionBColor: REGION_COLORS[effectiveRegionB] ?? '#E74C3C',
                  itemsB: itemsBArr,
                })}
              />
            ) : (
              <p className="no-data">No fuel mix data available</p>
            )}
          </div>

          {/* Percentage breakdown - only in non-compare mode */}
          {!compareEnabled && items.length > 0 && renderPctGrid(items, totalMW)}
        </>
      )}
    </div>
  );
}
