import React from 'react';
import { useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import turban from '../assets/turban2.png';

import type { NavItem } from '../nav';

type Props = {
  navigation: NavItem[];
  onNavigate?: (to: string) => void;
  collapsed: boolean;
};

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 64, // stała wysokość jak w MUI DrawerHeader
        px: 2,
        borderBottom: (t) => `1px solid ${t.palette.divider}`,
      }}
    >
      <Box
        sx={{
          width: collapsed ? 40 : 40,
          height: 40,
          minWidth: 40,
          minHeight: 40,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={turban}
          alt="Logo Alibaba"
          style={{
            width: 28,
            height: 28,
            display: 'block',
            objectFit: 'contain',
          }}
        />
      </Box>

      <Box
        component="span"
        sx={{
          fontWeight: 600,
          fontSize: 16,
          ml: 3,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'opacity 200ms ease, width 200ms ease',
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : 'auto',
          display: 'inline-block',
        }}
      >
        Menu
      </Box>
    </Box>
  );
}

export default function SidebarNav({
  navigation,
  onNavigate,
  collapsed,
}: Props) {
  const location = useLocation();

  const SIDEBAR_EXPANDED = 240;
  const SIDEBAR_COLLAPSED = 72;

  return (
    <Box
      component="nav"
      sx={{
        width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED,
        minHeight: '100vh',
        transition: 'width 180ms ease',
        boxSizing: 'border-box',
        borderRight: (t) => `1px solid ${t.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SidebarBrand collapsed={collapsed} />

      <Box sx={{ overflow: 'auto', flex: 1 }}>
        <List sx={{ p: 0, m: 0 }}>
          {navigation.map((item, idx) => {
            if (item.kind === 'divider') {
              return <Divider key={idx} />;
            }

            if (item.kind === 'header') {
              return (
                <ListSubheader
                  key={idx}
                  disableSticky
                  sx={{
                    pl: 2,
                    pt: 2,
                    pb: 1,
                    textTransform: 'none',
                    color: 'text.secondary',
                    display: collapsed ? 'none' : 'block',
                  }}
                >
                  {item.title}
                </ListSubheader>
              );
            }

            const segPath = item.segment || '/';
            const isActive =
              segPath === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(segPath);

            const iconNode = item.icon ?? <InsertDriveFileIcon />;

            return (
              <ListItem key={idx} disablePadding>
                <ListItemButton
                  onClick={() => onNavigate?.(segPath)}
                  selected={isActive}
                  sx={{
                    py: 1.25,
                    px: 2,
                    gap: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      mr: 2,
                      justifyContent: 'center',
                    }}
                  >
                    {iconNode}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      noWrap: true,
                      sx: {
                        opacity: collapsed ? 0 : 1,
                        width: collapsed ? 0 : 'auto',
                        transition: 'opacity 180ms ease, width 180ms ease',
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 1,
          borderTop: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        {!collapsed && (
          <Box sx={{ fontSize: 12, color: 'text.secondary' }}>v1.0.0</Box>
        )}
      </Box>
    </Box>
  );
}
