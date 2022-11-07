import { useRef, useState } from 'react';
import { Box, SxProps, useTheme, alpha } from '@mui/material';
import { useEventListener } from 'usehooks-ts';

import { SpritePath } from '../lib/sprite';
import { TileType } from '../../lib/types';
import useContext from './context/hook';
import { indexToPosition } from '../../lib/utils';
import { getTiles } from './context/level-editor-state';

const LevelEditorView = () => {
  const {
    state: { level, zoom },
  } = useContext();
  return (
    <svg
      width={level.width * 8 * zoom}
      height={level.height * 8 * zoom}
      viewBox={`0 -0.5 ${level.width * 8} ${level.height * 8}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <SpritePath id="editor-brick" type="brick" />
        <SpritePath id="editor-block" type="block" />
        <SpritePath id="editor-door" type="door" />
        <SpritePath id="editor-dude" type="dude" />
      </defs>
      <rect width={level.width * 8 * zoom} height={level.height * 8 * zoom} fill="#fff" />
      {getTiles(level).map((tile, index) => {
        if (tile === TileType.EMPTY) {
          return null;
        }
        const tileToSprite = {
          [TileType.BRICK]: 'brick',
          [TileType.BLOCK]: 'block',
          [TileType.DOOR]: 'door',
          [TileType.DUDE]: 'dude',
        };
        const { x, y } = indexToPosition(index, level.width);
        return <use key={`${x} ${y}`} href={`#editor-${tileToSprite[tile]}`} x={x * 8} y={y * 8} />;
      })}
    </svg>
  );
};

const CursorOverlay = ({ sx }: { sx?: SxProps }) => {
  const {
    state: { tool, zoom },
  } = useContext();
  const theme = useTheme();
  return (
    <Box
      sx={{
        ...sx,
        position: 'absolute',
        pointerEvents: 'none',
        background: alpha(
          tool === TileType.EMPTY ? theme.palette.error.light : theme.palette.success.light,
          0.5,
        ),
        width: zoom * 8,
        height: zoom * 8,
      }}
    />
  );
};

const LevelEditor = () => {
  const {
    state: { level, zoom },
    setTile,
  } = useContext();
  const editorRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  useEventListener(
    'mousemove',
    (event) => {
      const x = Math.floor(event.offsetX / 8 / zoom);
      const y = Math.floor(event.offsetY / 8 / zoom);
      setLeft(x * 8 * zoom);
      setTop(y * 8 * zoom);
      if (event.buttons === 1) {
        setTile({ x, y });
      }
    },
    editorRef,
  );
  return (
    <Box
      ref={editorRef}
      sx={{
        position: 'relative',
        width: level.width * 8 * zoom,
        height: level.height * 8 * zoom,
        cursor: 'pointer',
        '& > .MuiBox-root': {
          visibility: 'hidden',
        },
        '&:hover > .MuiBox-root': {
          visibility: 'visible',
        },
      }}
      onClick={({ nativeEvent }) => {
        const x = Math.floor(nativeEvent.offsetX / 8 / zoom);
        const y = Math.floor(nativeEvent.offsetY / 8 / zoom);
        setTile({ x, y });
      }}
    >
      <CursorOverlay sx={{ left, top }} />
      <LevelEditorView />
    </Box>
  );
};

export default LevelEditor;
