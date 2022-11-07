import { Box } from '@mui/material';
import { useElementSize } from 'usehooks-ts';

import useContext from './context/hook';
import ScrollView from '../lib/scroll-view';
import LevelEditor from './level-editor';

const EditorView = () => {
  const {
    state: { level, zoom },
  } = useContext();
  const [editorViewRef, editorContainerSize] = useElementSize();
  const editorWidth = editorContainerSize.width ? editorContainerSize.width - 3 * 8 : 640;
  const editorHeight = editorContainerSize.height ? editorContainerSize.height - 3 * 8 : 480;
  return (
    <Box
      ref={editorViewRef}
      sx={{
        flexGrow: 1,
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ScrollView
        width={Math.min(editorWidth, level.width * 8 * zoom)}
        height={Math.min(editorHeight, level.height * 8 * zoom)}
      >
        <LevelEditor />
      </ScrollView>
    </Box>
  );
};

export default EditorView;
