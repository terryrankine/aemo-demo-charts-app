import './Controls.css';

export type ViewMode = 'overlay' | 'split';

interface Props {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({ mode, onChange }: Props) {
  return (
    <div className="control-group" role="radiogroup" aria-label="View mode">
      <button
        className={`control-btn ${mode === 'overlay' ? 'active' : ''}`}
        role="radio"
        aria-checked={mode === 'overlay'}
        onClick={() => onChange('overlay')}
      >
        Overlay
      </button>
      <button
        className={`control-btn ${mode === 'split' ? 'active' : ''}`}
        role="radio"
        aria-checked={mode === 'split'}
        onClick={() => onChange('split')}
      >
        Split
      </button>
    </div>
  );
}
