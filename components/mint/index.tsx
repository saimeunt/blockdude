import { Box } from '@mui/material';
import { useIsClient } from 'usehooks-ts';

import EditorDrawer from './editor-drawer';
import EditorView from './editor-view';
import TestButton from './test-button';

const Mint = () => {
  const isClient = useIsClient();
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <EditorDrawer />
      {isClient && (
        <>
          <EditorView />
          <TestButton />
        </>
      )}
    </Box>
  );
};

export default Mint;
