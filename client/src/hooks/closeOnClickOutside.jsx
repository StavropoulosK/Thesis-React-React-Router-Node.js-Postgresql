import { useEffect } from "react";

export default function useCloseOnOutsideClick(ref, callback) {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(); 
        console.log('outside click')

      }
    };

    console.log('run')
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      console.log('remove')
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}