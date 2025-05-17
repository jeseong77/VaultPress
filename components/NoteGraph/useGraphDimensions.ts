import { useState, useEffect, RefObject } from "react";

interface Dimensions {
  width: number;
  height: number;
}

export const useGraphDimensions = (
  containerRef: RefObject<HTMLDivElement | null>
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
        if (newWidth > 0 && newHeight > 0) {
          setDimensions({ width: newWidth, height: newHeight });
        } else if (
          newWidth === 0 &&
          newHeight === 0 &&
          (dimensions.width !== 0 || dimensions.height !== 0)
        ) {
          setDimensions({ width: 0, height: 0 });
        }
      };

      updateDimensions();
      const resizeObserver = new ResizeObserver(updateDimensions);
      resizeObserver.observe(currentContainer);

      return () => resizeObserver.unobserve(currentContainer);
    } else {
      setDimensions({ width: 0, height: 0 });
    }
  }, [containerRef, dimensions.width, dimensions.height]);

  return dimensions;
};
