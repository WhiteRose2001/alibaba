export type SensitiveMetadata = {
  location?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    gpsAccuracy?: number;
  };
  time?: {
    date?: string;
    time?: string;
    timezone?: string;
  };
  device?: {
    manufacturer?: string;
    model?: string;
    lens?: string;
  };
};

export type FilesState = {
  files: string[];
  metadata: Record<string, SensitiveMetadata | null>;
};