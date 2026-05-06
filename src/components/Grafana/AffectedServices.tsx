import React from 'react';
import { SERVICES } from '../../data/services';
import { Sparkline } from './Sparkline';

const DEPLOY_IDX = 14; // index where deploy starts in spark arrays

export function AffectedServices() {
  return (
    <div className="section-block">
      <div className="section-header">
        <span className="section-title">Affected Services</span>
        <span style={{ fontSize: 11, color: 'var(--gf-text-secondary)' }}>
          4 services · derived from service graph
        </span>
      </div>
      <div className="services-table">
        <div className="services-table__header">
          <span>Service</span>
          <span>Owner</span>
          <span>Current error rate</span>
          <span>Predicted error rate</span>
          <span>Trend</span>
        </div>
        {SERVICES.map((svc) => {
          const multiplier = (svc.predicted / svc.current).toFixed(0);
          return (
            <div className="services-table__row" key={svc.name}>
              <span className="service-name">{svc.name}</span>
              <span className="service-owner">{svc.owner}</span>
              <span className="service-rate--current">{svc.current.toFixed(2)}%</span>
              <div className="service-rate--predicted">
                <span className="rate-value">{svc.predicted.toFixed(2)}%</span>
                <span className="rate-delta">▲ {multiplier}×</span>
              </div>
              <Sparkline
                values={svc.spark}
                deployIdx={DEPLOY_IDX}
                width={160}
                height={36}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
