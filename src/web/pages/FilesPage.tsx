import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useDeleteFile } from '../hooks/useDeleteFile';

export default function FilesPage({
  files,
  fetchFiles,
}: {
  files: string[];
  fetchFiles: any;
}) {
  const { handleDelete } = useDeleteFile(fetchFiles);
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Files
      </Typography>

      <Paper sx={{ p: 2 }}>
        <List>
          {files.length > 0 ? (
            files.map((file) => (
              <ListItem
                key={file}
                divider
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={(e) => handleDelete(e, file)}
                  >
                    <DeleteForeverIcon color="warning" />
                  </IconButton>
                }
              >
                <ListItemText primary={file} />
              </ListItem>
            ))
          ) : (
            <Typography>Brak plików</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}
