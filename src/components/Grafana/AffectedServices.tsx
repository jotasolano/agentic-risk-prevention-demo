import React from 'react';
import { SERVICES } from '../../data/services';
import { Sparkline } from './Sparkline';

const DEPLOY_IDX = 14;

// Env subtitles derived from service name + owner
const SERVICE_ENV: Record<string, string> = {
  'search-api':    'prod-us-east-3·search-prod-017',
  'dashboard-api': 'prod-us-east-3·dash-prod-042',
  'redis-cache':   'prod-us-east-3·redis-prod-008',
};

// Technology icon colors per service (two icons each)
const TECH_COLORS: Record<string, [string, string]> = {
  'search-api':    ['#00b4d8', '#3d71d9'],
  'dashboard-api': ['#3d71d9', '#00b4d8'],
  'redis-cache':   ['#e02f44', '#ff9830'],
};

export function AffectedServices() {
  const displayServices = SERVICES.slice(0, 3);

  return (
    <div className="services-section">
      <div className="services-table-new" role="table" aria-label="Affected services">
        <div className="services-table-new__header" role="row">
          <span role="columnheader">Service name</span>
          <span role="columnheader">Technology</span>
          <span role="columnheader">Predicted error</span>
          <span role="columnheader" />
        </div>
        {displayServices.map((svc) => {
          const colors = TECH_COLORS[svc.name] ?? ['#00b4d8', '#3d71d9'];
          const envLabel = SERVICE_ENV[svc.name] ?? `prod-us-east-3·${svc.name}`;
          return (
            <div className="services-table-new__row" key={svc.name} role="row">
              {/* Service name */}
              <div className="service-name-cell" role="cell">
                <span className="service-name-link">{svc.name}</span>
                <span className="service-env">{envLabel}</span>
              </div>

              {/* Technology icons */}
              <div role="cell">
                <div className="service-tech-icons">
                  <span
                    className="service-tech-icon"
                    style={{ background: colors[0] }}
                    aria-hidden="true"
                  />
                  <span
                    className="service-tech-icon"
                    style={{ background: colors[1] }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Predicted error rate */}
              <div className="service-predicted" role="cell">
                {(svc.predicted * 100).toFixed(2)} s
              </div>

              {/* Sparkline */}
              <div role="cell" aria-label={`Error rate trend for ${svc.name}`}>
                <Sparkline
                  values={svc.spark}
                  deployIdx={DEPLOY_IDX}
                  width={180}
                  height={36}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
