import React from 'react';
import { Icon } from '../Icon';

export function GrafanaTopNav() {
  const navItems = [
    { name: 'home', label: 'Home', active: false },
    { name: 'dashboards', label: 'Dashboards', active: false },
    { name: 'explore', label: 'Explore', active: false },
    { name: 'alerting', label: 'Alerting', active: true },
    { name: 'connections', label: 'Connections', active: false },
    { name: 'admin', label: 'Administration', active: false },
  ];

  return (
    <div className="gf-nav">
      <div className="gf-nav__logo" aria-label="Grafana">
        <Icon name="grafana-logo" size={28} />
      </div>
      {navItems.map((item) => (
        <button
          key={item.name}
          className={`gf-nav__item${item.active ? ' gf-nav__item--active' : ''}`}
          aria-label={item.label}
          aria-current={item.active ? 'page' : undefined}
          onClick={() => {}}
        >
          <Icon name={item.name} size={18} color="currentColor" />
        </button>
      ))}
    </div>
  );
}
