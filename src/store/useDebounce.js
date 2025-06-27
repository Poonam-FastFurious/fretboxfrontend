import { useRef } from "react";

function useDebounce(callback, delay = 300) {
  const timeoutRef = useRef(null);

  const debounced = (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debounced;
}

export default useDebounce;
