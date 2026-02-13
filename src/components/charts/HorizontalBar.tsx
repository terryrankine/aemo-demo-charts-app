import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../theme/ThemeContext';
import { darkTheme, lightTheme } from '../../theme/echarts-theme';
import type { EChartsOption } from 'echarts';

export interface BarItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  title?: string;
  items: BarItem[];
  height?: number;
  unit?: string;
  // Comparison props
  regionALabel?: string;
  regionBLabel?: string;
  regionAColor?: string;
  regionBColor?: string;
  itemsB?: BarItem[];
}

export default function HorizontalBar({
  title,
  items,
  height,
  unit = 'MW',
  regionALabel,
  regionBLabel,
  regionAColor,
  regionBColor,
  itemsB,
}: Props) {
  const { theme } = useTheme();
  const t = theme === 'dark' ? darkTheme : lightTheme;

  const isComparing = itemsB != null && regionALabel && regionBLabel;

  if (isComparing) {
    // Union all fuel types from both regions, sorted by max value
    const mapA = new Map(items.map(i => [i.name, i]));
    const mapB = new Map(itemsB!.map(i => [i.name, i]));
    const allNames = [...new Set([...mapA.keys(), ...mapB.keys()])];

    const merged = allNames.map(name => ({
      name,
      valueA: mapA.get(name)?.value ?? 0,
      valueB: mapB.get(name)?.value ?? 0,
      color: mapA.get(name)?.color ?? mapB.get(name)?.color ?? '#888',
    })).sort((a, b) => Math.max(b.valueA, b.valueB) - Math.max(a.valueA, a.valueB));

    const calcHeight = height ?? Math.max(200, merged.length * 48 + 80);

    const option: EChartsOption = {
      ...t,
      title: title ? { text: title, ...t.title, left: 12, top: 8, textStyle: { ...t.title.textStyle, fontSize: 14 } } : undefined,
      tooltip: {
        ...t.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const arr = Array.isArray(params) ? params : [params];
          let html = `<strong>${arr[0]?.name}</strong><br/>`;
          for (const p of arr) {
            html += `${p.marker} ${p.seriesName}: ${p.value.toLocaleString()} ${unit}<br/>`;
          }
          return html;
        },
      },
      legend: {
        ...t.legend,
        bottom: 0,
        data: [regionALabel!, regionBLabel!],
      },
      grid: {
        left: 110,
        right: 80,
        top: title ? 40 : 10,
        bottom: 40,
      },
      xAxis: {
        type: 'value',
        ...t.valueAxis,
        axisLabel: {
          ...t.valueAxis.axisLabel,
          formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`,
        },
      },
      yAxis: {
        type: 'category',
        data: merged.map(i => i.name),
        ...t.categoryAxis,
        inverse: true,
        axisLabel: {
          ...t.categoryAxis.axisLabel,
          fontSize: 12,
        },
      },
      series: [
        {
          name: regionALabel!,
          type: 'bar',
          data: merged.map(i => i.valueA),
          barWidth: '35%',
          itemStyle: { color: regionAColor ?? '#4A90D9' },
          label: {
            show: true,
            position: 'right',
            formatter: (p: any) => p.value > 0 ? `${p.value.toLocaleString()} ${unit}` : '',
            color: t.textStyle.color,
            fontSize: 10,
          },
        },
        {
          name: regionBLabel!,
          type: 'bar',
          data: merged.map(i => i.valueB),
          barWidth: '35%',
          itemStyle: { color: regionBColor ?? '#E74C3C', opacity: 0.7 },
          label: {
            show: true,
            position: 'right',
            formatter: (p: any) => p.value > 0 ? `${p.value.toLocaleString()} ${unit}` : '',
            color: t.textStyle.color,
            fontSize: 10,
          },
        },
      ],
    };

    return <ReactECharts option={option} style={{ height: calcHeight }} notMerge />;
  }

  // Default single-region mode
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const calcHeight = height ?? Math.max(200, sorted.length * 36 + 60);

  const option: EChartsOption = {
    ...t,
    title: title ? { text: title, ...t.title, left: 12, top: 8, textStyle: { ...t.title.textStyle, fontSize: 14 } } : undefined,
    tooltip: {
      ...t.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const p = Array.isArray(params) ? params[0] : params;
        return `${p.name}: ${p.value.toLocaleString()} ${unit}`;
      },
    },
    grid: {
      left: 110,
      right: 30,
      top: title ? 40 : 10,
      bottom: 10,
    },
    xAxis: {
      type: 'value',
      ...t.valueAxis,
      axisLabel: {
        ...t.valueAxis.axisLabel,
        formatter: (val: number) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : `${val}`,
      },
    },
    yAxis: {
      type: 'category',
      data: sorted.map(i => i.name),
      ...t.categoryAxis,
      inverse: true,
      axisLabel: {
        ...t.categoryAxis.axisLabel,
        fontSize: 12,
      },
    },
    series: [{
      type: 'bar',
      data: sorted.map(i => ({
        value: i.value,
        itemStyle: { color: i.color },
      })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
        formatter: (p: any) => `${p.value.toLocaleString()} ${unit}`,
        color: t.textStyle.color,
        fontSize: 11,
      },
    }],
  };

  return <ReactECharts option={option} style={{ height: calcHeight }} notMerge />;
}
