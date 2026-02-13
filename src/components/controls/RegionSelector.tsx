import './Controls.css';

interface Props {
  regions: { id: string; label: string }[];
  selected: string;
  onChange: (id: string) => void;
}

export default function RegionSelector({ regions, selected, onChange }: Props) {
  return (
    <div className="control-group" role="radiogroup" aria-label="Region selector">
      {regions.map(({ id, label }) => (
        <button
          key={id}
          className={`control-btn ${selected === id ? 'active' : ''}`}
          onClick={() => onChange(id)}
          role="radio"
          aria-checked={selected === id}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
