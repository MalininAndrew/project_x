import { useEffect, useState } from "react";

export function usePortalPosition(triggerId: string, shiftY: number, shiftX: number) {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const el = document.querySelector(`#${triggerId}`);
    
    if (el) {
      
      const rect = el.getBoundingClientRect();

      setCoords({
        top: rect.bottom + window.scrollY - shiftY,
        left: rect.left + window.scrollX + shiftX,
      });
    }
  }, [triggerId]);

  return coords;
}