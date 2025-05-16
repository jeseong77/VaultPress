import { useState, useEffect, RefObject } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export const useGraphDimensions = (
  containerRef: RefObject<HTMLDivElement | null> // ✨ Allow null in RefObject
): Dimensions => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      const updateDimensions = () => {
        const newWidth = currentContainer.clientWidth;
        const newHeight = currentContainer.clientHeight;
        // Ensure dimensions are positive before setting
        if (newWidth > 0 && newHeight > 0) {
          setDimensions({ width: newWidth, height: newHeight });
        } else if (
          newWidth === 0 &&
          newHeight === 0 &&
          (dimensions.width !== 0 || dimensions.height !== 0)
        ) {
          // Reset if container becomes 0x0 (e.g. display:none)
          // to avoid graph miscalculations, only if not already zero.
          setDimensions({ width: 0, height: 0 });
        }
      };

      updateDimensions();
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(currentContainer);

      return () => resizeObserver.unobserve(currentContainer);
    } else {
      // If container is initially null or becomes null, reset dimensions
      setDimensions({ width: 0, height: 0 });
    }
  }, [containerRef, dimensions.width, dimensions.height]); // Re-run if containerRef itself changes, though unlikely for direct refs

  return dimensions;
};
