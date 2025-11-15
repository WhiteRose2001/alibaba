// src/layouts/DashboardLayout.tsx
import React, { ChangeEvent } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

import DashboardIcon from '@mui/icons-material/Dashboard';
import BackupIcon from '@mui/icons-material/Backup';
import FolderIcon from '@mui/icons-material/Folder';
import SettingsIcon from '@mui/icons-material/Settings';

import TopBar from '../components/TopBar';
import SidebarNav from '../components/SidebarNav';

// type FileHandler = (f: File) => void;
// type InputEventHandler = (
//   event: ChangeEvent<HTMLInputElement>,
//   userId: number
// ) => Promise<void> | void;
// type MaybeUploadHandler = FileHandler | InputEventHandler;

export default function DashboardLayout(props: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  currentUserId: number;
  files: string[];
  file: File | null;
  isUploading: boolean;
  uploadStatus?: string | null;
  handleDelete: (
    e: React.MouseEvent<HTMLButtonElement>,
    fileId: string
  ) => Promise<void> | void;
  loginStatus?: string;
  toggleColorMode?: () => void;
  handleLogin: (username: string, password: string) => void;
}) {
  const {
    collapsed,
    setCollapsed,
    // currentUserId,
    // files,
    // file,
    // isUploading,
    // uploadStatus,
    // handleUpload,
    // handleDelete,
    // loginStatus,
  } = props;

  const navigate = useNavigate();
  const SIDEBAR_WIDTH = collapsed ? 72 : 240;

  // adapter: Uploader expects (event, userId)
  // const uploaderAdapter = async (
  //   event: ChangeEvent<HTMLInputElement>,
  //   userId: number
  // ) => {
  //   const fileFromInput = event?.target?.files?.[0] ?? null;
  //   if (!fileFromInput) return;
  //   const fn = handleUpload as MaybeUploadHandler | undefined;
  //   if (!fn) return;
  //   if (typeof fn === 'function') {
  //     if ((fn as Function).length === 1) {
  //       (fn as FileHandler)(fileFromInput);
  //       return;
  //     }
  //     const maybePromise = (fn as InputEventHandler)(event, userId);
  //     if (
  //       maybePromise &&
  //       typeof (maybePromise as Promise<void>).then === 'function'
  //     ) {
  //       await maybePromise;
  //     }
  //   }
  // };

  const NAV: any[] = [
    { kind: 'page', segment: '/', title: 'Dashboard', icon: <DashboardIcon /> },
    { kind: 'header', title: 'Files' },
    { kind: 'page', segment: '/files', title: 'Files', icon: <FolderIcon /> },
    { kind: 'page', segment: '/upload', title: 'Upload', icon: <BackupIcon /> },
    { kind: 'divider' },
    { kind: 'header', title: 'Administration' },
    {
      kind: 'page',
      segment: '/settings',
      title: 'Settings',
      icon: <SettingsIcon />,
    },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <TopBar
        onUploadClick={() => navigate('/upload')}
        onToggleTheme={() => props.toggleColorMode?.()}
        isDark={false}
        onNavigate={(to: string) => navigate(to)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* ASIDE: sidebar jako kolumna (branding + lista + footer) */}
      <Box
        component="aside"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          boxSizing: 'border-box',
          p: 0,
          m: 0,
          borderRight: (t) => `1px solid ${t.palette.divider}`,
          bgcolor: 'background.paper',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          transition: 'width 180ms ease',
        }}
      >
        <SidebarNav
          navigation={NAV}
          onNavigate={(to) => navigate(to)}
          collapsed={collapsed}
        />
      </Box>

      {/* MAIN */}
      <Box
        component="main"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        {/* spacer odpowiadający AppBar: użyj Toolbar */}
        <Toolbar />

        <Container
          maxWidth={false}
          disableGutters
          sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}
        >
          {/* Outlet wyrenderuje treść strony (home, upload, files, settings) */}
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
