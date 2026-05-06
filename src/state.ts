export type Phase =
  | 'idle'
  | 'typing'
  | 'pushing'
  | 'pr_created'
  | 'scanning'
  | 'plan_open'
  | 'fixing'
  | 'done';

export type FocusedWindow = 'terminal' | 'browser';

export interface AppState {
  phase: Phase;
  focusedWindow: FocusedWindow;
  browserOpen: boolean;
  pushStep: number;         // 0-3, which git step is currently active
  pushDone: number[];       // indices of completed steps
  scanSpinner: boolean;
  scanDone: boolean;
  fixStep: number;          // 0-2, which remediation step is active
  fixDone: number[];        // indices of completed fix steps
  typedText: string;        // current typewriter progress
  fixedRisks: string[];     // risk ids that have been individually queued
}

export const initialState: AppState = {
  phase: 'idle',
  focusedWindow: 'terminal',
  browserOpen: false,
  pushStep: 0,
  pushDone: [],
  scanSpinner: false,
  scanDone: false,
  fixStep: 0,
  fixDone: [],
  typedText: '',
  fixedRisks: [],
};

export type Action =
  | { type: 'start_typing' }
  | { type: 'set_typed'; text: string }
  | { type: 'start_pushing'; command: string }
  | { type: 'push_step_done'; index: number }
  | { type: 'show_pr_box' }
  | { type: 'start_scanning' }
  | { type: 'scan_done' }
  | { type: 'open_browser' }
  | { type: 'close_browser' }
  | { type: 'focus_window'; window: FocusedWindow }
  | { type: 'fix_all_clicked' }
  | { type: 'fix_step_done'; index: number }
  | { type: 'done' }
  | { type: 'fix_risk'; id: string }
  | { type: 'reset' };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'start_typing':
      if (state.phase !== 'idle') return state;
      return { ...state, phase: 'typing', typedText: '' };

    case 'set_typed':
      return { ...state, typedText: action.text };

    case 'start_pushing':
      return { ...state, phase: 'pushing', typedText: action.command, pushStep: 0, pushDone: [] };

    case 'push_step_done':
      return {
        ...state,
        pushDone: [...state.pushDone, action.index],
        pushStep: action.index + 1,
      };

    case 'show_pr_box':
      return { ...state, phase: 'pr_created' };

    case 'start_scanning':
      return { ...state, phase: 'scanning', scanSpinner: true, scanDone: false };

    case 'scan_done':
      return { ...state, scanSpinner: false, scanDone: true };

    case 'open_browser':
      // Guard: only open if we're still in scanning/plan_open phase
      if (state.phase !== 'scanning' && state.phase !== 'plan_open') return state;
      return {
        ...state,
        phase: 'plan_open',
        browserOpen: true,
        focusedWindow: 'browser',
      };

    case 'close_browser':
      return { ...state, browserOpen: false, focusedWindow: 'terminal' };

    case 'focus_window':
      return { ...state, focusedWindow: action.window };

    case 'fix_all_clicked':
      return {
        ...state,
        phase: 'fixing',
        focusedWindow: 'terminal',
        fixStep: 0,
        fixDone: [],
      };

    case 'fix_step_done':
      return {
        ...state,
        fixDone: [...state.fixDone, action.index],
        fixStep: action.index + 1,
      };

    case 'done':
      return { ...state, phase: 'done' };

    case 'fix_risk':
      if (state.fixedRisks.includes(action.id)) return state;
      return { ...state, fixedRisks: [...state.fixedRisks, action.id] };

    case 'reset':
      return { ...initialState };

    default:
      return state;
  }
}
