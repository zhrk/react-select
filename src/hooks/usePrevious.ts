import { useRef, useEffect } from 'react';

const usePrevious = <T>(value: T) => {
  const ref = useRef<T | null>(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

export default usePrevious;
