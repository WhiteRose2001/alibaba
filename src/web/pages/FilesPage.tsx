import { useState } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';

import { useDeleteFile } from '../hooks/useDeleteFile';
import SensitiveExifDialog from '../components/metadata/SensitiveMetadataDialog';
import { FilesState } from '../hooks/types/SensitiveMetadata';

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
                  sx={{
                    px: 2,
                    py: 1.5,
                    alignItems: 'center',
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip
                        title={
                          hasMetadata
                            ? `Pokaż metadane dla ${file}`
                            : `Brak metadanych`
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

                      <IconButton
                        onClick={(e) => handleDelete(e, file)}
                      >
                        <DeleteForeverIcon color="warning" />
                      </IconButton>
                    </Stack>
                  }
                >
                  {/* MINIATURA / FALLBACK */}
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
                          backgroundColor: 'black',
                          backgroundImage: `url(${getImageUrl(file)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: `1.5px solid ${alpha(
                            theme.palette.secondary.main,
                            0.5
                          )}`,
                          cursor: hasMetadata ? 'pointer' : 'not-allowed',
                          transition: 'box-shadow 0.2s ease',

                          ...(hasMetadata && {
                            '&:hover': {
                              boxShadow: `0 0 0 2px ${alpha(
                                theme.palette.primary.main,
                                0.6
                              )}`,
                            },
                          }),
                        })}
                      />
                    ) : (
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: 'grey.700',
                          fontWeight: 600,
                        }}
                      >
                        {getFallbackLetter(file)}
                      </Avatar>
                    )}
                  </ListItemAvatar>

                  {/* NAZWA PLIKU */}
                  <ListItemText
                    primary={file}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              );
            })
          ) : (
            <Typography color="text.secondary">
              Brak plików
            </Typography>
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
