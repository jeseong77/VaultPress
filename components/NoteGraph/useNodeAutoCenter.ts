import { useEffect, RefObject } from "react";
import * as d3 from "d3";
import type {
  NodeDatum,
  GraphData,
  D3ZoomTransform,
  D3ZoomBehavior,
} from "./graphTypes";

interface UseNodeAutoCenterProps {
  svgRef: RefObject<SVGSVGElement | null>; // ✨ Allow null in RefObject
  zoomRef: RefObject<D3ZoomBehavior | null>;
  currentTransformRef: RefObject<D3ZoomTransform>;
  currentNodeId?: string | null;
  graphData: GraphData;
  dimensions: { width: number; height: number };
}

export const useNodeAutoCenter = ({
  svgRef,
  zoomRef,
  currentTransformRef,
  currentNodeId,
  graphData,
  dimensions,
}: UseNodeAutoCenterProps): void => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const svgElement = svgRef.current; // svgElement can be SVGSVGElement | null
      const zoomBehavior = zoomRef.current;

      if (
        !svgElement || // Check if svgElement is null
        !zoomBehavior ||
        !currentNodeId ||
        graphData.nodes.length === 0 ||
        dimensions.width === 0 ||
        dimensions.height === 0
      ) {
        return;
      }

      const svg = d3.select(svgElement); // svgElement is SVGSVGElement here
      const currentTransform = currentTransformRef.current || d3.zoomIdentity;

      const targetNode = graphData.nodes.find(
        (node) => node.id === currentNodeId
      );

      if (
        targetNode &&
        typeof targetNode.x === "number" &&
        typeof targetNode.y === "number"
      ) {
        const targetX = targetNode.x;
        const targetY = targetNode.y;
        const currentScale = currentTransform.k;

        const newX = -targetX * currentScale;
        const newY = -targetY * currentScale;

        const newTransform = d3.zoomIdentity
          .translate(newX, newY)
          .scale(currentScale);

        svg
          .transition()
          .duration(750)
          .call(zoomBehavior.transform, newTransform);

        currentTransformRef.current = newTransform;
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [
    svgRef,
    zoomRef,
    currentTransformRef,
    currentNodeId,
    graphData,
    dimensions,
  ]);
};
