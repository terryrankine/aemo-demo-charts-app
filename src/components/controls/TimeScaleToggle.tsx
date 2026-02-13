import type { TimeScale } from '../../api/types';
import './Controls.css';

interface Props {
  selected: TimeScale;
  onChange: (scale: TimeScale) => void;
}

export default function TimeScaleToggle({ selected, onChange }: Props) {
  return (
    <div className="control-group">
      <button
        className={`control-btn ${selected === '5MIN' ? 'active' : ''}`}
        onClick={() => onChange('5MIN')}
      >
        5 Min
      </button>
      <button
        className={`control-btn ${selected === '30MIN' ? 'active' : ''}`}
        onClick={() => onChange('30MIN')}
      >
        30 Min
      </button>
    </div>
  );
}
