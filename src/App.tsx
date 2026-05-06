import React, { useReducer, useEffect } from 'react';
import { reducer, initialState } from './state';
import { Desktop } from './components/Desktop';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // R or Cmd+Shift+R to reset
      if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Only if not typing in an input
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          dispatch({ type: 'reset' });
        }
      }
      // Space to advance / skip
      if (e.key === ' ' && !e.metaKey && !e.ctrlKey) {
        if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
          e.preventDefault();
          // Advance phase on space
          if (state.phase === 'idle') dispatch({ type: 'start_typing' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.phase]);

  return <Desktop state={state} dispatch={dispatch} />;
}
