import './Controls.css';

export type ViewMode = 'overlay' | 'split';

interface Props {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewModeToggle({ mode, onChange }: Props) {
  return (
    <div className="control-group">
      <button
        className={`control-btn ${mode === 'overlay' ? 'active' : ''}`}
        onClick={() => onChange('overlay')}
      >
        Overlay
      </button>
      <button
        className={`control-btn ${mode === 'split' ? 'active' : ''}`}
        onClick={() => onChange('split')}
      >
        Split
      </button>
    </div>
  );
}
