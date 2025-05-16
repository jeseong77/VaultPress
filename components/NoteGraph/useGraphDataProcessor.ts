import { useMemo } from "react";
import type { NodeDatum, EdgeDatum, GraphData } from "./graphTypes";

export const useGraphDataProcessor = (
  initialNodes: { id: string; label: string }[],
  initialEdges: { id: string; source: string; target: string }[]
): GraphData => {
  return useMemo(() => {
    const nodes: NodeDatum[] = Array.isArray(initialNodes)
      ? initialNodes.map((n) => ({ ...n })) // x, y 등 d3에 의해 추가될 속성을 위해 복사
      : [];
    const edges: EdgeDatum[] = Array.isArray(initialEdges)
      ? initialEdges.map((e) => ({ ...e })) // source, target이 객체로 변환될 수 있으므로 복사
      : [];
    return { nodes, edges };
  }, [initialNodes, initialEdges]);
};
