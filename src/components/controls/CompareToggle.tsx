import './Controls.css';

interface Props {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export default function CompareToggle({ enabled, onChange, disabled }: Props) {
  return (
    <div className="control-group">
      <button
        className={`control-btn ${enabled ? 'active' : ''}`}
        onClick={() => onChange(!enabled)}
        disabled={disabled}
        aria-pressed={enabled}
        aria-label="Toggle region comparison"
        style={disabled ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
      >
        Compare
      </button>
    </div>
  );
}
