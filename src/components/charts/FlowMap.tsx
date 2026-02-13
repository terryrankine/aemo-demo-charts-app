import { useNavigate } from 'react-router-dom';
import type { ElecSummaryRegion, InterconnectorFlow } from '../../api/types';
import './FlowMap.css';

interface Props {
  regions: ElecSummaryRegion[];
  interconnectors: InterconnectorFlow[];
}

// Layout positions for NEM regions (relative %)
const REGION_POS: Record<string, { x: number; y: number }> = {
  QLD1: { x: 72, y: 12 },
  NSW1: { x: 68, y: 35 },
  VIC1: { x: 55, y: 60 },
  SA1:  { x: 25, y: 48 },
  TAS1: { x: 60, y: 85 },
};

function priceColor(price: number): string {
  if (price < 0) return '#ef4444';
  if (price < 30) return '#22c55e';
  if (price < 100) return '#f59e0b';
  if (price < 300) return '#f97316';
  return '#ef4444';
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function formatMW(mw: number): string {
  return `${Math.abs(mw).toLocaleString()} MW`;
}

export default function FlowMap({ regions, interconnectors }: Props) {
  const navigate = useNavigate();

  const regionMap = new Map(regions.map(r => [r.region, r]));

  return (
    <div className="flow-map">
      <svg viewBox="0 0 100 100" className="flow-map-svg" role="img" aria-label="NEM interconnector flow map showing power transfers between regions">
        {/* Interconnector lines */}
        {interconnectors.map((ic) => {
          const from = REGION_POS[ic.exportRegion];
          const to = REGION_POS[ic.importRegion];
          if (!from || !to) return null;

          const flow = ic.mwFlow;
          const absFlow = Math.abs(flow);
          const strokeWidth = Math.max(0.3, Math.min(1.5, absFlow / 500));

          // Arrow goes in direction of flow
          const sx = flow >= 0 ? from.x : to.x;
          const sy = flow >= 0 ? from.y : to.y;
          const ex = flow >= 0 ? to.x : from.x;
          const ey = flow >= 0 ? to.y : from.y;

          return (
            <g key={ic.interconnectorId}>
              <line
                x1={sx} y1={sy}
                x2={ex} y2={ey}
                stroke="#4b5563"
                strokeWidth={strokeWidth}
                strokeDasharray="2 1"
                className="flow-line"
              />
              {/* Flow label at midpoint */}
              <text
                x={(sx + ex) / 2}
                y={(sy + ey) / 2 - 1.5}
                textAnchor="middle"
                className="flow-label"
                fontSize="2.2"
              >
                {formatMW(absFlow)}
              </text>
              {/* Arrow indicator */}
              <text
                x={(sx + ex) / 2}
                y={(sy + ey) / 2 + 2}
                textAnchor="middle"
                className="flow-label"
                fontSize="2.5"
              >
                {flow >= 0 ? '→' : '←'}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Region nodes as HTML overlays */}
      {Object.entries(REGION_POS).map(([regionId, pos]) => {
        const region = regionMap.get(regionId);
        if (!region) return null;

        return (
          <div
            key={regionId}
            className="region-node"
            role="button"
            tabIndex={0}
            aria-label={`View ${regionId.replace(/1$/, '')} price and demand details`}
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              borderColor: priceColor(region.price),
            }}
            onClick={() => navigate(`/price-demand?region=${regionId}`)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/price-demand?region=${regionId}`); } }}
          >
            <span className="region-name">{regionId.replace(/1$/, '')}</span>
            <span className="region-price" style={{ color: priceColor(region.price) }}>
              {formatPrice(region.price)}/MWh
            </span>
            <span className="region-demand">{formatMW(region.demand)}</span>
          </div>
        );
      })}
    </div>
  );
}
