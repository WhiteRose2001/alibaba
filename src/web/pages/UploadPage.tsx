import React from 'react';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import UploadDialog from '../components/UploadDialog';
import { useNavigate } from 'react-router-dom';

export interface UploadPageProps {
  currentUserId: number;
  handleUpload: (uploadedFile: File | null, userId: number) => Promise<void>;
}

export default function UploadPage({
  currentUserId,
  handleUpload,
}: UploadPageProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true); // open by default as page

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Upload
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Typography>Use the dialog to upload a file.</Typography>

        {/* UploadDialog powinien wywołać onUpload(file: File) */}
        <UploadDialog
          handleUpload={handleUpload}
          currentUserId={currentUserId}
          open={open}
          onClose={() => {
            setOpen(false);
            navigate('/files');
          }}
        />
      </Paper>
    </Box>
  );
}
