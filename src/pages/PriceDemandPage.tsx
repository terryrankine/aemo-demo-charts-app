import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePriceAndDemand } from '../hooks/usePriceAndDemand';
import { useMarketPulse } from '../hooks/useMarketPulse';
import DualAxisChart from '../components/charts/DualAxisChart';
import RegionSelector from '../components/controls/RegionSelector';
import TimeScaleToggle from '../components/controls/TimeScaleToggle';
import CompareToggle from '../components/controls/CompareToggle';
import ViewModeToggle, { type ViewMode } from '../components/controls/ViewModeToggle';
import KpiCard from '../components/charts/KpiCard';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../theme/useTheme';
import { darkTheme, lightTheme } from '../theme/echarts-theme';
import { NEM_REGIONS, REGION_LABELS, type TimeScale } from '../api/types';
import type { EChartsOption } from 'echarts';
import './Pages.css';

const ALL_REGIONS = [...NEM_REGIONS, { id: 'WA', label: 'WA' }];
const NEM_COMPARE_REGIONS = NEM_REGIONS;

export default function PriceDemandPage() {
  const [searchParams] = useSearchParams();
  const validRegionIds = new Set(ALL_REGIONS.map(r => r.id));
  const rawRegion = searchParams.get('region') ?? 'NSW1';
  const initialRegion = validRegionIds.has(rawRegion) ? rawRegion : 'NSW1';
  const [region, setRegion] = useState<string>(initialRegion);
  const [timeScale, setTimeScale] = useState<TimeScale>('5MIN');
  const [compareEnabled, setCompareEnabled] = useState(false);
  const [regionB, setRegionB] = useState<string>('VIC1');
  const [viewMode, setViewMode] = useState<ViewMode>('overlay');
  const { theme } = useTheme();
  const t = theme === 'dark' ? darkTheme : lightTheme;

  const isWem = region === 'WA';

  // Derive effective compare state (WEM doesn't support compare)
  const effectiveCompare = compareEnabled && !isWem;

  // Derive effective regionB (auto-fix when it matches regionA)
  const effectiveRegionB = (effectiveCompare && regionB === region)
    ? (NEM_COMPARE_REGIONS.find(r => r.id !== region)?.id ?? regionB)
    : regionB;

  const handleRegionChange = (newRegion: string) => {
    setRegion(newRegion);
    const newIsWem = newRegion === 'WA';
    if (newIsWem) setCompareEnabled(false);
    if (compareEnabled && !newIsWem && regionB === newRegion) {
      const alt = NEM_COMPARE_REGIONS.find(r => r.id !== newRegion);
      if (alt) setRegionB(alt.id);
    }
  };

  const handleCompareChange = (enabled: boolean) => {
    setCompareEnabled(enabled);
    if (enabled && regionB === region) {
      const alt = NEM_COMPARE_REGIONS.find(r => r.id !== region);
      if (alt) setRegionB(alt.id);
    }
  };

  // NEM data (only fetch when not WA)
  const { data: nemData, isLoading: nemLoading, isError: nemError } = usePriceAndDemand(region, timeScale, !isWem);
  const { data: nemDataB, isLoading: nemLoadingB } = usePriceAndDemand(effectiveRegionB, timeScale, effectiveCompare);

  // WEM data (only fetch when WA)
  const { data: wemData, isLoading: wemLoading, isError: wemError } = useMarketPulse(isWem);

  const isLoading = isWem ? wemLoading : (nemLoading || (effectiveCompare && nemLoadingB));
  const isError = isWem ? wemError : nemError;

  // Derive chart data for Region A
  let categories: string[] = [];
  let prices: number[] = [];
  let demands: number[] = [];
  let chartTitle = '';

  if (isWem) {
    const pts = wemData ?? [];
    categories = pts.map(p => p.dt);
    prices = pts.map(p => p.price);
    demands = pts.map(p => p.actualTotalGeneration ?? p.forecastMw);
    chartTitle = 'WA (WEM) - Price & Generation';
  } else {
    const pts = Array.isArray(nemData) ? nemData : [];
    categories = pts.map(p => p.dt);
    prices = pts.map(p => p.rrp);
    demands = pts.map(p => p.totalDemand);
    const label = REGION_LABELS[region] ?? region;
    chartTitle = effectiveCompare
      ? `${label} vs ${REGION_LABELS[effectiveRegionB] ?? effectiveRegionB} - Price & Demand (${timeScale})`
      : `${label} - Price & Demand (${timeScale})`;
  }

  // Derive chart data for Region B
  let pricesB: number[] = [];
  let demandsB: number[] = [];
  if (effectiveCompare) {
    const ptsB = Array.isArray(nemDataB) ? nemDataB : [];
    pricesB = ptsB.map(p => p.rrp);
    demandsB = ptsB.map(p => p.totalDemand);
  }

  const latestPrice = prices.length > 0 ? prices[prices.length - 1] : 0;
  const latestDemand = demands.length > 0 ? demands[demands.length - 1] : 0;
  const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;

  const regionBOptions = NEM_COMPARE_REGIONS.filter(r => r.id !== region);
  const regionALabel = REGION_LABELS[region] ?? region;
  const regionBLabel = REGION_LABELS[effectiveRegionB] ?? effectiveRegionB;

  // WEM chart option
  const fmtTime = (val: string) => {
    const d = new Date(val);
    if (isNaN(d.getTime())) return val;
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  const wemOption: EChartsOption | null = isWem && wemData ? (() => {
    const pts = wemData;
    return {
      ...t,
      title: { text: chartTitle, ...t.title, left: 12, top: 8, textStyle: { ...t.title.textStyle, fontSize: 14 } },
      tooltip: { ...t.tooltip, trigger: 'axis' as const, axisPointer: { type: 'cross' as const } },
      legend: { ...t.legend, bottom: 0, data: ['Price ($/MWh)', 'Actual Gen (MW)', 'Forecast (MW)', 'Non-Sched Gen (MW)'] },
      grid: { left: 70, right: 70, top: 50, bottom: 55 },
      xAxis: {
        type: 'category' as const,
        data: pts.map(p => p.dt),
        ...t.categoryAxis,
        axisLabel: { ...t.categoryAxis.axisLabel, formatter: fmtTime },
        boundaryGap: false,
      },
      yAxis: [
        {
          type: 'value' as const, name: '$/MWh', position: 'left' as const,
          ...t.valueAxis, nameTextStyle: { color: t.valueAxis.axisLabel.color },
          axisLabel: { ...t.valueAxis.axisLabel, formatter: '${value}' },
        },
        {
          type: 'value' as const, name: 'MW', position: 'right' as const,
          ...t.valueAxis, nameTextStyle: { color: t.valueAxis.axisLabel.color },
          splitLine: { show: false },
        },
      ],
      series: [
        {
          name: 'Price ($/MWh)', type: 'line' as const, yAxisIndex: 0,
          data: pts.map(p => p.price), symbol: 'none',
          lineStyle: { width: 2 }, itemStyle: { color: '#f59e0b' },
        },
        {
          name: 'Actual Gen (MW)', type: 'line' as const, yAxisIndex: 1,
          data: pts.map(p => p.actualTotalGeneration), symbol: 'none',
          lineStyle: { width: 1.5 }, areaStyle: { opacity: 0.15 },
          itemStyle: { color: '#22c55e' }, connectNulls: false,
        },
        {
          name: 'Forecast (MW)', type: 'line' as const, yAxisIndex: 1,
          data: pts.map(p => p.forecastMw), symbol: 'none',
          lineStyle: { width: 1.5, type: 'dashed' as const },
          itemStyle: { color: '#3b82f6' },
        },
        {
          name: 'Non-Sched Gen (MW)', type: 'line' as const, yAxisIndex: 1,
          data: pts.map(p => p.actualNsgMw ?? p.forecastNsgMw), symbol: 'none',
          lineStyle: { width: 1 }, areaStyle: { opacity: 0.2 },
          itemStyle: { color: '#FFD565' },
        },
      ],
    };
  })() : null;

  const renderSplitChart = (
    cats: string[],
    pSeries: number[],
    dSeries: number[],
    label: string,
  ) => (
    <div className="comparison-panel card">
      <DualAxisChart
        title={`${label} - Price & Demand (${timeScale})`}
        categories={cats}
        priceSeries={pSeries}
        demandSeries={dSeries}
        height={380}
      />
    </div>
  );

  // For split mode, derive Region B categories separately
  const categoriesB = effectiveCompare
    ? (Array.isArray(nemDataB) ? nemDataB : []).map(p => p.dt)
    : [];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Price & Demand</h2>
        <div className="page-controls">
          <RegionSelector
            regions={ALL_REGIONS}
            selected={region}
            onChange={handleRegionChange}
          />
          {!isWem && <TimeScaleToggle selected={timeScale} onChange={setTimeScale} />}
          <CompareToggle
            enabled={compareEnabled}
            onChange={handleCompareChange}
            disabled={isWem}
          />
          {effectiveCompare && (
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

      <div className="kpi-grid kpi-grid-3">
        <KpiCard label="Current Price" value={latestPrice} unit="$/MWh" />
        <KpiCard label={isWem ? 'Current Gen' : 'Current Demand'} value={Math.round(latestDemand)} unit="MW" />
        <KpiCard label="Avg Price" value={Math.round(avgPrice * 100) / 100} unit="$/MWh" />
      </div>

      {isLoading ? (
        <div className="page-loading">Loading price & demand data...</div>
      ) : isError ? (
        <div className="page-loading page-error">Failed to load price & demand data.</div>
      ) : isWem && wemOption ? (
        <div className="card">
          <ReactECharts option={wemOption} style={{ height: 450 }} notMerge />
        </div>
      ) : effectiveCompare && viewMode === 'split' ? (
        <div className="comparison-split">
          {renderSplitChart(categories, prices, demands, regionALabel)}
          {renderSplitChart(categoriesB, pricesB, demandsB, regionBLabel)}
        </div>
      ) : (
        <div className="card">
          <DualAxisChart
            title={chartTitle}
            categories={categories}
            priceSeries={prices}
            demandSeries={demands}
            height={450}
            {...(effectiveCompare && {
              regionALabel,
              regionBLabel,
              regionAId: region,
              regionBId: effectiveRegionB,
              priceSeriesB: pricesB,
              demandSeriesB: demandsB,
            })}
          />
        </div>
      )}
    </div>
  );
}
