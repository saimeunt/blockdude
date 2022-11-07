export type Position = { x: number; y: number };

export type LevelData = {
  id: string;
  title: string;
  description: string;
  width: number;
  height: number;
  bricks: number[];
  blocks: number[];
  door: number;
  dude: number;
};

export enum Direction {
  LEFT = -1,
  RIGHT = 1,
}

export enum TileType {
  EMPTY,
  BRICK,
  BLOCK,
  DOOR,
  DUDE,
}
