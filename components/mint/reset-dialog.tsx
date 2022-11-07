import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

import useContext from './context/hook';

const ResetDialog = () => {
  const {
    state: { resetDialogOpen },
    closeResetDialog,
    reset,
  } = useContext();
  return (
    <Dialog
      open={resetDialogOpen}
      onClose={closeResetDialog}
      aria-labelledby="reset-dialog-title"
      aria-describedby="reset-dialog-description"
    >
      <DialogTitle id="reset-dialog-title">Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText id="reset-dialog-description">
          This action will reset your level.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeResetDialog} autoFocus>
          Cancel
        </Button>
        <Button
          onClick={() => {
            reset();
            closeResetDialog();
          }}
        >
          Reset
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResetDialog;
