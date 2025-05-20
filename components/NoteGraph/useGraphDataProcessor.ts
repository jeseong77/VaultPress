import { useMemo } from "react";
import type { NodeDatum, EdgeDatum, GraphData } from "./graphTypes";

export const useGraphDataProcessor = (
  initialNodes: { id: string; label: string }[],
  initialEdges: { id: string; source: string; target: string }[]
): GraphData => {
  return useMemo(() => {
    const nodes: NodeDatum[] = Array.isArray(initialNodes)
      ? initialNodes.map((n) => ({ ...n }))
      : [];
    const edges: EdgeDatum[] = Array.isArray(initialEdges)
      ? initialEdges.map((e) => ({ ...e }))
      : [];
    return { nodes, edges };
  }, [initialNodes, initialEdges]);
};
