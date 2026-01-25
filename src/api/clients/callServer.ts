import { CallServerParams } from '../types';

const PATHS: Record<CallServerParams['mode'], string> = {
  UPLOAD: '/files/upload',
  LIST_FILES: '/files/list',
  DELETE_FILE: '/files/delete',
  DELETE_METADATA: '/files/remove-metadata',
  ADD_USER: '/users/add',
  LOGIN_USER: '/users/login',
  GET_USER: '/users/get',
  DELETE_USER: '/users/delete',
  LOGOUT_USER: '/users/logout',
  CHECK_USER_SESSION: '/users/me',
} as const;

const REQUIRED_FIELDS: Record<CallServerParams['mode'], string[]> = {
  UPLOAD: ['file'],
  LIST_FILES: ['userId'],
  DELETE_FILE: ['filename'],
  DELETE_METADATA: ['filename'],
  ADD_USER: ['login', 'password'],
  LOGIN_USER: ['login', 'password'],
  GET_USER: ['login'],
  DELETE_USER: ['userId'],
  LOGOUT_USER: [],
  CHECK_USER_SESSION: [],
};

const isDev = import.meta.env.VITE_ENV === 'development';

export const expressServerUrl = isDev
  ? import.meta.env.VITE_SERVER_URL || 'https://localhost:8081'
  : undefined;

export async function callServer(
  params: CallServerParams,
): Promise<{ success: boolean; status: number; data?: any; message?: string }> {
  const { mode, method } = params;

  const url = expressServerUrl
    ? new URL(PATHS[mode], expressServerUrl)
    : PATHS[mode];

  // Validate required fields
  for (const field of REQUIRED_FIELDS[mode]) {
    if (params[field as keyof CallServerParams] === undefined) {
      throw new Error(`${field} is required for ${mode}`);
    }
  }

  const isFileUpload = mode === 'UPLOAD';
  const headers: Record<string, string> = {};
  let body: FormData | string | undefined;

  if (isFileUpload) {
    const formData = new FormData();
    formData.append('file', params.file!);
    Object.entries(params.additionalData ?? {}).forEach(([k, v]) =>
      formData.append(k, String(v)),
    );
    body = formData;
  } else {
    headers['Content-Type'] = 'application/json';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { method, mode, ...rest } = params;
    if (Object.keys(rest).length > 0 && method !== 'GET') {
      body = JSON.stringify(rest);
    }
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers,
      body,
      credentials: 'include',
    });
    console.log(response);

    const json = await response.json().catch(() => ({}));
    return {
      success: response.ok,
      status: response.status,
      data: json,
      message: response.ok
        ? '✅ Request succeeded'
        : `❌ ${mode} failed (${response.status} ${response.statusText})`,
    };
  } catch (err) {
    return {
      success: false,
      status: 0,
      message: err instanceof Error ? err.message : 'Network error',
    };
  }
}
