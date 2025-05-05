import { useState, useEffect } from "react";

export const WindowWidth = () => {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(document.body);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return width;
};
