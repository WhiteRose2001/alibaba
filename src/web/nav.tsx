import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';

export type NavItem =
  | { kind: 'page'; segment: string; title: string; icon?: React.ReactNode }
  | { kind: 'header'; title: string }
  | { kind: 'divider' };

export const NAVIGATION: NavItem[] = [
  { kind: 'page', segment: '/', title: 'Dashboard', icon: <DashboardIcon /> },
  { kind: 'header', title: 'Files' },
  { kind: 'page', segment: '/files', title: 'Files', icon: <FolderIcon /> },
  {
    kind: 'page',
    segment: '/upload',
    title: 'Upload',
    icon: <UploadFileIcon />,
  },
  { kind: 'divider' },
  { kind: 'header', title: 'Administration' },
  {
    kind: 'page',
    segment: '/settings',
    title: 'Settings',
    icon: <SettingsIcon />,
  },
];
