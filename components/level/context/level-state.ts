import { produceWithPatches, Patch, applyPatches } from 'immer';

import { LevelData, Position, Direction } from '../../../lib/types';
import { indexToPosition, positionToIndex, decodeLevelData } from '../../../lib/utils';
import { CellAction, ControlAction } from './reducer';

type BlockState = { id: number; position: Position; lifted: boolean; falling: boolean };

const defaultBlockState = (): BlockState => ({
  id: 0,
  position: { x: 0, y: 0 },
  lifted: false,
  falling: false,
});

type DudeState = {
  position: Position;
  direction: Direction;
  falling: boolean;
};

const defaultDudeState = (): DudeState => ({
  position: { x: -1, y: -1 },
  direction: Direction.RIGHT,
  falling: false,
});

export type LevelState = {
  width: number;
  height: number;
  bricks: boolean[];
  blocks: BlockState[];
  door: Position;
  dude: DudeState;
  loaded: boolean;
};

export const defaultLevelState = (): LevelState => ({
  width: 0,
  height: 0,
  bricks: [],
  blocks: [],
  door: { x: 0, y: 0 },
  dude: defaultDudeState(),
  loaded: false,
});

export const findBlockAt = (position: Position, { blocks }: LevelState) =>
  blocks.find(({ position: { x, y } }) => x === position.x && y === position.y);

const isCellBlock = (position: Position, level: LevelState) => {
  const block = findBlockAt(position, level);
  return Boolean(block);
};

export const isCellEmpty = (position: Position, level: LevelState) => {
  const index = positionToIndex(position, level.width);
  if (level.bricks[index]) {
    return false;
  }
  return !isCellBlock(position, level);
};

export const getLiftedBlock = ({ blocks }: LevelState) => blocks.find(({ lifted }) => lifted);

export const getFallingBlock = ({ blocks }: LevelState) => blocks.find(({ falling }) => falling);

export const isFinished = ({ dude, door }: LevelState) =>
  dude.position.x === door.x && dude.position.y === door.y;

export const loadLevel = (level: LevelData) => {
  const { bricks, blocks, door, dude } = decodeLevelData(level);
  return {
    ...defaultLevelState(),
    width: level.width,
    height: level.height,
    bricks,
    blocks: blocks.map((block, index) => ({
      ...defaultBlockState(),
      id: index,
      position: block,
    })),
    door,
    dude: {
      ...defaultDudeState(),
      position: dude,
    },
  };
};

export const turn = produceWithPatches((draft: LevelState, direction: Direction) => {
  const { dude } = draft;
  dude.direction = direction;
});

export const canMove = (level: LevelState, direction: Direction) => {
  const nextPosition = { ...level.dude.position, x: level.dude.position.x + direction };
  return isCellEmpty(nextPosition, level);
};

export const move = produceWithPatches(
  (draft: LevelState, direction: Direction, applyGravity = false) => {
    const { dude } = draft;
    dude.direction = direction;
    dude.position.x += direction;
    const belowPosition = { ...dude.position, y: dude.position.y + 1 };
    dude.falling = isCellEmpty(belowPosition, draft);
    const aheadBlockPosition = { ...dude.position, y: dude.position.y - 1 };
    const block = getLiftedBlock(draft);
    if (block) {
      if (!isCellEmpty(aheadBlockPosition, draft)) {
        block.position = { x: dude.position.x - dude.direction, y: dude.position.y - 1 };
        block.lifted = false;
        const belowBlockPosition = { ...block.position, y: block.position.y + 1 };
        block.falling = isCellEmpty(belowBlockPosition, draft);
      } else {
        block.position = { ...dude.position, y: dude.position.y - 1 };
      }
    }
    if (applyGravity) {
      gravity(draft);
    }
  },
);

export const gravity = (level: LevelState) => {
  while (level.dude.falling) {
    fallOnce(level);
  }
  while (getFallingBlock(level)) {
    blockFallOnce(level);
  }
};

export const fallOnce = (level: LevelState) => {
  const { dude } = level;
  dude.position.y += 1;
  const belowPosition = { ...dude.position, y: dude.position.y + 1 };
  dude.falling = isCellEmpty(belowPosition, level);
  const block = getLiftedBlock(level);
  if (block) {
    block.position = { ...dude.position, y: dude.position.y - 1 };
  }
};

export const canClimb = (level: LevelState) => {
  const { dude } = level;
  const aheadPosition = { ...dude.position, x: dude.position.x + dude.direction };
  const nextPosition = { x: dude.position.x + dude.direction, y: dude.position.y - 1 };
  const upperPosition = { ...dude.position, y: dude.position.y - 1 };
  const upperNextPosition = { x: dude.position.x + dude.direction, y: dude.position.y - 2 };
  const block = getLiftedBlock(level);
  return (
    !isCellEmpty(aheadPosition, level) &&
    isCellEmpty(nextPosition, level) &&
    (block ? isCellEmpty(upperNextPosition, level) : isCellEmpty(upperPosition, level))
  );
};

export const climb = produceWithPatches((draft: LevelState) => {
  const { dude } = draft;
  dude.position.x += dude.direction;
  dude.position.y -= 1;
  const block = getLiftedBlock(draft);
  if (block) {
    block.position = { ...dude.position, y: dude.position.y - 1 };
  }
});

export const canLiftBlock = (level: LevelState) => {
  const { dude } = level;
  if (getLiftedBlock(level)) {
    return false;
  }
  const blockPosition = { ...dude.position, x: dude.position.x + dude.direction };
  const blockUpperPosition = { x: dude.position.x + dude.direction, y: dude.position.y - 1 };
  const upperPosition = { ...dude.position, y: dude.position.y - 1 };
  return (
    isCellBlock(blockPosition, level) &&
    isCellEmpty(blockUpperPosition, level) &&
    isCellEmpty(upperPosition, level)
  );
};

export const liftBlock = produceWithPatches((draft: LevelState) => {
  const { dude } = draft;
  const blockPosition = { ...dude.position, x: dude.position.x + dude.direction };
  const block = findBlockAt(blockPosition, draft);
  if (!block) {
    return;
  }
  block.position = { ...dude.position, y: dude.position.y - 1 };
  block.lifted = true;
});

export const canDropBlock = (level: LevelState) => {
  const { dude } = level;
  if (!getLiftedBlock(level)) {
    return false;
  }
  const aheadBlockPosition = { x: dude.position.x + dude.direction, y: dude.position.y - 1 };
  return isCellEmpty(aheadBlockPosition, level);
};

export const dropBlock = produceWithPatches((draft: LevelState, applyGravity = false) => {
  const { dude } = draft;
  const block = getLiftedBlock(draft);
  if (!block) {
    return;
  }
  block.position = { x: dude.position.x + dude.direction, y: dude.position.y - 1 };
  block.lifted = false;
  const belowBlockPosition = { ...block.position, y: block.position.y + 1 };
  block.falling = isCellEmpty(belowBlockPosition, draft);
  if (applyGravity) {
    gravity(draft);
  }
});

export const blockFallOnce = (level: LevelState) => {
  const block = getFallingBlock(level);
  if (!block) {
    return;
  }
  block.position.y += 1;
  const belowPosition = { ...block.position, y: block.position.y + 1 };
  block.falling = isCellEmpty(belowPosition, level);
};

export const performAction = (level: LevelState, action: ControlAction, applyGravity = false) => {
  switch (action.type) {
    case 'TURN': {
      return turn(level, action.payload.direction);
    }
    case 'MOVE': {
      return move(level, action.payload.direction, applyGravity);
    }
    case 'CLIMB': {
      return climb(level);
    }
    case 'LIFT_BLOCK': {
      return liftBlock(level);
    }
    case 'DROP_BLOCK': {
      return dropBlock(level, applyGravity);
    }
  }
};

type CellData = {
  actions: CellAction[];
  patches: Patch[];
  inversePatches: Patch[];
};

export const getValidMoves = (level: LevelState, cellData: CellData) => {
  const result = new Map<number, CellData>();
  if (level.dude.falling /* || getFallingBlock(level)*/) {
    return result;
  }
  const canMoveDirection = (direction: Direction) => {
    if (canMove(level, direction)) {
      const [levelAfterMove, movePatches, moveInversePatches] = move(level, direction);
      if (levelAfterMove.dude.falling) {
        const [levelAfterFall, fallPatches, fallInversePatches] = move(level, direction, true);
        result.set(positionToIndex(levelAfterFall.dude.position, level.width), {
          actions: [
            ...cellData.actions,
            { type: 'GRAVITY' },
            { type: 'MOVE', payload: { direction } },
          ],
          patches: [...cellData.patches, ...fallPatches],
          inversePatches: [...fallInversePatches, ...cellData.inversePatches],
        });
      } else {
        result.set(positionToIndex(levelAfterMove.dude.position, level.width), {
          actions: [...cellData.actions, { type: 'MOVE', payload: { direction } }],
          patches: [...cellData.patches, ...movePatches],
          inversePatches: [...moveInversePatches, ...cellData.inversePatches],
        });
      }
    } else {
      const [levelAfterTurn, turnPatches = [], turnInversePatches = []] =
        level.dude.direction !== direction ? turn(level, direction) : [level];
      if (canClimb(levelAfterTurn)) {
        const [levelAfterClimb, climbPatches, climbInversePatches] = climb(levelAfterTurn);
        result.set(positionToIndex(levelAfterClimb.dude.position, level.width), {
          actions: [
            ...cellData.actions,
            level.dude.direction !== direction && {
              type: 'TURN',
              payload: { direction },
            },
            { type: 'CLIMB' },
          ].filter((action): action is ControlAction => Boolean(action)),
          patches: [...cellData.patches, ...turnPatches, ...climbPatches],
          inversePatches: [
            ...climbInversePatches,
            ...turnInversePatches,
            ...cellData.inversePatches,
          ],
        });
      }
    }
  };
  canMoveDirection(Direction.RIGHT);
  canMoveDirection(Direction.LEFT);
  const block = getLiftedBlock(level);
  if (block && canDropBlock(level)) {
    const [, dropBlockPatches, dropBlockInversePatches] = dropBlock(level, true);
    result.set(
      positionToIndex({ ...level.dude.position, y: level.dude.position.y - 1 }, level.width),
      {
        actions: [...cellData.actions, { type: 'DROP_BLOCK' }],
        patches: [...cellData.patches, ...dropBlockPatches],
        inversePatches: [...dropBlockInversePatches, ...cellData.inversePatches],
      },
    );
  } else if (canLiftBlock(level)) {
    const [, liftBlockPatches, liftBlockInversePatches] = liftBlock(level);
    result.set(
      positionToIndex(
        { ...level.dude.position, x: level.dude.position.x + level.dude.direction },
        level.width,
      ),
      {
        actions: [...cellData.actions, { type: 'LIFT_BLOCK' }],
        patches: [...cellData.patches, ...liftBlockPatches],
        inversePatches: [...liftBlockInversePatches, ...cellData.inversePatches],
      },
    );
  }
  const [levelAfterTurn, turnPatches, turnInversePatches] = turn(level, -level.dude.direction);
  if (canLiftBlock(levelAfterTurn)) {
    const [, liftBlockPatches, liftBlockInversePatches] = liftBlock(levelAfterTurn);
    result.set(
      positionToIndex(
        {
          ...levelAfterTurn.dude.position,
          x: levelAfterTurn.dude.position.x + levelAfterTurn.dude.direction,
        },
        level.width,
      ),
      {
        actions: [
          ...cellData.actions,
          { type: 'TURN', payload: { direction: levelAfterTurn.dude.direction } },
          { type: 'LIFT_BLOCK' },
        ],
        patches: [...cellData.patches, ...turnPatches, ...liftBlockPatches],
        inversePatches: [
          ...liftBlockInversePatches,
          ...turnInversePatches,
          ...cellData.inversePatches,
        ],
      },
    );
  }
  return result;
};

export const getAccessibleCells = (level: LevelState) => {
  const openCells = getValidMoves(level, { actions: [], patches: [], inversePatches: [] });
  const closedCells = new Map<number, CellData>([
    [
      positionToIndex(level.dude.position, level.width),
      { actions: [], patches: [], inversePatches: [] },
    ],
  ]);
  while (openCells.size > 0) {
    const [[openCellIndex, openCellData]] = openCells.entries();
    closedCells.set(openCellIndex, openCellData);
    openCells.delete(openCellIndex);
    const nextLevel = applyPatches(level, openCellData.patches);
    const validMoves = getValidMoves(nextLevel, openCellData);
    for (const [validMoveIndex, validMoveData] of validMoves.entries()) {
      const lastAction = openCellData.actions.at(-1);
      if (
        !closedCells.has(validMoveIndex) &&
        lastAction &&
        !['LIFT_BLOCK', 'DROP_BLOCK'].includes(lastAction.type) &&
        // !nextLevel.dude.falling &&
        !isFinished(nextLevel)
      ) {
        openCells.set(validMoveIndex, validMoveData);
      }
    }
  }
  closedCells.delete(positionToIndex(level.dude.position, level.width));
  return Array.from(closedCells.entries()).map(([index, { actions, patches, inversePatches }]) => ({
    position: indexToPosition(index, level.width),
    actions,
    patches,
    inversePatches,
  }));
};
