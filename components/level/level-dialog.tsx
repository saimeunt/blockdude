import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useRouter } from 'next/router';

import useContext from './context/hook';
import { NextLinkComposed } from '../lib/link';

const LevelDialog = () => {
  const { state } = useContext();
  const router = useRouter();
  const pastMoves = state.pastMoves.flat();
  const editMode = router.asPath === '/levels/editor';
  return (
    <Dialog open={state.dialogOpen}>
      <DialogTitle>Well done!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You completed the level in {pastMoves.length} move
          {pastMoves.length === 1 ? '' : 's'}.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button component={NextLinkComposed} to={editMode ? '/mint' : '/levels'}>
          Back to {editMode ? 'mint' : 'level list'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LevelDialog;
