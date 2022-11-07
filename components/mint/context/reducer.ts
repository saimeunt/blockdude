import produce, { current } from 'immer';

import { Position, TileType } from '../../../lib/types';
import { positionToIndex } from '../../../lib/utils';
import {
  LevelEditorState,
  defaultLevelEditorState,
  initialLevelEditorState,
  saveLevelData,
  MAX_WIDTH,
  MAX_HEIGHT,
} from './level-editor-state';

export type Action =
  | { type: 'SET_TOOL'; payload: { tool: TileType } }
  | { type: 'SET_TILE'; payload: { position: Position } }
  | { type: 'SET_LEVEL_WIDTH'; payload: { width: number } }
  | { type: 'SET_LEVEL_HEIGHT'; payload: { height: number } }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'OPEN_RESET_DIALOG' }
  | { type: 'CLOSE_RESET_DIALOG' }
  | { type: 'RESET' }
  | { type: 'SAVE_LEVEL_DATA' };

export type State = {
  tool: TileType;
  level: LevelEditorState;
  zoom: number;
  resetDialogOpen: boolean;
};

export const defaultState = (): State => ({
  tool: TileType.EMPTY,
  level: defaultLevelEditorState(),
  zoom: 4,
  resetDialogOpen: false,
});

export const reducer = produce((draft: State, action: Action) => {
  switch (action.type) {
    case 'SET_TOOL': {
      draft.tool = action.payload.tool;
      break;
    }
    case 'SET_TILE': {
      const { x, y } = action.payload.position;
      if (x === 0 || y === 0 || x === draft.level.width - 1 || y === draft.level.height - 1) {
        break;
      }
      if ([TileType.DOOR, TileType.DUDE].includes(draft.tool)) {
        const index = draft.level.tiles.indexOf(draft.tool);
        if (index !== -1) {
          draft.level.tiles[index] = TileType.EMPTY;
        }
      }
      draft.level.tiles[positionToIndex({ x, y }, MAX_WIDTH)] = draft.tool;
      break;
    }
    case 'SET_LEVEL_WIDTH': {
      draft.level.width = action.payload.width;
      for (let i = 0; i < MAX_HEIGHT; i++) {
        draft.level.tiles.fill(
          TileType.BRICK,
          i * MAX_WIDTH + action.payload.width - 1,
          i * MAX_WIDTH + MAX_WIDTH,
        );
      }
      break;
    }
    case 'SET_LEVEL_HEIGHT': {
      draft.level.height = action.payload.height;
      for (let i = action.payload.height - 1; i < MAX_HEIGHT; i++) {
        draft.level.tiles.fill(TileType.BRICK, i * MAX_WIDTH, i * MAX_WIDTH + MAX_WIDTH);
      }
      break;
    }
    case 'ZOOM_IN': {
      draft.zoom++;
      break;
    }
    case 'ZOOM_OUT': {
      draft.zoom--;
      break;
    }
    case 'OPEN_RESET_DIALOG': {
      draft.resetDialogOpen = true;
      break;
    }
    case 'CLOSE_RESET_DIALOG': {
      draft.resetDialogOpen = false;
      break;
    }
    case 'RESET': {
      const { width, height, tiles } = initialLevelEditorState();
      draft.level.width = width;
      draft.level.height = height;
      draft.level.tiles = tiles;
      break;
    }
    case 'SAVE_LEVEL_DATA': {
      saveLevelData(draft.level);
    }
  }
  switch (action.type) {
    case 'SET_TILE':
    case 'SET_LEVEL_WIDTH':
    case 'SET_LEVEL_HEIGHT':
    case 'RESET': {
      localStorage.setItem('levelEditorState', JSON.stringify(current(draft.level)));
      break;
    }
  }
});
