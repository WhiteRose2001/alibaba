import { useEffect, useState } from 'react';

type Address = {
  road?: string;
  house_number?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  postcode?: string;
  country?: string;
};

export function useReverseGeocode(
  latitude?: number,
  longitude?: number,
) {
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const controller = new AbortController();

    async function fetchAddress() {
      try {
        setLoading(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              // wymagane przez Nominatim
              'Accept': 'application/json',
            },
            signal: controller.signal,
          },
        );

        const data = await res.json();
        setAddress(data.address ?? null);
      } catch {
        setAddress(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAddress();

    return () => controller.abort();
  }, [latitude, longitude]);

  return { address, loading };
}
