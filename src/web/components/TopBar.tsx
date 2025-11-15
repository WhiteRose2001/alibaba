// src/web/components/TopBar.tsx
import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Typography from '@mui/material/Typography';

type Props = {
  onUploadClick?: () => void;
  onToggleTheme?: () => void;
  isDark?: boolean;
  onNavigate?: (to: string) => void;
  collapsed: boolean;
  isLoggedIn: boolean;
  setCollapsed: (v: boolean) => void;
  handleLogin: (username: string, password: string) => void;
};

export default function TopBar({
  onUploadClick,
  onToggleTheme,
  isDark = false,
  onNavigate,
  collapsed,
  isLoggedIn,
  handleLogin,
  setCollapsed,
}: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const SIDEBAR_EXPANDED = 240;
  const SIDEBAR_COLLAPSED = 72;

  const onLogout = () => {
    handleLogin('', '');
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      elevation={1}
      sx={(theme) => ({
        zIndex: theme.zIndex.drawer + 1,
        ml: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        width: `calc(100% - ${
          collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED
        }px)`,
        transition: 'margin-left 180ms ease, width 180ms ease',
      })}
    >
      <Toolbar>
        {/* Toggle sidebar */}
        <IconButton
          color="inherit"
          onClick={() => setCollapsed(!collapsed)}
          sx={{ mr: 1 }}
        >
          {collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>

        {/* Logo + Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            height: '100%', // klucz
          }}
        >
          <Typography variant="h6" sx={{ lineHeight: 1 }}>
            alibaba-fiesta
          </Typography>
        </Box>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<UploadFileIcon />}
            size="small"
            onClick={onUploadClick}
          >
            Upload
          </Button>

          <Tooltip title="Toggle theme">
            <IconButton onClick={onToggleTheme} size="small">
              {isDark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Account">
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar sx={{ width: 40, height: 40 }} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onNavigate?.('/profile');
              }}
            >
              Profile
            </MenuItem>

            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                onNavigate?.('/settings');
              }}
            >
              Settings
            </MenuItem>

            <MenuItem
              onClick={() => {
                setAnchorEl(null);
                // onNavigate?.('/');
                console.log('Przed: ', isLoggedIn);
                onLogout();
                console.log('Po: ', isLoggedIn);
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
