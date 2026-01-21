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

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InfoIcon from '@mui/icons-material/Info';
import DisabledVisibleIcon from '@mui/icons-material/DisabledVisible';

import { useDeleteFile } from '../hooks/useDeleteFile';
import SensitiveExifDialog from '../components/metadata/SensitiveMetadataDialog';
import { FilesState } from '../hooks/types/SensitiveMetadata';
import { useDeleteMetadata } from '../hooks/useDeleteMetadata';

type Props = {
  filesState: FilesState;
  fetchFiles: () => Promise<void>;
};

export default function FilesPage({ filesState, fetchFiles }: Props) {
  const { handleDelete } = useDeleteFile(fetchFiles);
  const { handleDeleteMetadata } = useDeleteMetadata(fetchFiles);

  const [openInfo, setOpenInfo] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const { files, metadata } = filesState;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Files
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {files.length > 0 ? (
            files.map((file) => {
              const hasMetadata = Boolean(metadata[file]);

              return (
                <ListItem key={file} divider>
                  <ListItemText primary={file} />
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {hasMetadata && (
                      <Tooltip title={`Delete metadata for ${file}`}>
                        <span>
                          <IconButton
                            aria-label="remove-metadata"
                            disabled={!hasMetadata}
                            onClick={(e) => {
                              if (!hasMetadata) return;
                              handleDeleteMetadata(e, file);
                            }}
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
                          aria-label="info"
                          disabled={!hasMetadata}
                          onClick={() => {
                            if (!hasMetadata) return;
                            setSelectedFile(file);
                            setOpenInfo(true);
                          }}
                        >
                          <InfoIcon color={hasMetadata ? 'info' : 'disabled'} />
                        </IconButton>
                      </span>
                    </Tooltip>

                    <Tooltip title={`Usuń plik ${file}`}>
                      <IconButton
                        aria-label="delete"
                        onClick={(e) => handleDelete(e, file)}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
