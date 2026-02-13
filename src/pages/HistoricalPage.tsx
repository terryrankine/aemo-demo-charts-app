import { useState } from 'react';
import { useAnnualAveragePrices, useMonthlyAveragePrices } from '../hooks/useAveragePrices';
import DualAxisChart from '../components/charts/DualAxisChart';
import { REGION_COLORS } from '../theme/fuel-colors';
import { REGION_LABELS, type AveragePricePoint } from '../api/types';
import ReactECharts from 'echarts-for-react';
import { useTheme } from '../theme/useTheme';
import { darkTheme, lightTheme } from '../theme/echarts-theme';
import type { EChartsOption } from 'echarts';
import './Pages.css';

export default function HistoricalPage() {
  const { theme } = useTheme();
  const t = theme === 'dark' ? darkTheme : lightTheme;

  const now = new Date();
  const [year] = useState(now.getFullYear().toString());
  const [month] = useState((now.getMonth() + 1).toString());

  const { data: annual, isLoading: loadingAnnual, isError: errAnnual } = useAnnualAveragePrices();
  const { data: monthly, isLoading: loadingMonthly, isError: errMonthly } = useMonthlyAveragePrices(year, month);

  const isLoading = loadingAnnual || loadingMonthly;

  // Build annual chart - group by year, show each region as a line
  const annualData: AveragePricePoint[] = Array.isArray(annual) ? annual : [];
  const years = [...new Set(annualData.map((p: AveragePricePoint) => p.period))].sort();
  const regionIds = [...new Set(annualData.map((p: AveragePricePoint) => p.region))];

  const annualOption: EChartsOption = {
    ...t,
    title: { text: 'Annual Average Prices', ...t.title, left: 12, top: 8, textStyle: { ...t.title.textStyle, fontSize: 14 } },
    tooltip: { ...t.tooltip, trigger: 'axis' },
    legend: { ...t.legend, bottom: 0, data: regionIds.map((r: string) => REGION_LABELS[r] ?? r) },
    grid: { left: 60, right: 20, top: 50, bottom: 50 },
    xAxis: { type: 'category', data: years, ...t.categoryAxis },
    yAxis: {
      type: 'value',
      name: '$/MWh',
      ...t.valueAxis,
      nameTextStyle: { color: t.valueAxis.axisLabel.color },
    },
    series: regionIds.map((regionId: string) => ({
      name: REGION_LABELS[regionId] ?? regionId,
      type: 'line' as const,
      data: years.map((yr: string) => {
        const point = annualData.find((p: AveragePricePoint) =>
          p.period === yr && p.region === regionId
        );
        return point?.avgRrp ?? null;
      }),
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: REGION_COLORS[regionId] ?? '#888' },
    })),
  };

  const monthlyData: AveragePricePoint[] = Array.isArray(monthly) ? monthly : [];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Historical Prices</h2>
        <span className="page-subtitle">Average electricity prices over time</span>
      </div>

      {isLoading ? (
        <div className="page-loading">Loading historical data...</div>
      ) : (errAnnual || errMonthly) ? (
        <div className="page-loading page-error">Failed to load historical data.</div>
      ) : (
        <>
          <div className="card">
            {years.length > 0 ? (
              <ReactECharts option={annualOption} style={{ height: 400 }} notMerge />
            ) : (
              <p className="no-data">No annual data available</p>
            )}
          </div>

          {monthlyData.length > 0 && (
            <div className="card">
              <h3 className="card-title">Monthly Breakdown ({year})</h3>
              <DualAxisChart
                title=""
                categories={monthlyData.map((p: AveragePricePoint) => p.period)}
                priceSeries={monthlyData.map((p: AveragePricePoint) => p.avgRrp)}
                demandSeries={monthlyData.map((p: AveragePricePoint) => p.peakRrp ?? 0)}
                priceLabel="Avg $/MWh"
                demandLabel="Peak $/MWh"
                height={350}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
