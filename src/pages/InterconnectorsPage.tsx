import { useElecSummary } from '../hooks/useElecSummary';
import FlowMap from '../components/charts/FlowMap';
import { REGION_LABELS, type InterconnectorFlow } from '../api/types';
import './Pages.css';

export default function InterconnectorsPage() {
  const { data: summary, isLoading, isError } = useElecSummary();

  const regions = summary?.regions ?? [];
  const interconnectors = summary?.interconnectors ?? [];

  return (
    <div className="page">
      <div className="page-header">
        <h2>Interconnector Flows</h2>
        <span className="page-subtitle">Live power flow between NEM regions</span>
      </div>

      {isLoading ? (
        <div className="page-loading">Loading interconnector data...</div>
      ) : isError ? (
        <div className="page-loading page-error">Failed to load interconnector data.</div>
      ) : (
        <>
          <div className="card flow-map-large">
            <FlowMap regions={regions} interconnectors={interconnectors} />
          </div>

          <h3 className="section-title">Interconnector Details</h3>
          <div className="ic-table">
            <table>
              <thead>
                <tr>
                  <th>Interconnector</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Flow (MW)</th>
                  <th>Export Limit</th>
                  <th>Import Limit</th>
                  <th>Utilisation</th>
                </tr>
              </thead>
              <tbody>
                {interconnectors.map((ic: InterconnectorFlow) => {
                  const absFlow = Math.abs(ic.mwFlow ?? 0);
                  const limit = Math.max(
                    Math.abs(ic.exportLimit ?? 0),
                    Math.abs(ic.importLimit ?? 0),
                    1
                  );
                  const utilPct = (absFlow / limit) * 100;

                  return (
                    <tr key={ic.interconnectorId}>
                      <td className="ic-name">{ic.interconnectorId}</td>
                      <td>{REGION_LABELS[ic.exportRegion] ?? ic.exportRegion}</td>
                      <td>{REGION_LABELS[ic.importRegion] ?? ic.importRegion}</td>
                      <td className={ic.mwFlow >= 0 ? 'positive' : 'negative'}>
                        {(ic.mwFlow ?? 0).toFixed(0)} MW
                      </td>
                      <td>{(ic.exportLimit ?? 0).toFixed(0)} MW</td>
                      <td>{(ic.importLimit ?? 0).toFixed(0)} MW</td>
                      <td>
                        <div className="util-bar">
                          <div
                            className="util-fill"
                            style={{
                              width: `${Math.min(utilPct, 100)}%`,
                              backgroundColor: utilPct > 90 ? '#ef4444' : utilPct > 70 ? '#f59e0b' : '#22c55e',
                            }}
                          />
                          <span>{utilPct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
