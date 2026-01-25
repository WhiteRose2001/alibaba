import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  Chip,
  Snackbar,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import UploadDialog from '../components/UploadDialog';
import { useEffect, useState } from 'react';

export interface HomeProps {
  currentUserId: number;
  files: string[];
  file: File | null;
  isUploading: boolean;
  uploadStatus: string | null;
  deleteStatus: string | null;
  handleUpload: (uploadedFile: File | null, userId: number) => Promise<void>;
  handleDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    fileName: string,
  ) => Promise<void> | void;
  clearUploadStatus: () => void;
  clearDeleteStatus: () => void;
}

export default function Home({
  currentUserId,
  files,
  // file,
  // isUploading,
  uploadStatus,
  deleteStatus,
  handleUpload,
  handleDelete,
  clearUploadStatus,
  clearDeleteStatus,
}: HomeProps) {
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (uploadStatus) {
      setToastMessage(uploadStatus);
    }
  }, [uploadStatus]);

  useEffect(() => {
    if (deleteStatus) {
      setToastMessage(deleteStatus);
    }
  }, [deleteStatus]);

  const onUploadFile = async (uploadedFile: File | null) => {
    if (!uploadedFile) return;

    try {
      setLoading(true);
      await handleUpload(uploadedFile, currentUserId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDeleteFile = async (
    e: React.MouseEvent<HTMLButtonElement>,
    file: string,
  ) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await handleDelete(e, file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ pt: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Welcome to Files Manager</Typography>

        <Typography color="text.secondary">
          This dashboard is a starter layout for managing and uploading files.
          Use the sidebar to navigate.
        </Typography>

        {/* --- Quick Actions --- */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Paper elevation={2} sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6">Quick actions</Typography>

            <Stack spacing={1} sx={{ mt: 1 }}>
              <Button
                startIcon={<UploadFileIcon />}
                variant="contained"
                onClick={() => setOpenUploadDialog(true)}
                // href="/upload"
              >
                Upload file
              </Button>

              <Button startIcon={<FolderIcon />} variant="outlined" disabled>
                Create folder (Coming soon)
              </Button>
            </Stack>
            <UploadDialog
              open={openUploadDialog}
              handleUpload={onUploadFile}
              currentUserId={currentUserId}
              onClose={() => setOpenUploadDialog(false)}
            />
          </Paper>

          {/* --- Recent / uploaded files --- */}
          <Paper elevation={2} sx={{ p: 2, flex: 2 }}>
            <Typography variant="h6">Your files</Typography>

            <Stack spacing={1} sx={{ mt: 1 }}>
              {files.length === 0 && (
                <Typography color="text.secondary">
                  No files yet. Upload something to get started.
                </Typography>
              )}

              {files.map((n) => (
                <Stack
                  key={n}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    px: 1.5,
                    py: 1,
                  }}
                >
                  <Chip
                    icon={<InsertDriveFileIcon />}
                    label={n}
                    sx={{ flexGrow: 1 }}
                  />

                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => onDeleteFile(e, n)}
                  >
                    Delete
                  </Button>
                </Stack>
              ))}
            </Stack>
          </Paper>
        </Stack>

        {/* --- Upload status info (optional) --- */}
        {/* {file && (
          <Typography sx={{ mt: 2 }}>
            Selected: <b>{file.name}</b>
          </Typography>
        )} */}

        {/* {isUploading && <Typography>Uploading...</Typography>} */}

        <Snackbar
          key={toastMessage}
          open={Boolean(toastMessage)}
          autoHideDuration={2000}
          onClose={() => {
            setToastMessage(null);
            clearUploadStatus();
            clearDeleteStatus();
          }}
          message={toastMessage}
        />

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      </Stack>
    </Box>
  );
}
