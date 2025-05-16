"use client"; // 최상단에 위치해야 함

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import * as d3 from "d3"; // d3.zoomIdentity 등을 위해 필요할 수 있음
import type {
  NoteGraphProps,
  D3ZoomTransform,
  D3ZoomBehavior,
} from "./graphTypes";
import { useGraphDataProcessor } from "./useGraphDataProcessor";
import { useGraphDimensions } from "./useGraphDimensions";
import { useD3Simulation } from "./useD3Simulation";
import { useNodeAutoCenter } from "./useNodeAutoCenter";

const NoteGraph: React.FC<NoteGraphProps> = ({
  initialNodes = [],
  initialEdges = [],
  currentNodeId = null,
  onNodeClick,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // 줌 상태를 NoteGraph 컴포넌트 레벨에서 관리 (페이지 이동 후에도 줌 상태 유지를 위해)
  const currentTransformRef = useRef<D3ZoomTransform>(d3.zoomIdentity);
  // D3 줌 핸들러 참조
  const zoomRef = useRef<D3ZoomBehavior | null>(null);

  // 커스텀 훅 사용
  const dimensions = useGraphDimensions(containerRef);
  const graphData = useGraphDataProcessor(initialNodes, initialEdges);

  useD3Simulation({
    svgRef,
    graphData,
    dimensions,
    currentNodeId,
    onNodeClick,
    router,
    zoomRef, // 줌 핸들러 참조 전달
    currentTransformRef, // 현재 줌 상태 참조 전달
  });

  useNodeAutoCenter({
    svgRef,
    zoomRef,
    currentTransformRef,
    currentNodeId,
    graphData,
    dimensions,
  });

  return (
    <div
      ref={containerRef}
      className="note-graph-container w-full h-full bg-[var(--card-background)] overflow-hidden transition-colors duration-150 ease-in-out"
    >
      <svg ref={svgRef} />
    </div>
  );
};

export default NoteGraph;
