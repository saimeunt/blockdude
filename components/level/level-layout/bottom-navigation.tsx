import { useState, useEffect } from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
  Undo as UndoIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Redo as RedoIcon,
} from '@mui/icons-material';

import useContext from '../context/hook';

const CustomBottomNavigation = () => {
  const { state, undo, redo } = useContext();
  const pastMoves = state.pastMoves.flat();
  const futureMoves = state.futureMoves.flat();
  return (
    <BottomNavigation showLabels>
      <BottomNavigationAction
        disabled={pastMoves.length === 0}
        label="Undo"
        icon={<UndoIcon />}
        onClick={undo}
      />
      <BottomNavigationAction
        disabled
        label={`${pastMoves.length} move${pastMoves.length === 1 ? '' : 's'}`}
        icon={<DirectionsWalkIcon />}
      />
      <BottomNavigationAction
        disabled={futureMoves.length === 0}
        label="Redo"
        icon={<RedoIcon />}
        onClick={redo}
      />
    </BottomNavigation>
  );
};

export const useBottomNavigationHeight = () => {
  const [bottomNavigationHeight, setBottomNavigationHeight] = useState(0);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(([{ target: bottomNavigation }]) => {
      bottomNavigation && setBottomNavigationHeight(bottomNavigation.clientHeight);
    });
    const bottomNavigation = document.querySelector('.MuiBottomNavigation-root') as Element;
    resizeObserver.observe(bottomNavigation);
  }, []);
  return bottomNavigationHeight;
};

export default CustomBottomNavigation;
