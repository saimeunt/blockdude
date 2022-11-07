import { chunk } from 'lodash';

import { TileType, LevelData } from '../../../lib/types';
import { stringToLevelData } from '../../../lib/utils';

export type LevelEditorState = {
  width: number;
  height: number;
  tiles: TileType[];
};

export const MAX_WIDTH = 32;
export const MAX_HEIGHT = 32;

const initializeTiles = (width: number, height: number) => {
  const result = new Array<TileType>(MAX_WIDTH * MAX_HEIGHT).fill(TileType.BRICK);
  for (let i = 1; i < height - 1; i++) {
    result.fill(TileType.EMPTY, i * MAX_WIDTH + 1, i * MAX_WIDTH + width - 1);
  }
  return result;
};

export const initialLevelEditorState = () => ({
  width: 20,
  height: 8,
  tiles: initializeTiles(20, 8),
});

export const defaultLevelEditorState = () =>
  typeof window !== 'undefined' && localStorage.getItem('levelEditorState') !== null
    ? JSON.parse(localStorage.getItem('levelEditorState') as string)
    : initialLevelEditorState();

export const getTiles = (level: LevelEditorState) => {
  const result = [];
  for (let i = 0; i < level.height; i++) {
    result.push(...level.tiles.slice(i * MAX_WIDTH, i * MAX_WIDTH + level.width));
  }
  return result;
};

export const isTestable = (level: LevelEditorState) => {
  const tiles = getTiles(level);
  const doorIndex = tiles.indexOf(TileType.DOOR);
  const dudeIndex = tiles.indexOf(TileType.DUDE);
  return doorIndex !== -1 && dudeIndex !== -1;
};

const toLevelData = (level: LevelEditorState): LevelData => {
  const tiles = getTiles(level);
  const levelString = chunk(tiles, level.width)
    .map((row) =>
      row
        .map((tile) => {
          const tileToChar = {
            [TileType.EMPTY]: ' ',
            [TileType.BRICK]: 'B',
            [TileType.BLOCK]: 'O',
            [TileType.DOOR]: 'G',
            [TileType.DUDE]: 'D',
          };
          return tileToChar[tile];
        })
        .join(''),
    )
    .join('\n');
  return {
    id: 'editor',
    title: 'Editor level',
    description: 'Editor level',
    ...stringToLevelData(levelString),
  };
};

export const saveLevelData = (level: LevelEditorState) => {
  const levelData = toLevelData(level);
  localStorage.setItem('levelData', JSON.stringify(levelData));
};
