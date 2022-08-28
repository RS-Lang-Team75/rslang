import { useEffect, useRef } from 'react';

type KeyCallback = (e?: KeyboardEvent) => void;

export function useKey (key: string, callback: KeyCallback) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    function handle (e: KeyboardEvent) {
      if (e.code === key) {
        callbackRef.current(e);
      }
    }
    document.addEventListener('keyup', handle);
    return () => document.removeEventListener('keyup', handle);
  }, [key]);

}
