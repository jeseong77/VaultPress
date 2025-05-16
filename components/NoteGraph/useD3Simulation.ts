import { useEffect, RefObject } from "react";
import * as d3 from "d3";
import { useRouter } from "next/navigation";
import type {
  NodeDatum,
  EdgeDatum,
  GraphData,
  D3ZoomTransform,
  D3ZoomBehavior,
  D3DragBehavior,
} from "./graphTypes";

interface UseD3SimulationProps {
  svgRef: RefObject<SVGSVGElement | null>;
  graphData: GraphData;
  dimensions: { width: number; height: number };
  currentNodeId?: string | null;
  onNodeClick?: (nodeId: string) => void;
  router: ReturnType<typeof useRouter>;
  zoomRef: RefObject<D3ZoomBehavior | null>;
  currentTransformRef: RefObject<D3ZoomTransform>;
}

export const useD3Simulation = ({
  svgRef,
  graphData,
  dimensions,
  currentNodeId,
  onNodeClick,
  router,
  zoomRef,
  currentTransformRef,
}: UseD3SimulationProps): void => {
  useEffect(() => {
    const { width, height } = dimensions;
    const svgElement = svgRef.current;

    if (
      !svgElement ||
      graphData.nodes.length === 0 ||
      width === 0 ||
      height === 0
    ) {
      if (svgElement) d3.select(svgElement).selectAll("*").remove();
      return;
    }

    const svg = d3
      .select(svgElement)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height].join(" "))
      .style("background-color", "var(--card-background)");

    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation<NodeDatum, EdgeDatum>(graphData.nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, EdgeDatum>(graphData.edges)
          .id((d) => d.id)
          .distance(70)
      )
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(0, 0))
      .force("collide", d3.forceCollide<NodeDatum>().radius(15).strength(0.7));

    const g = svg.append("g").attr("class", "everything");

    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll<SVGLineElement, EdgeDatum>("line")
      .data(graphData.edges)
      .join("line")
      .attr("stroke", "var(--foreground-muted)")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    const nodeGroup = g
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, NodeDatum>("g.node-item")
      .data(graphData.nodes, (d) => d.id)
      .join<SVGGElement>("g")
      .attr("class", "node-item");

    nodeGroup
      .append("circle")
      .attr("r", 6)
      .attr(
        "fill",
        (d) =>
          d.id === currentNodeId
            ? "var(--accent-selected-node-bg)"
            : "var(--accent-default-node-bg)"
      )
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (onNodeClick) {
          onNodeClick(d.id);
        }
        router.push(`/?note=${d.id}`);
      });

    nodeGroup
      .append("text")
      .text((d) => d.label)
      .attr("x", 0)
      .attr("y", -10)
      .style("font-size", "9px")
      .style("text-anchor", "middle")
      .style(
        "fill",
        (d) =>
          d.id === currentNodeId
            ? "var(--accent-selected-node-text)"
            : "var(--foreground)"
      )
      .style("font-weight", (d) => (d.id === currentNodeId ? "bold" : "normal"))
      .style("pointer-events", "none");

    // 드래그 핸들러
    const dragHandler: D3DragBehavior<SVGGElement, NodeDatum> = d3
      .drag<SVGGElement, NodeDatum>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x ?? 0;
        d.fy = d.y ?? 0;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    nodeGroup.call(dragHandler);

    // 줌 핸들러
    const zoomBehavior: D3ZoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .filter(
        (event) => !event.target.closest(".node-item") || event.type === "wheel"
      )
      .on("zoom", (event) => {
        g.attr("transform", event.transform.toString());
        currentTransformRef.current = event.transform;
      });
    svg.call(zoomBehavior);
    if (zoomRef) {
      zoomRef.current = zoomBehavior;
    }

    if (
      currentTransformRef.current &&
      currentTransformRef.current !== d3.zoomIdentity
    ) {
      svg.call(zoomBehavior.transform, currentTransformRef.current);
    }

    // 시뮬레이션 tick 핸들러
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as NodeDatum).x ?? 0)
        .attr("y1", (d) => (d.source as NodeDatum).y ?? 0)
        .attr("x2", (d) => (d.target as NodeDatum).x ?? 0)
        .attr("y2", (d) => (d.target as NodeDatum).y ?? 0);
      nodeGroup.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [
    svgRef,
    graphData,
    dimensions,
    currentNodeId,
    onNodeClick,
    router,
    zoomRef,
    currentTransformRef,
  ]);
};
