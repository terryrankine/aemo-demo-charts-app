import ReactECharts from 'echarts-for-react';
import { useTheme } from '../../theme/useTheme';
import type { EChartsOption } from 'echarts';

interface Props {
  value: number;
  title?: string;
  size?: number;
}

export default function RenewableGauge({ value, title = 'Renewable Penetration', size = 250 }: Props) {
  const { theme } = useTheme();

  const color = value >= 60 ? '#22c55e' : value >= 30 ? '#f59e0b' : '#ef4444';

  const option: EChartsOption = {
    series: [{
      type: 'gauge',
      startAngle: 220,
      endAngle: -40,
      min: 0,
      max: 100,
      center: ['50%', '55%'],
      radius: '90%',
      progress: {
        show: true,
        width: 16,
        itemStyle: { color },
      },
      pointer: { show: false },
      axisLine: {
        lineStyle: {
          width: 16,
          color: [[1, theme === 'dark' ? '#1f2937' : '#e5e7eb']],
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: {
        offsetCenter: [0, '30%'],
        fontSize: 13,
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
      },
      detail: {
        offsetCenter: [0, '0%'],
        fontSize: 32,
        fontWeight: 700,
        color: theme === 'dark' ? '#e0e6ec' : '#111827',
        formatter: '{value}%',
      },
      data: [{ value: Math.round(value * 10) / 10, name: title }],
    }],
  };

  return <ReactECharts option={option} style={{ height: size, width: size }} notMerge />;
}
