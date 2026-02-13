import type { FuelMixPeriod } from '../../api/types';
import './Controls.css';

const PERIODS: { id: FuelMixPeriod; label: string }[] = [
  { id: 'CURRENT', label: 'Current' },
  { id: '24H', label: '24h' },
  { id: '48H', label: '48h' },
  { id: '3M', label: '3 Months' },
  { id: '12M', label: '12 Months' },
];

interface Props {
  selected: FuelMixPeriod;
  onChange: (period: FuelMixPeriod) => void;
}

export default function TimeRangePicker({ selected, onChange }: Props) {
  return (
    <div className="control-group">
      {PERIODS.map(({ id, label }) => (
        <button
          key={id}
          className={`control-btn ${selected === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
