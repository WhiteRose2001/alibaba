import { useCallback, useEffect, useState } from 'react';
import { callServer } from '../../api/clients/callServer';
import { FilesState } from './types/SensitiveMetadata';

interface UseAuthResult {
  currentUserId: number;
  isLoggedIn: boolean;
  loginStatus: string;
  filesState: FilesState;
  handleLogin: (
    username: string,
    password: string,
    isRegister?: boolean,
  ) => Promise<void>;
  fetchFiles: () => Promise<void>;
}

export const useAuth = (): UseAuthResult => {
  const [currentUserId, setCurrentUserId] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginStatus, setLoginStatus] = useState('');
  const [filesState, setFilesState] = useState<FilesState>({
    files: [],
    metadata: {},
  });

  const fetchFiles = useCallback(async () => {
    if (!isLoggedIn) {
      setFilesState({ files: [], metadata: {} });
      return;
    }

    try {
      const response = await callServer({ mode: 'LIST_FILES', method: 'GET' });
      console.log(response);
      if (response.success && Array.isArray(response.data.params.files)) {
        setFilesState({
          files: response.data.params.files,
          metadata: response.data.params.metadata,
        });
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  }, [isLoggedIn]);

  const checkSession = useCallback(async () => {
    try {
      const res = await callServer({
        mode: 'CHECK_USER_SESSION',
        method: 'GET',
      });
      const userId = res.data?.userId;

      if (userId && res.success) {
        setIsLoggedIn(true);
        setCurrentUserId(userId);
      } else {
        setIsLoggedIn(false);
        setCurrentUserId(0);
        setFilesState({ files: [], metadata: {} });
      }
    } catch (err) {
      console.error('Session check failed', err);
      setIsLoggedIn(false);
      setCurrentUserId(0);
    }
  }, []);

  const handleLogin = useCallback(
    async (username: string, password: string, isRegister?: boolean) => {
      if (isLoggedIn) {
        // Logout
        await callServer({ mode: 'LOGOUT_USER', method: 'GET' });
        setIsLoggedIn(false);
        setCurrentUserId(0);
        setLoginStatus('✅ Logged out.');
        setFilesState({ files: [], metadata: {} });
        return;
      }

      if (!username || !password) return;

      setLoginStatus('Logging in...');

      try {
        // Check if user exists
        const userCheck = await callServer({
          mode: 'GET_USER',
          method: 'POST',
          login: username,
        });

        const userNotFound = !userCheck.success || userCheck.data?.length === 0;

        if (userNotFound && isRegister) {
          setLoginStatus('Creating user...');
          await callServer({
            mode: 'ADD_USER',
            method: 'POST',
            login: username,
            password,
          });
        }

        // Login
        const loginRes = await callServer({
          mode: 'LOGIN_USER',
          method: 'POST',
          login: username,
          password,
        });

        if (loginRes.success) {
          setIsLoggedIn(true);
          setCurrentUserId(loginRes.data.userId);
          setLoginStatus('✅ Logged in.');
        } else {
          setLoginStatus(
            '❌ Login failed.' +
              (loginRes.status === 401 ? ' Incorrect credentials.' : ''),
          );
        }
      } catch (err) {
        console.error(err);
        setLoginStatus('❌ Unexpected error');
      }
    },
    [isLoggedIn],
  );

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return {
    currentUserId,
    isLoggedIn,
    loginStatus,
    filesState,
    handleLogin,
    fetchFiles,
  };
};
