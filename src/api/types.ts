export type Response = {
  success: true;
  message: string;
  params: Record<string, any>;
};

export type ErrorResponse = {
  success: false;
  status: number;
  message: string;
};

// type ApiMethods = 'POST' | 'GET';

// type Modes = 'LIST_FILES' | 'DELETE_FILE' | 'UPLOAD';

export type ParamsUpload = {
  mode: 'UPLOAD';
  method: 'POST';
  file: File;
  additionalData?: Record<string, string | number | boolean>;
};

// Type for 'DELETE_FILE' mode, which requires 'filename' and optional 'additionalData'
export type ParamsDelete = {
  mode: 'DELETE_FILE';
  method: 'POST';
  filename: string;
};
export type ParamsDeleteMetadata = {
  mode: 'DELETE_METADATA';
  method: 'POST';
  filename: string;
};

// Type for 'LIST_FILES' mode, which requires no additional params
export type ParamsList = {
  mode: 'LIST_FILES';
  method: 'POST';
  userId: number;
};

export type ParamsUserAdd = {
  mode: 'ADD_USER';
  method: 'POST';
  login: string;
  password: string;
};

export type ParamsUserGet = {
  mode: 'GET_USER';
  method: 'POST';
  login: string;
};

export type ParamsUserDelete = {
  mode: 'DELETE_USER';
  method: 'POST';
  userId: number;
};

export type ParamsUserLogin = {
  mode: 'LOGIN_USER';
  method: 'POST';
  login: string;
  password: string;
};

export type ParamsUserLogout = {
  mode: 'LOGOUT_USER';
  method: 'GET';
};

export type ParamsUserCheckUserSess = {
  mode: 'CHECK_USER_SESSION';
  method: 'GET';
};

// Union type for all possible parameter types
export type CallServerParams =
  | ParamsUpload
  | ParamsList
  | ParamsDelete
  | ParamsDeleteMetadata
  | ParamsUserAdd
  | ParamsUserGet
  | ParamsUserLogout
  | ParamsUserDelete
  | ParamsUserLogin
  | ParamsUserCheckUserSess;
