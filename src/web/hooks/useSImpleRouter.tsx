import { useMemo, useState } from 'react';

export default function useSimpleRouter() {
  const [pathname, setPathname] = useState('dashboard');
  const [rawSearch, setRawSearch] = useState('');

  const navigateToString = (to: string) => {
    const [p, q] = to.split('?');
    setPathname(p || '');
    setRawSearch(q || '');
  };

  const router = useMemo(
    () => ({
      get pathname() {
        return pathname;
      },
      get searchParams() {
        return new URLSearchParams(rawSearch);
      },
      navigate: (to: string | URL, options?: { replace?: boolean }) => {
        const str = typeof to === 'string' ? to : to.toString();
        navigateToString(str);
      },
    }),
    [pathname, rawSearch],
  );

  return router;
}
