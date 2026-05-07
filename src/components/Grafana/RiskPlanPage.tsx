import React from 'react';
import { GrafanaTopNav } from './GrafanaTopNav';
import { SidebarHistory } from './SidebarHistory';
import { PRHeader } from './PRHeader';
import { RiskCard } from './RiskCard';
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
  const isDone = phase === 'done';

  return (
    <div className="gf-page">
      <GrafanaTopNav />

      <div className="gf-workspace">
        <SidebarHistory />

        <div className="gf-main-panel">
          <div className="gf-plan">
            <PRHeader onFixAll={onFixAll} phase={phase} />

            <div className="gf-plan__body">
              {isDone && (
                <div className="gf-done-banner" role="alert">
                  <span style={{ fontSize: 16 }}>✓</span>
                  <span>
                    <strong>Remediation applied.</strong> PR #{' '}
                    updated · 4/4 risks mitigated · Predicted error rate: 4.8% → 0.3%
                  </span>
                </div>
              )}

              <div className="risk-cards-row">
                {RISKS.map((risk) => (
                  <RiskCard
                    key={risk.id}
                    risk={risk}
                    queued={fixedRisks.includes(risk.id) || isDone}
                    onFix={onFixRisk}
                  />
                ))}
              </div>

              <AffectedServices />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
