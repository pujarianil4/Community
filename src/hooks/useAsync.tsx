import React, { useEffect, useState, useCallback } from "react";

type AsyncFunction<T> = (arg?: any) => Promise<T>;

export default function useAsync<T>(
  loadOnRefresh?: AsyncFunction<T>,
  arg?: any
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null | any>(null);

  const callFunction = useCallback(
    async (callback: AsyncFunction<T>, arg?: any) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await callback(arg);
        setData(result);
        return result;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const refetch = () => {
    if (loadOnRefresh) {
      callFunction(loadOnRefresh, arg);
    }
  };

  useEffect(() => {
    refetch();
  }, [loadOnRefresh, callFunction]);

  return { isLoading, error, data, callFunction, refetch };
}
