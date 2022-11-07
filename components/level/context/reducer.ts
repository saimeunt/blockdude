import produce, { enablePatches, Patch, applyPatches } from 'immer';
enablePatches();

import { LevelData, Direction } from '../../../lib/types';
import {
  LevelState,
  defaultLevelState,
  loadLevel,
  gravity,
  getFallingBlock,
  isFinished,
  performAction,
} from './level-state';

export type Action =
  | { type: 'LOAD_LEVEL'; payload: { levelData: LevelData } }
  | { type: 'LEVEL_LOADED' }
  | { type: 'TURN'; payload: { direction: Direction } }
  | { type: 'MOVE'; payload: { direction: Direction } }
  | { type: 'GRAVITY' }
  | { type: 'CLIMB' }
  | { type: 'LIFT_BLOCK' }
  | { type: 'DROP_BLOCK' }
  | {
      type: 'PUSH_ACTIONS';
      payload: { actions: ControlAction[]; patches: Patch[]; inversePatches: Patch[] };
    }
  | { type: 'POP_ACTION' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'OPEN_DIALOG' }
  | { type: 'CLOSE_DIALOG' };

export type CellAction = Extract<
  Action,
  { type: 'TURN' | 'MOVE' | 'CLIMB' | 'LIFT_BLOCK' | 'DROP_BLOCK' | 'GRAVITY' }
>;

export type ControlAction = Exclude<CellAction, { type: 'GRAVITY' }>;

type Patches = {
  patches: Patch[];
  inversePatches: Patch[];
};

export type State = {
  level: LevelState;
  currentPatch: number;
  patches: Patches[];
  actions: ControlAction[];
  zoom: number;
  dialogOpen: boolean;
  pastMoves: (ControlAction | ControlAction[])[];
  futureMoves: (ControlAction | ControlAction[])[];
  autoScroll: boolean;
};

export const defaultState = (): State => ({
  level: defaultLevelState(),
  currentPatch: -1,
  patches: [],
  actions: [],
  zoom: 8,
  dialogOpen: false,
  pastMoves: [],
  futureMoves: [],
  autoScroll: false,
});

export const canControl = ({ level, actions }: State) =>
  level.loaded &&
  actions.length === 0 &&
  !level.dude.falling &&
  !getFallingBlock(level) &&
  !isFinished(level);

export const reducer = produce((draft: State, action: Action) => {
  switch (action.type) {
    case 'LOAD_LEVEL': {
      draft.level = loadLevel(action.payload.levelData);
      draft.currentPatch = -1;
      draft.patches = [];
      draft.autoScroll = true;
      break;
    }
    case 'LEVEL_LOADED': {
      draft.level.loaded = true;
      draft.autoScroll = false;
      break;
    }
    case 'TURN':
    case 'MOVE':
    case 'CLIMB':
    case 'LIFT_BLOCK':
    case 'DROP_BLOCK': {
      const [levelState] = performAction(draft.level, action);
      const [, patches, inversePatches] = performAction(draft.level, action, true);
      draft.level = levelState;
      draft.currentPatch++;
      draft.patches[draft.currentPatch] = { patches, inversePatches };
      draft.pastMoves.push(action);
      draft.futureMoves = [];
      draft.autoScroll = true;
      break;
    }
    case 'GRAVITY': {
      gravity(draft.level);
      break;
    }
    case 'PUSH_ACTIONS': {
      const { actions, patches, inversePatches } = action.payload;
      draft.actions = actions;
      draft.currentPatch++;
      draft.patches[draft.currentPatch] = { patches, inversePatches };
      draft.pastMoves.push(actions);
      draft.futureMoves = [];
      draft.autoScroll = false;
      break;
    }
    case 'POP_ACTION': {
      const nextAction = draft.actions.shift();
      if (!nextAction) {
        break;
      }
      const [levelState] = performAction(draft.level, nextAction);
      draft.level = levelState;
      break;
    }
    case 'UNDO': {
      if (draft.currentPatch < 0) {
        break;
      }
      const undoPatches = draft.patches[draft.currentPatch];
      draft.currentPatch--;
      draft.level = applyPatches(draft.level, undoPatches.inversePatches);
      const previousAction = draft.pastMoves.pop();
      if (previousAction) {
        draft.futureMoves.unshift(previousAction);
      }
      break;
    }
    case 'REDO': {
      if (draft.currentPatch === draft.patches.length - 1) {
        break;
      }
      draft.currentPatch++;
      const redoPatches = draft.patches[draft.currentPatch];
      draft.level = applyPatches(draft.level, redoPatches.patches);
      const nextAction = draft.futureMoves.shift();
      if (nextAction) {
        draft.pastMoves.push(nextAction);
      }
      break;
    }
    case 'OPEN_DIALOG': {
      draft.dialogOpen = true;
      break;
    }
    case 'CLOSE_DIALOG': {
      draft.dialogOpen = false;
      break;
    }
  }
});
