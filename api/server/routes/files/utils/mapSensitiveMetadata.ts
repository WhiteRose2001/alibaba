import { SensitiveMetadata } from '../types/sensitiveMetadata.js';

export function mapSensitiveMetadata(rawData: Record<string, any>): SensitiveMetadata {
  return {
    location: rawData?.['latitude'] && rawData?.['longitude']
      ? {
        latitude: rawData['latitude'],
        longitude: rawData['longitude'],
        altitude: rawData['GPSAltitude'],
        gpsAccuracy: rawData['GPSHPositioningError'],
      }
      : undefined,

    time: rawData?.['DateTimeOriginal']
      ? {
        date: rawData['DateTimeOriginal'].toISOString().split('T')[0],
        time: rawData['DateTimeOriginal'].toISOString().split('T')[1].split('.')[0],
        timezone: rawData['OffsetTime'],
      }
      : undefined,

    device: rawData?.['Make'] || rawData?.['Model']
      ? {
        manufacturer: rawData['Make'],
        model: rawData['Model'],
        lens: rawData['LensModel']
          ? rawData['LensModel'].replace(/.* (\d+(\.\d+)?mm f\/\d+(\.\d+)?).*/, '$1')
          : undefined,
      }
      : undefined,
  };
}
