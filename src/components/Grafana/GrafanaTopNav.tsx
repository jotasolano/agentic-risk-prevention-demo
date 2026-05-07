import React from 'react';
import grafanaLogo from '../../assets/grafana-logo.png';
import userAvatar from '../../assets/user-avatar.png';
import { PR } from '../../data/pr';

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 10.5 L14 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="12" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10.5 3.8L5.5 7.2M10.5 12.2L5.5 8.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 2a4.5 4.5 0 0 0-4.5 4.5c0 2.5-.8 3.5-1.5 4h12c-.7-.5-1.5-1.5-1.5-4A4.5 4.5 0 0 0 8 2Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M6.5 12.5a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M4 2.5L7.5 6 4 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const FULL_PR_TITLE = PR.title;
const TRUNCATED_PR_TITLE =
  FULL_PR_TITLE.length > 60 ? FULL_PR_TITLE.slice(0, 60) + '…' : FULL_PR_TITLE;

export function GrafanaTopNav() {
  return (
    <>
      {/* Top nav bar */}
      <nav className="gf-topnav" aria-label="Top navigation">
        <div className="gf-topnav__left">
          <button className="gf-topnav__hamburger" aria-label="Open menu">
            <span />
            <span />
            <span />
          </button>
          <img src={grafanaLogo} alt="Grafana" className="gf-topnav__logo" />
        </div>

        <div className="gf-topnav__center">
          <nav className="gf-topnav__breadcrumb" aria-label="Breadcrumb">
            <span className="gf-topnav__breadcrumb-item">Observability</span>
            <span className="gf-topnav__breadcrumb-sep" aria-hidden="true">
              <ChevronRight />
            </span>
            <span className="gf-topnav__breadcrumb-item">Risk workbench</span>
            <span className="gf-topnav__breadcrumb-sep" aria-hidden="true">
              <ChevronRight />
            </span>
            <span className="gf-topnav__breadcrumb-item" title={FULL_PR_TITLE}>
              {TRUNCATED_PR_TITLE}
            </span>
          </nav>
        </div>

        <div className="gf-topnav__right">
          <div className="gf-topnav__search" role="search" aria-label="Global search">
            <SearchIcon />
            <span>Search...</span>
            <span className="gf-topnav__search-kbd">⌘K</span>
          </div>

          <button className="gf-topnav__icon-btn" aria-label="Share">
            <ShareIcon />
          </button>
          <button className="gf-topnav__icon-btn" aria-label="Notifications">
            <BellIcon />
          </button>
          <img src={userAvatar} alt="User profile" className="gf-topnav__avatar" />
        </div>
      </nav>

      {/* Sub-nav */}
      <div className="gf-subnav" aria-label="Workspace navigation">
        <div className="gf-subnav__left">
          <button className="gf-subnav__workspace" aria-label="Workspace menu" aria-haspopup="true">
            Workspace
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M2 3.5L5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="gf-subnav__tab gf-subnav__tab--active" aria-current="page">
            Prevention plans
          </button>
          <button className="gf-subnav__tab">
            Search plans
          </button>
        </div>
        <div className="gf-subnav__right">
          <button className="gf-subnav__feedback">Send feedback</button>
          <span className="gf-subnav__preview-badge">PREVIEW</span>
        </div>
      </div>
    </>
  );
}
