import HomePageClient from "../../components/HomePageClient";
import {
  buildGraphDataForRender,
  getAllNotesForTree,
  getNoteContentBySlug,
  getNoteSlugMaps,
} from "../../lib/notes-processor";
import { filenameToSlug, type TreeNode } from "../../lib/utils";
import path from "path";
import siteConfig from '../../site.config';

function buildFileTree(notes: { slug: string; title: string }[]): TreeNode[] {
  const tree: TreeNode[] = [];
  const map = new Map<string, TreeNode>();

  notes.forEach((noteInfo) => {
    const parts = noteInfo.slug.split("/");

    let pathPrefixForSegmentNameLookup = "";
    const originalPathSegmentsNames = parts.map((slugSegment) => {
      const cumulativeSlugForThisSegment = pathPrefixForSegmentNameLookup
        ? `${pathPrefixForSegmentNameLookup}/${slugSegment}`
        : slugSegment;
      const definingNote = notes.find(
        (n) => n.slug === cumulativeSlugForThisSegment
      );
      const name = definingNote
        ? definingNote.title
        : slugSegment.replace(/-/g, " ");
      pathPrefixForSegmentNameLookup = cumulativeSlugForThisSegment;
      return name;
    });

    let currentProcessingPathSlug = "";

    for (let i = 0; i < parts.length; i++) {
      const partSlugSegment = parts[i];
      const partOriginalName = originalPathSegmentsNames[i];

      const parentPathForLinking = currentProcessingPathSlug;
      currentProcessingPathSlug = currentProcessingPathSlug
        ? `${currentProcessingPathSlug}/${partSlugSegment}`
        : partSlugSegment;

      let node = map.get(currentProcessingPathSlug);

      if (!node) {
        const isFileNode = i === parts.length - 1;
        const nodeType = isFileNode ? "file" : "folder";

        node = {
          id: currentProcessingPathSlug,
          name: partOriginalName,
          type: nodeType,
          depth: i,
        };
        if (nodeType === "folder") {
          node.children = [];
        }
        map.set(currentProcessingPathSlug, node);

        if (i === 0) {
          if (!tree.some((rootNode) => rootNode.id === node!.id)) {
            tree.push(node);
          }
        } else {
          const parentNode = map.get(parentPathForLinking);
          if (
            parentNode &&
            parentNode.type === "folder" &&
            parentNode.children
          ) {
            if (!parentNode.children.some((child) => child.id === node!.id)) {
              parentNode.children.push(node);
            }
          } else if (parentNode && parentNode.type === "file") {
            parentNode.type = "folder";
            parentNode.children = parentNode.children || [];
            if (!parentNode.children.some((child) => child.id === node!.id)) {
              parentNode.children.push(node);
            }
          }
        }
      } else {
        if (node.type === "file" && i < parts.length - 1) {
          node.type = "folder";
          node.children = node.children || [];
        }
        if (
          node.name !== partOriginalName &&
          notes.find(
            (n) =>
              n.slug === currentProcessingPathSlug &&
              n.title === partOriginalName
          )
        ) {
        }
      }
    }
  });

  const sortTree = (nodesToSort: TreeNode[]): void => {
    nodesToSort.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });
    nodesToSort.forEach((node) => {
      if (node.type === "folder" && node.children) {
        sortTree(node.children);
      }
    });
  };
  sortTree(tree);
  return tree;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomePageWrapper({
  searchParams: searchParamsPromise,
}: PageProps) {

  const searchParams = await searchParamsPromise;
  let noteQueryParam = searchParams?.note as string;
  if (Array.isArray(searchParams?.note)) noteQueryParam = searchParams.note[0];

  const requestedSlug = filenameToSlug(noteQueryParam || siteConfig.defaultNoteSlug);

  const noteContentData = await getNoteContentBySlug(requestedSlug);
  const { nodes: graphNodes, edges: graphEdges } =
    await buildGraphDataForRender();
  const allNotesForTree = await getAllNotesForTree();
  const treeData = buildFileTree(allNotesForTree);
  const { notesMapByFullPathSlug, notesMapBySimpleSlug } = await getNoteSlugMaps();

  // 메인 렌더링
  return (
    <HomePageClient
      initialNodes={graphNodes}
      initialEdges={graphEdges}
      title={
        noteContentData?.title ||
        path.basename(requestedSlug.replace(/-/g, " "))
      }
      markdownContent={
        noteContentData?.markdownContent ||
        `Note '${requestedSlug}' not found or content is empty.`
      }
      requestedNoteId={requestedSlug}
      treeData={treeData}
      notesMapByFullPathSlug={notesMapByFullPathSlug}
      notesMapBySimpleSlug={notesMapBySimpleSlug} 
    />
  );
}
