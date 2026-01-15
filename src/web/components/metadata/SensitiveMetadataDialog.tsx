import * as React from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import { SensitiveMetadata } from '../../hooks/types/SensitiveMetadata';
import LocationMap from './LocationMap';
import LocationAddress from './LocationAddress';
import ImagePreview from './ImagePreview';

type Props = {
  open: boolean;
  onClose: () => void;
  fileName: string;
  fileMetadata: SensitiveMetadata | null;
};

export default function SensitiveExifDialog({ open, onClose, fileName, fileMetadata }: Props) {
  if (!fileMetadata) return;
  const { location, time, device } = fileMetadata;

  return (
    <Dialog fullScreen open={open} onClose={onClose}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose}>
            <CloseIcon />
          </IconButton>

          <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
            Wrażliwe dane ujawniane przez zdjęcie
          </Typography>

          <Chip
            icon={<WarningAmberIcon />}
            label="Dane wrażliwe"
            color="warning"
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          📁 {fileName}
        </Typography>
        <ImagePreview
          src={`api/server/storage/files/${fileName}`}
          alt={`Podgląd ${fileName}`}
        />

        <Typography color="text.secondary" sx={{ mb: 3 }}>
          To zdjęcie zawiera metadane, które mogą ujawniać informacje o Tobie,
          Twojej lokalizacji oraz urządzeniu.
        </Typography>

        <Section
          icon={<LocationOnIcon color="error" />}
          title="Lokalizacja"
          description="Pozwala ustalić dokładne miejsce wykonania zdjęcia"
          items={[
            ['Szerokość geograficzna', location?.latitude ? location.latitude.toFixed(6) : '-'],
            ['Długość geograficzna', location?.longitude ? location.longitude.toFixed(6) : '-'],
            ['Wysokość', location?.altitude ? `${location.altitude.toFixed(0)} m` : '-'],
            ['Dokładność GPS', location?.gpsAccuracy ? `~ ${location.gpsAccuracy.toFixed(1)} m` : '-'],
          ]}
        >
          {location?.latitude && location?.longitude && (
            <Box sx={{ mt: 2 }}>
              <LocationMap
                latitude={location.latitude}
                longitude={location.longitude}
              />

              <LocationAddress
                latitude={location.latitude}
                longitude={location.longitude}
              />
            </Box>
          )}
        </Section>

        <Divider sx={{ my: 4 }} />

        <Section
          icon={<AccessTimeIcon color="warning" />}
          title="Czas wykonania"
          description="Ujawnia dokładny moment wykonania zdjęcia"
          items={[
            ['Data', time?.date ? time.date : '-'],
            ['Godzina', time?.time ? time.time : '-'],
            ['Strefa czasowa', time?.timezone ? time.timezone : '-'],
          ]}
        />

        <Divider sx={{ my: 4 }} />

        <Section
          icon={<PhoneIphoneIcon />}
          title="Urządzenie"
          description="Umożliwia profilowanie sprzętu"
          items={[
            ['Producent', device?.manufacturer ? device.manufacturer : '-'],
            ['Model', device?.model ? device.model : '-'],
            ['Obiektyw', device?.lens ? device.lens : '-'],
          ]}
        />
      </Box>
    </Dialog>
  );
}

function Section({
  icon,
  title,
  description,
  items,
  children,
}: {

  icon: React.ReactNode;
  title: string;
  description: string;
  items: [string, string | number][];
    children?: React.ReactNode;
}) {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Box>

      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      <List dense>
        {items.map(([label, value]) => (
          <ListItem key={label}>
            <ListItemText primary={label} secondary={value} />
          </ListItem>
        ))}
      </List>
      {children}
    </Box>

  );
}
