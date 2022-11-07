import { useEffect } from 'react';
import { Box, Fab } from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useTimeout, useWindowSize, useIsClient, useUpdateEffect } from 'usehooks-ts';
// import { Color } from 'three';
// import { Canvas } from '@react-three/fiber';

import useContext from './context/hook';
import { useAppBarHeight } from '../lib/app-bar';
import { useBottomNavigationHeight } from './level-layout/bottom-navigation';
import ScrollView from '../lib/scroll-view';
import KeyboardHandler from './keyboard-handler';
import LevelView from './level-view';
import levels from '../../lib/levels';
import { isFinished } from './context/level-state';
import LevelDialog from './level-dialog';
import { LevelData } from '../../lib/types';
import { NextLinkComposed } from '../lib/link';
// import { Dude } from '../lib/mesh';

const editorLevelData = (): LevelData | undefined => {
  if (typeof window === 'undefined') {
    return;
  }
  const levelDataString = localStorage.getItem('levelData');
  if (levelDataString === null) {
    return;
  }
  return JSON.parse(levelDataString);
};

const GameView = () => {
  const router = useRouter();
  const {
    state: { level, zoom, autoScroll },
    loadLevel,
    levelLoaded,
    openDialog,
  } = useContext();
  const appBarHeight = useAppBarHeight();
  const bottomNavigationHeight = useBottomNavigationHeight();
  const cellSize = 8 * zoom;
  // const maxHorizontalCells = Math.min(level.width, 99);
  // const maxVerticalCells = Math.min(level.height, 99);
  const { id: levelId } = router.query;
  useEffect(() => {
    const levelData =
      levelId === 'editor' ? editorLevelData() : levels.find(({ id }) => id === levelId);
    if (!levelData) {
      return;
    }
    loadLevel(levelData);
  }, [levelId]);
  useTimeout(openDialog, isFinished(level) ? 200 : null);
  useTimeout(levelLoaded, level.loaded ? null : 400);
  const windowDimensions = useWindowSize();
  const horizontalCells = Math.min(Math.floor(windowDimensions.width / cellSize), level.width);
  const width = horizontalCells * cellSize;
  const verticalCells = Math.min(
    Math.floor((windowDimensions.height - appBarHeight - bottomNavigationHeight) / cellSize),
    level.height,
  );
  const height = verticalCells * cellSize;
  const isClient = useIsClient();
  useUpdateEffect(() => {
    if (!autoScroll) {
      return;
    }
    const { x, y } = level.dude.position;
    const scrollView = document.getElementById('scroll-view') as HTMLDivElement;
    scrollView.scrollTo({
      left: x * 8 * zoom - width / 2,
      top: y * 8 * zoom - height / 2,
      behavior: level.loaded ? 'smooth' : 'auto',
    });
  }, [level, zoom, level.loaded, width, height]);
  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ScrollView width={width} height={height}>
        <LevelView />
      </ScrollView>
      {isClient && <KeyboardHandler />}
      <LevelDialog />
      {router.asPath === '/levels/editor' && (
        <Fab
          sx={{ position: 'absolute', right: 8, bottom: 8 }}
          color="primary"
          aria-label="edit"
          component={NextLinkComposed}
          to="/mint"
        >
          <EditIcon />
        </Fab>
      )}
    </Box>
  );
};

export default GameView;
