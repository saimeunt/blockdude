import { IconButton, useTheme, alpha } from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowOutward as ArrowOutwardIcon,
  Launch as LaunchIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { findLast } from 'lodash';
import { Patch } from 'immer';

import { Direction, Position } from '../../../lib/types';
import { CellAction, ControlAction, canControl } from '../context/reducer';
import useContext from '../context/hook';

const CellIcon = ({ position, actions }: { position: Position; actions: CellAction[] }) => {
  const {
    state: { level },
  } = useContext();
  const iconStyle = { transition: 'transform 200ms' };
  const lastAction = actions.at(-1);
  if (!lastAction) {
    return null;
  }
  const findLastTurnOrMoveAction = () =>
    findLast(actions, ({ type }) => ['TURN', 'MOVE'].includes(type)) as
      | Extract<ControlAction, { type: 'TURN' | 'MOVE' }>
      | undefined;
  switch (lastAction.type) {
    case 'LIFT_BLOCK': {
      const lastTurnOrMoveAction = findLastTurnOrMoveAction();
      if (lastTurnOrMoveAction) {
        const {
          payload: { direction },
        } = lastTurnOrMoveAction;
        return (
          <LaunchIcon
            sx={{
              ...iconStyle,
              transform: direction === Direction.RIGHT ? 'scale(-1, 1)' : 'none',
            }}
          />
        );
      }
      return (
        <LaunchIcon
          sx={{
            ...iconStyle,
            transform: level.dude.direction === Direction.RIGHT ? 'scale(-1, 1)' : 'none',
          }}
        />
      );
    }
    case 'DROP_BLOCK': {
      const lastTurnOrMoveAction = findLastTurnOrMoveAction();
      if (lastTurnOrMoveAction) {
        const {
          payload: { direction },
        } = lastTurnOrMoveAction;
        return (
          <LaunchIcon
            sx={{
              ...iconStyle,
              transform: direction === Direction.RIGHT ? 'scale(1, -1)' : 'scale(-1, -1)',
            }}
          />
        );
      }
      return (
        <LaunchIcon
          sx={{
            ...iconStyle,
            transform: level.dude.direction === Direction.RIGHT ? 'scale(1, -1)' : 'scale(-1, -1)',
          }}
        />
      );
    }
    case 'MOVE': {
      if (level.door.x === position.x && level.door.y === position.y) {
        return (
          <LoginIcon
            sx={{
              ...iconStyle,
              transform: lastAction.payload.direction === Direction.RIGHT ? 'none' : 'scale(-1, 1)',
            }}
          />
        );
      }
      const secondToLastAction = actions.at(-2);
      if (secondToLastAction && secondToLastAction.type === 'GRAVITY') {
        return (
          <ArrowOutwardIcon
            sx={{
              ...iconStyle,
              transform:
                lastAction.payload.direction === Direction.LEFT ? 'scale(-1, -1)' : 'scale(1, -1)',
            }}
          />
        );
      }
      return (
        <ArrowForwardIcon
          sx={{
            ...iconStyle,
            transform: lastAction.payload.direction === Direction.LEFT ? 'scale(-1, 1)' : 'none',
          }}
        />
      );
    }
    case 'CLIMB': {
      if (level.door.x === position.x && level.door.y === position.y) {
        return (
          <LoginIcon
            sx={{
              ...iconStyle,
              transform: level.dude.position.x < position.x ? 'scale(-1, 1)' : 'none',
            }}
          />
        );
      }
      const lastTurnOrMoveAction = findLastTurnOrMoveAction();
      if (lastTurnOrMoveAction) {
        const {
          payload: { direction },
        } = lastTurnOrMoveAction;
        return (
          <ArrowOutwardIcon
            sx={{
              ...iconStyle,
              transform: direction === Direction.LEFT ? 'scale(-1, 1)' : 'none',
            }}
          />
        );
      }
      return (
        <ArrowOutwardIcon
          sx={{
            ...iconStyle,
            transform: level.dude.direction === Direction.LEFT ? 'scale(-1, 1)' : 'none',
          }}
        />
      );
    }
    default: {
      return null;
    }
  }
};

const Cell = ({
  position,
  actions,
  patches,
  inversePatches,
}: {
  position: Position;
  actions: CellAction[];
  patches: Patch[];
  inversePatches: Patch[];
}) => {
  const theme = useTheme();
  const { state, pushActions } = useContext();
  const { zoom } = state;
  return (
    <IconButton
      color="success"
      onClick={() => {
        if (!canControl(state)) {
          return;
        }
        if (actions.length > 0) {
          pushActions(
            actions.filter((action): action is ControlAction => action.type !== 'GRAVITY'),
            patches,
            inversePatches,
          );
        }
      }}
      sx={{
        position: 'absolute',
        left: position.x * 8 * zoom + 2,
        top: position.y * 8 * zoom + 2,
        width: 8 * zoom - 4,
        height: 8 * zoom - 4,
        backgroundColor: alpha(theme.palette.success.light, 0.15),
        zIndex: 2,
        '&:hover': {
          backgroundColor: alpha(theme.palette.success.light, 0.3),
        },
      }}
    >
      <CellIcon position={position} actions={actions} />
    </IconButton>
  );
};

export default Cell;
