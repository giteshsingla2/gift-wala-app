import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

// Loads data when the screen gains focus (and again when `deps` change) and supports
// pull-to-refresh. Keeps the last good data on screen while a reload is in flight.
export function useApi<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const loadRef = useRef(load);
  useEffect(() => {
    loadRef.current = load;
  });
  const depsKey = JSON.stringify(deps);

  const run = useCallback(
    async (isRefresh: boolean) => {
      if (isRefresh) setRefreshing(true);
      try {
        setData(await loadRef.current());
        setError(undefined);
      } catch (e) {
        setError(e as Error);
      } finally {
        if (isRefresh) setRefreshing(false);
      }
    },
    // depsKey re-creates the loader when the caller's inputs change (e.g. a filter).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [depsKey],
  );

  useFocusEffect(
    useCallback(() => {
      run(false);
    }, [run]),
  );

  return { data, error, refreshing, refresh: () => run(true), setData };
}
