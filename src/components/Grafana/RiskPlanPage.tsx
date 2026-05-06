import React, { useState } from 'react';
import { GrafanaTopNav } from './GrafanaTopNav';
import { PRHeader } from './PRHeader';
import { RiskCard } from './RiskCard';
import { PastIncidentsList } from './PastIncidentsList';
import { AffectedServices } from './AffectedServices';
import { RISKS } from '../../data/risks';
import '../../styles/grafana.css';

interface RiskPlanPageProps {
  onFixAll: () => void;
  fixedRisks: string[];
  onFixRisk: (id: string) => void;
  phase: string;
}

export function RiskPlanPage({ onFixAll, fixedRisks, onFixRisk, phase }: RiskPlanPageProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = ['All', 'Critical', 'High', 'Medium'];

  const filteredRisks = RISKS.filter((r) => {
    if (activeFilter === 'All') return true;
    return r.severity.toLowerCase() === activeFilter.toLowerCase();
  });

  const isDone = phase === 'done';

  return (
    <div className="gf-page">
      <GrafanaTopNav />

      <div className="gf-main">
        {/* Breadcrumb */}
        <div className="gf-breadcrumb">
          <span>Home</span>
          <span className="gf-breadcrumb__sep">/</span>
          <span>Risk Prevention</span>
          <span className="gf-breadcrumb__sep">/</span>
          <span className="gf-breadcrumb__current">PR #1247</span>
        </div>

        {/* Page content */}
        <div className="gf-content">
          {/* PR Header */}
          <PRHeader onFixAll={onFixAll} phase={phase} />

          {/* Done banner */}
          {isDone && (
            <div style={{
              background: 'rgba(86,166,75,0.12)',
              border: '1px solid rgba(86,166,75,0.3)',
              borderRadius: 2,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 13,
              color: 'var(--gf-green)',
            }}>
              <span style={{ fontSize: 16 }}>✓</span>
              <span>
                <strong>Remediation applied.</strong> PR #1247 updated · 4/4 risks mitigated · Predicted error rate: 4.8% → 0.3%
              </span>
            </div>
          )}

          {/* Identified Risks */}
          <div className="section-block">
            <div className="section-header">
              <span className="section-title">Identified Risks</span>
              <div className="filter-pills" role="group" aria-label="Filter risks by severity">
                {filters.map((f) => (
                  <button
                    key={f}
                    className={`filter-pill${activeFilter === f ? ' filter-pill--active' : ''}`}
                    onClick={() => setActiveFilter(f)}
                    aria-pressed={activeFilter === f}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="risks-grid">
              {filteredRisks.map((risk) => (
                <RiskCard
                  key={risk.id}
                  risk={risk}
                  queued={fixedRisks.includes(risk.id) || isDone}
                  onFix={onFixRisk}
                />
              ))}
            </div>
          </div>

          {/* Past Incidents */}
          <PastIncidentsList />

          {/* Affected Services */}
          <AffectedServices />

          {/* Footer */}
          <div className="gf-footer">
            <span>Plan generated 24s ago</span>
            <span className="gf-footer__sep">·</span>
            <span>grafana-risk-agent v0.4.1</span>
            <span className="gf-footer__sep">·</span>
            <span>ephemeral</span>
            <span className="gf-footer__sep">·</span>
            <span>expires in 7 days</span>
            <span className="gf-footer__sep">·</span>
            <button className="gf-footer__resync" onClick={() => {}}>Resync</button>
          </div>
        </div>
      </div>
    </div>
  );
}
