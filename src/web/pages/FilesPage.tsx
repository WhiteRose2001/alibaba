import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
} from '@mui/material';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import DisabledVisibleIcon from '@mui/icons-material/DisabledVisible';

import { useDeleteFile } from '../hooks/useDeleteFile';
import SensitiveExifDialog from '../components/metadata/SensitiveMetadataDialog';
import { FilesState } from '../hooks/types/SensitiveMetadata';
import { useDeleteMetadata } from '../hooks/useDeleteMetadata';
import DownloadIcon from '@mui/icons-material/Download';
import { expressServerUrl } from '../../api/clients/callServer';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';

type Props = {
  filesState: FilesState;
  fetchFiles: () => Promise<void>;
};

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const isImageFile = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext ? IMAGE_EXTENSIONS.includes(ext) : false;
};

const getImageUrl = (fileName: string) =>
  `api/server/storage/files/${encodeURIComponent(fileName)}`;

const getFallbackLetter = (fileName: string) =>
  fileName.charAt(0).toUpperCase();

export default function FilesPage({ filesState, fetchFiles }: Props) {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { handleDelete, deleteStatus } = useDeleteFile(fetchFiles);
  const { handleDeleteMetadata, deleteMetadataStatus } =
    useDeleteMetadata(fetchFiles);

  useEffect(() => {
    if (deleteMetadataStatus) {
      setToastMessage(deleteMetadataStatus);
    }
  }, [deleteMetadataStatus]);

  useEffect(() => {
    if (deleteStatus) {
      setToastMessage(deleteStatus);
    }
  }, [deleteStatus]);

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { files, metadata } = filesState;
  const openMetadataPreview = (file: string) => {
    if (!metadata[file]) return;
    setSelectedFile(file);
    setOpenInfo(true);
  };

  const downloadFile = async (file: string) => {
    const res = await fetch(
      `${expressServerUrl}/files/download?filename=${encodeURIComponent(file)}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!res.ok) {
      throw new Error('Download failed');
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
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

  const onDeleteMetadata = async (
    e: React.MouseEvent<HTMLButtonElement>,
    file: string,
  ) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await handleDeleteMetadata(e, file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Files
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List disablePadding>
          {files.length > 0 ? (
            files.map((file) => {
              const hasMetadata = Boolean(metadata[file]);
              const isImage = isImageFile(file);

              return (
                <ListItem
                  key={file}
                  divider
                  sx={{ px: 2, py: 1.5, alignItems: 'center' }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title={`Download ${file}`}>
                        <IconButton onClick={() => downloadFile(file)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      {hasMetadata && (
                        <Tooltip title={`Delete metadata for ${file}`}>
                          <span>
                            <IconButton
                              disabled={!hasMetadata || loading}
                              onClick={(e) => onDeleteMetadata(e, file)}
                            >
                              <DisabledVisibleIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}

                      <Tooltip
                        title={
                          hasMetadata
                            ? `Show metadata for ${file}`
                            : `No metadata for ${file}`
                        }
                      >
                        <span>
                          <IconButton
                            disabled={!hasMetadata}
                            onClick={() => openMetadataPreview(file)}
                          >
                            <InfoIcon
                              color={hasMetadata ? 'info' : 'disabled'}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={`Delete file ${file}`}>
                        <IconButton onClick={(e) => onDeleteFile(e, file)}>
                          <DeleteForeverIcon color="warning" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemAvatar sx={{ minWidth: 64 }}>
                    {isImage ? (
                      <Box
                        onClick={
                          hasMetadata
                            ? () => openMetadataPreview(file)
                            : undefined
                        }
                        sx={(theme) => ({
                          width: 48,
                          height: 48,
                          borderRadius: 1,
                          backgroundImage: `url(${getImageUrl(file)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: `1.5px solid ${alpha(
                            theme.palette.secondary.main,
                            0.5,
                          )}`,
                          cursor: hasMetadata ? 'pointer' : 'not-allowed',
                          ...(hasMetadata && {
                            '&:hover': {
                              boxShadow: `0 0 0 2px ${alpha(
                                theme.palette.primary.main,
                                0.6,
                              )}`,
                            },
                          }),
                        })}
                      />
                    ) : (
                      <Avatar variant="rounded" sx={{ width: 48, height: 48 }}>
                        {getFallbackLetter(file)}
                      </Avatar>
                    )}
                  </ListItemAvatar>

                  <ListItemText
                    primary={file}
                    primaryTypographyProps={{ noWrap: true, fontWeight: 500 }}
                  />
                </ListItem>
              );
            })
          ) : (
            <Typography color="text.secondary">No files found</Typography>
          )}
        </List>
      </Paper>

      {selectedFile && metadata[selectedFile] && (
        <SensitiveExifDialog
          open={openInfo}
          fileName={selectedFile}
          fileMetadata={metadata[selectedFile]}
          onClose={() => setOpenInfo(false)}
        />
      )}
      <Snackbar
        key={toastMessage}
        open={Boolean(toastMessage)}
        autoHideDuration={2000}
        onClose={() => setToastMessage(null)}
        message={toastMessage}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
