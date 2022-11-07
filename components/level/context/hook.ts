import { useContext } from 'react';
import { Patch } from 'immer';

import Context from '.';
import { ControlAction } from './reducer';
import { LevelData, Direction } from '../../../lib/types';

const Hook = () => {
  const { state, dispatch } = useContext(Context);
  const loadLevel = (levelData: LevelData) =>
    dispatch({ type: 'LOAD_LEVEL', payload: { levelData } });
  const levelLoaded = () => dispatch({ type: 'LEVEL_LOADED' });
  const turn = (direction: Direction) => dispatch({ type: 'TURN', payload: { direction } });
  const move = (direction: Direction) => dispatch({ type: 'MOVE', payload: { direction } });
  const gravity = () => dispatch({ type: 'GRAVITY' });
  const climb = () => dispatch({ type: 'CLIMB' });
  const liftBlock = () => dispatch({ type: 'LIFT_BLOCK' });
  const dropBlock = () => dispatch({ type: 'DROP_BLOCK' });
  const pushActions = (actions: ControlAction[], patches: Patch[], inversePatches: Patch[]) =>
    dispatch({ type: 'PUSH_ACTIONS', payload: { actions, patches, inversePatches } });
  const popAction = () => dispatch({ type: 'POP_ACTION' });
  const undo = () => dispatch({ type: 'UNDO' });
  const redo = () => dispatch({ type: 'REDO' });
  const openDialog = () => dispatch({ type: 'OPEN_DIALOG' });
  const closeDialog = () => dispatch({ type: 'CLOSE_DIALOG' });
  return {
    state,
    loadLevel,
    levelLoaded,
    turn,
    move,
    gravity,
    climb,
    liftBlock,
    dropBlock,
    pushActions,
    popAction,
    undo,
    redo,
    openDialog,
    closeDialog,
  };
};

export default Hook;
