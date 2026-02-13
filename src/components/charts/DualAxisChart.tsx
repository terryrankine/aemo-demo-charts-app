import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../theme/ThemeContext';
import { darkTheme, lightTheme } from '../../theme/echarts-theme';
import { REGION_COLORS } from '../../theme/fuel-colors';
import type { EChartsOption } from 'echarts';

interface Props {
  title?: string;
  categories: string[];
  priceSeries: number[];
  demandSeries: number[];
  height?: number;
  priceLabel?: string;
  demandLabel?: string;
  // Comparison props
  regionALabel?: string;
  regionBLabel?: string;
  regionAId?: string;
  regionBId?: string;
  priceSeriesB?: number[];
  demandSeriesB?: number[];
}

export default function DualAxisChart({
  title,
  categories,
  priceSeries,
  demandSeries,
  height = 400,
  priceLabel = 'Price ($/MWh)',
  demandLabel = 'Demand (MW)',
  regionALabel,
  regionBLabel,
  regionAId,
  regionBId,
  priceSeriesB,
  demandSeriesB,
}: Props) {
  const { theme } = useTheme();
  const t = theme === 'dark' ? darkTheme : lightTheme;

  const isComparing = priceSeriesB != null && regionALabel && regionBLabel;

  const colorA = regionAId ? (REGION_COLORS[regionAId] ?? '#f59e0b') : '#f59e0b';
  const colorB = regionBId ? (REGION_COLORS[regionBId] ?? '#3b82f6') : '#3b82f6';

  const seriesData: EChartsOption['series'] = isComparing
    ? [
        {
          name: `${regionALabel} Price`,
          type: 'line',
          data: priceSeries,
          symbol: 'none',
          lineStyle: { width: 2 },
          itemStyle: { color: colorA },
          yAxisIndex: 0,
        },
        {
          name: `${regionALabel} Demand`,
          type: 'line',
          data: demandSeries,
          symbol: 'none',
          areaStyle: { opacity: 0.15 },
          lineStyle: { width: 1.5 },
          itemStyle: { color: colorA },
          yAxisIndex: 1,
        },
        {
          name: `${regionBLabel} Price`,
          type: 'line',
          data: priceSeriesB,
          symbol: 'none',
          lineStyle: { width: 2, type: 'dashed' },
          itemStyle: { color: colorB },
          yAxisIndex: 0,
        },
        {
          name: `${regionBLabel} Demand`,
          type: 'line',
          data: demandSeriesB,
          symbol: 'none',
          areaStyle: { opacity: 0.10 },
          lineStyle: { width: 1.5, type: 'dashed' },
          itemStyle: { color: colorB },
          yAxisIndex: 1,
        },
      ]
    : [
        {
          name: priceLabel,
          type: 'line',
          data: priceSeries,
          symbol: 'none',
          lineStyle: { width: 2 },
          itemStyle: { color: '#f59e0b' },
          yAxisIndex: 0,
        },
        {
          name: demandLabel,
          type: 'line',
          data: demandSeries,
          symbol: 'none',
          areaStyle: { opacity: 0.15 },
          lineStyle: { width: 1.5 },
          itemStyle: { color: '#3b82f6' },
          yAxisIndex: 1,
        },
      ];

  const legendData = isComparing
    ? [`${regionALabel} Price`, `${regionALabel} Demand`, `${regionBLabel} Price`, `${regionBLabel} Demand`]
    : [priceLabel, demandLabel];

  const option: EChartsOption = {
    ...t,
    title: title ? { text: title, ...t.title, left: 12, top: 8, textStyle: { ...t.title.textStyle, fontSize: 14 } } : undefined,
    tooltip: {
      ...t.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'cross' },
    },
    legend: {
      ...t.legend,
      bottom: 0,
      data: legendData,
    },
    grid: {
      left: 70,
      right: 70,
      top: title ? 50 : 30,
      bottom: isComparing ? 70 : 50,
    },
    xAxis: {
      type: 'category',
      data: categories,
      ...t.categoryAxis,
      axisLabel: {
        ...t.categoryAxis.axisLabel,
        formatter: (val: string) => {
          const d = new Date(val);
          return isNaN(d.getTime()) ? val : `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        },
      },
      boundaryGap: false,
    },
    yAxis: [
      {
        type: 'value',
        name: priceLabel,
        position: 'left',
        ...t.valueAxis,
        nameTextStyle: { color: t.valueAxis.axisLabel.color },
        axisLabel: {
          ...t.valueAxis.axisLabel,
          formatter: '${value}',
        },
      },
      {
        type: 'value',
        name: demandLabel,
        position: 'right',
        ...t.valueAxis,
        nameTextStyle: { color: t.valueAxis.axisLabel.color },
        splitLine: { show: false },
      },
    ],
    series: seriesData,
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
}
