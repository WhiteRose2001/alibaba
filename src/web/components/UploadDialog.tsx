import React, { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Snackbar, Stack, Typography } from '@mui/material';

type Props = {
  open: boolean;
  onClose: () => void;
  handleUpload: (uploadedFile: File | null, userId: number) => Promise<void>;
  currentUserId: number;
};

export default function UploadDialog({
  open,
  onClose,
  currentUserId,
  handleUpload,
}: Props) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  // const [desc, setDesc] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 350,
        },
      }}
    >
      <DialogTitle>Upload file</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <input
            ref={fileRef}
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileName(file ? file.name : null);
            }}
          />

          <Button variant="outlined" onClick={() => fileRef.current?.click()}>
            Choose file
          </Button>

          {fileName && (
            <Typography variant="body2" color="text.secondary">
              Selected: {fileName}
            </Typography>
          )}

          {/* <TextField
            label="Description"
            fullWidth
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          /> */}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            borderRadius: 1.5,
            backgroundColor: '#6d5dfc',
            '&:hover': { backgroundColor: '#5b4ae0' },
          }}
          onClick={() => {
            const file = fileRef.current?.files?.[0] || null;

            if (!file) {
              setSnackbarOpen(true);
              return;
            }

            handleUpload(file, currentUserId);
            onClose();
          }}
        >
          Upload
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="❌ File not found"
      />
    </Dialog>
  );
}
