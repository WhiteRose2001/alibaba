// HeaderActions.tsx
import React from 'react';
import {
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Box,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

type Props = {
  onNavigate?: (to: string) => void;
  onUploadClick?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;

  userName?: string;
};

export default function HeaderActions({
  onNavigate,
  onUploadClick,
  onToggleTheme,
  isDark = false,
  userName = 'JD',
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Upload button */}
      <Button
        variant="contained"
        size="small"
        startIcon={<UploadFileIcon />}
        onClick={() => {
          if (onUploadClick) onUploadClick();
          else onNavigate?.('/upload');
        }}
      >
        Upload
      </Button>

      {/* Theme toggle */}
      <Tooltip title={isDark ? 'Light mode' : 'Dark mode'}>
        <IconButton
          onClick={() => {
            onToggleTheme?.();
          }}
          aria-label="toggle theme"
          size="small"
        >
          {isDark ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>

      {/* Avatar + menu */}
      <Tooltip title="Account">
        <IconButton onClick={handleOpenMenu} size="small" sx={{ ml: 1 }}>
          <Avatar>
            {userName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onNavigate?.('/profile');
          }}
        >
          Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            onNavigate?.('/settings');
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            // onLogout?.();
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
