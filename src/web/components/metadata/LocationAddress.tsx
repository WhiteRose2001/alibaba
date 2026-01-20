import { Box, Typography, Skeleton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useReverseGeocode } from '../../hooks/useReverseGeocode';

type Props = {
  latitude: number;
  longitude: number;
};

export default function LocationAddress({ latitude, longitude }: Props) {
  const { address, loading } = useReverseGeocode(latitude, longitude);

  if (loading) {
    return <Skeleton height={24} width="80%" />;
  }

  if (!address) {
    return (
      <Typography color="text.secondary">
        The address could not be determined
      </Typography>
    );
  }

  const city = address.city || address.town || address.village || '';

  return (
    <Box sx={{ mt: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
        <HomeIcon fontSize="small" />
        <Typography variant="subtitle2">Exact address</Typography>
      </Box>

      <Typography>
        {address.road} {address.house_number}
      </Typography>

      <Typography color="text.secondary">
        {address.postcode} {city}, {address.country}
      </Typography>
    </Box>
  );
}
