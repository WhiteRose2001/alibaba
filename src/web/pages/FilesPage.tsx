import { useState } from 'react';

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

type Props = {
  filesState: FilesState;
  fetchFiles: () => Promise<void>;
};

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

const isImageFile = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ext ? IMAGE_EXTENSIONS.includes(ext) : false;
};

/**
 * TEN SAM ENDPOINT CO ImagePreview
 */
const getImageUrl = (fileName: string) =>
  `api/server/storage/files/${encodeURIComponent(fileName)}`;

const getFallbackLetter = (fileName: string) =>
  fileName.charAt(0).toUpperCase();

export default function FilesPage({ filesState, fetchFiles }: Props) {
  const { handleDelete } = useDeleteFile(fetchFiles);
  const { handleDeleteMetadata } = useDeleteMetadata(fetchFiles);

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { files, metadata } = filesState;

  /**
   * JEDNO ŹRÓDŁO PRAWDY
   * (używane przez ikonę i miniaturę)
   */
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
                      {/* DOWNLOAD FILE */}
                      <Tooltip title={`Download ${file}`}>
                        <IconButton onClick={() => downloadFile(file)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      {/* REMOVE METADATA */}
                      {hasMetadata && (
                        <Tooltip title={`Delete metadata for ${file}`}>
                          <span>
                            <IconButton
                              disabled={!hasMetadata}
                              onClick={(e) => handleDeleteMetadata(e, file)}
                            >
                              <DisabledVisibleIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}

                      {/* SHOW METADATA */}
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

                      {/* DELETE FILE */}
                      <Tooltip title={`Delete file ${file}`}>
                        <IconButton onClick={(e) => handleDelete(e, file)}>
                          <DeleteForeverIcon color="warning" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                >
                  {/* THUMBNAIL / FALLBACK */}
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

                  {/* FILE NAME */}
                  <ListItemText
                    primary={file}
                    primaryTypographyProps={{ noWrap: true, fontWeight: 500 }}
                  />
                </ListItem>
              );
            })
          ) : (
            <Typography color="text.secondary">Brak plików</Typography>
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
    </Box>
  );
}
