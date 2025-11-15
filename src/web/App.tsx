// src/App.tsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage'; // zakładam, że masz
import DashboardLayout from './layouts/DashboardLayout';

import Home from './pages/Home';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import FilesPage from './pages/FilesPage';
import SettingsPage from './pages/SettingsPage';

import { useAuth } from './hooks/useAuth';
import { useUploadFile } from './hooks/useUploadFile';
import { useDeleteFile } from './hooks/useDeleteFile';

export default function App({
  toggleColorMode,
}: {
  toggleColorMode?: () => void;
}) {
  const {
    currentUserId,
    isLoggedIn,
    loginStatus,
    handleLogin,
    files,
    fetchFiles,
  } = useAuth();
  const { handleDelete } = useDeleteFile(fetchFiles);
  const { file, uploadStatus, isUploading, handleUpload } =
    useUploadFile(fetchFiles);

  const [collapsed, setCollapsed] = React.useState(false);

  console.log('!!!!!!!!!!!!!, ', isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFiles();
    }
  }, [isLoggedIn, fetchFiles]);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginPage handleLogin={handleLogin} isLoggedIn={isLoggedIn} />
        }
      />

      <Route
        path="/*"
        element={
          <DashboardLayout
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            currentUserId={currentUserId}
            files={files}
            file={file}
            isUploading={isUploading}
            uploadStatus={uploadStatus}
            // handleUpload={handleUpload}
            handleDelete={handleDelete}
            loginStatus={loginStatus}
            toggleColorMode={toggleColorMode}
            handleLogin={handleLogin}
          />
        }
      >
        {/* nested routes rendered into Outlet w DashboardLayout */}
        <Route
          index
          element={
            <Home
              currentUserId={currentUserId}
              files={files}
              file={file}
              isUploading={isUploading}
              uploadStatus={uploadStatus}
              handleDelete={handleDelete}
              // jeśli Home potrzebuje uploaderAdapter, można go tu wygenerować i przekazać
            />
          }
        />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="upload"
          element={
            <UploadPage
              currentUserId={currentUserId}
              handleUpload={handleUpload}
            />
          }
        />
        <Route
          path="files"
          element={<FilesPage files={files} fetchFiles={fetchFiles} />}
        />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
