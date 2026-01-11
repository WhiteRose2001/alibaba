import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Typography>Welcome to the dashboard. Add your widgets here.</Typography>
      </Paper>
    </Box>
  );
}
