import { Fab } from '@mui/material';
import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';

import useContext from './context/hook';
import { isTestable } from './context/level-editor-state';

const TestButton = () => {
  const {
    state: { level },
    saveLevelData,
  } = useContext();
  const router = useRouter();
  return (
    <Fab
      sx={{ position: 'absolute', right: 8, bottom: 8 }}
      color="primary"
      aria-label="play"
      disabled={!isTestable(level)}
      onClick={() => {
        saveLevelData();
        router.push('/levels/editor');
      }}
    >
      <PlayArrowIcon />
    </Fab>
  );
};

export default TestButton;
