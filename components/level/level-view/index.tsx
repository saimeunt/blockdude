import { Box } from '@mui/material';
import { useInterval, useTimeout } from 'usehooks-ts';

import useContext from '../context/hook';
import { isFinished, getFallingBlock, getAccessibleCells } from '../context/level-state';
import LevelBackground from './background';
import Block from './block';
import Door from './door';
import Dude from './dude';
import Cell from './cell';

const LevelView = () => {
  const {
    state: { level, actions, zoom },
    gravity,
    popAction,
  } = useContext();
  useTimeout(gravity, level.dude.falling || getFallingBlock(level) ? 50 : null);
  useInterval(popAction, actions.length > 0 ? 200 : null);
  return (
    <Box
      sx={{
        position: 'relative',
        width: level.width * 8 * zoom,
        height: level.height * 8 * zoom,
      }}
    >
      {level.loaded && (
        <>
          <LevelBackground />
          {level.blocks.map(({ id, position }) => (
            <Block key={id} position={position} />
          ))}
          <Door />
          <Dude />
          {actions.length === 0 &&
            !isFinished(level) &&
            getAccessibleCells(level).map(({ position, actions, patches, inversePatches }) => (
              <Cell
                key={`${position.x} ${position.y}`}
                position={position}
                actions={actions}
                patches={patches}
                inversePatches={inversePatches}
              />
            ))}
        </>
      )}
    </Box>
  );
};

export default LevelView;
