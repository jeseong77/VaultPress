import * as d3 from "d3";

// D3 시뮬레이션에서 사용될 노드 데이터 타입
export interface NodeDatum extends d3.SimulationNodeDatum {
  id: string; // 정규화된 슬러그
  label: string; // 원본 제목
}

// D3 시뮬레이션에서 사용될 엣지 데이터 타입
export interface EdgeDatum extends d3.SimulationLinkDatum<NodeDatum> {
  id: string;
  source: string | NodeDatum; // 정규화된 슬러그 참조 또는 노드 객체
  target: string | NodeDatum; // 정규화된 슬러그 참조 또는 노드 객체
}

// NoteGraph 컴포넌트의 Props 타입
export interface NoteGraphProps {
  initialNodes: { id: string; label: string }[];
  initialEdges: { id: string; source: string; target: string }[];
  currentNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
}

// 그래프 데이터 구조 (노드와 엣지 배열)
export interface GraphData {
  nodes: NodeDatum[];
  edges: EdgeDatum[];
}

// D3 줌/드래그 동작 및 상태를 위한 타입
export type D3ZoomTransform = d3.ZoomTransform;
export type D3ZoomBehavior = d3.ZoomBehavior<SVGSVGElement, unknown>;
export type D3DragBehavior<E extends Element, D> = d3.DragBehavior<
  E,
  D,
  unknown
>;
