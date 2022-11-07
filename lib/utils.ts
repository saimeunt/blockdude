import { chunk } from 'lodash';

import { LevelData, Position } from './types';

export const isKthBitSet = (n: number, k: number) => (n & (1 << (k - 1))) > 0;

export const indexToPosition = (index: number, width: number): Position => ({
  x: index % width,
  y: Math.floor(index / width),
});

export const positionToIndex = ({ x, y }: Position, width: number) => y * width + x;

export const decodeLevelData = (level: LevelData) => {
  const bricks = new Array<boolean>(level.width * level.height);
  const blockWidth = level.width / 8;
  for (let i = 0; i < level.bricks.length; i++) {
    const bricksChunks = level.bricks[i];
    for (let k = 8; k >= 1; k--) {
      const x = (i % blockWidth) * 8 + 8 - k;
      const y = Math.floor(i / blockWidth);
      bricks[positionToIndex({ x, y }, level.width)] = isKthBitSet(bricksChunks, k);
    }
  }
  return {
    bricks,
    blocks: level.blocks.map((block) => indexToPosition(block, level.width)),
    door: indexToPosition(level.door, level.width),
    dude: indexToPosition(level.dude, level.width),
  };
};

export const stringToLevelData = (
  levelDataString: string,
): Omit<LevelData, 'id' | 'title' | 'description'> => {
  const levelDataRows = levelDataString.split('\n');
  const height = levelDataRows.length;
  const width = levelDataRows[0].length;
  const levelDataReplaced = levelDataString.replaceAll('\n', '');
  const bricks = chunk(Array.from(levelDataReplaced), 8).map((levelDataChunk) => {
    const byte = levelDataChunk.map((cell) => (cell === 'B' ? '1' : '0')).join('');
    return Number(`0b${byte.padEnd(8, '0')}`);
  });
  return {
    width,
    height,
    bricks,
    dude: levelDataReplaced.indexOf('D'),
    blocks: Array.from(levelDataReplaced.matchAll(/O/g)).map(({ index }) => index || 0),
    door: levelDataReplaced.indexOf('G'),
  };
};
