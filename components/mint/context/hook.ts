import { useContext } from 'react';

import { Position, TileType } from '../../../lib/types';
import Context from '.';

const Hook = () => {
  const { state, dispatch } = useContext(Context);
  const setTool = (tool: TileType) => dispatch({ type: 'SET_TOOL', payload: { tool } });
  const setTile = (position: Position) => dispatch({ type: 'SET_TILE', payload: { position } });
  const setLevelWidth = (width: number) =>
    dispatch({ type: 'SET_LEVEL_WIDTH', payload: { width } });
  const setLevelHeight = (height: number) =>
    dispatch({ type: 'SET_LEVEL_HEIGHT', payload: { height } });
  const zoomIn = () => dispatch({ type: 'ZOOM_IN' });
  const zoomOut = () => dispatch({ type: 'ZOOM_OUT' });
  const openResetDialog = () => dispatch({ type: 'OPEN_RESET_DIALOG' });
  const closeResetDialog = () => dispatch({ type: 'CLOSE_RESET_DIALOG' });
  const reset = () => dispatch({ type: 'RESET' });
  const saveLevelData = () => dispatch({ type: 'SAVE_LEVEL_DATA' });
  return {
    state,
    setTool,
    setTile,
    setLevelWidth,
    setLevelHeight,
    zoomIn,
    zoomOut,
    openResetDialog,
    closeResetDialog,
    reset,
    saveLevelData,
  };
};

export default Hook;
