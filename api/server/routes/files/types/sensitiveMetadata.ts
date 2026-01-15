export type LocationSensitiveMetadata = {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  gpsAccuracy?: number;
};

export type TimeSensitiveMetadata = {
  date?: string;
  time?: string;
  timezone?: string;
};

export type DeviceSensitiveMetadata = {
  manufacturer?: string;
  model?: string;
  lens?: string;
};

export type SensitiveMetadata = {
  location?: LocationSensitiveMetadata;
  time?: TimeSensitiveMetadata;
  device?: DeviceSensitiveMetadata;
};