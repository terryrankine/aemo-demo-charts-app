import './KpiCard.css';

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
  subtitle?: string;
}

export default function KpiCard({ label, value, unit, trend, color, subtitle }: Props) {
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  const isNegative = !isNaN(numValue) && numValue < 0;

  return (
    <div className="kpi-card" style={color ? { borderTopColor: color } : undefined}>
      <span className="kpi-label">{label}</span>
      <div className="kpi-value-row">
        <span className={`kpi-value ${isNegative ? 'negative' : ''}`}>
          {typeof value === 'number' ? value.toLocaleString('en-AU', { maximumFractionDigits: 2 }) : value}
        </span>
        {unit && <span className="kpi-unit">{unit}</span>}
        {trend && trend !== 'neutral' && (
          <span className={`kpi-trend ${trend}`}>
            {trend === 'up' ? '▲' : '▼'}
          </span>
        )}
      </div>
      {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
    </div>
  );
}
