import fs from "fs";
import path from "path";
import { glob } from "glob";
import { filenameToSlug } from "./utils";

// Obsidian vault (노트 저장소) 디렉토리 경로
const vaultDir = path.join(process.cwd(), "vault");

/**
 * 처리된 각 노트의 메타데이터 구조 정의.
 */
export interface ProcessedNode {
  slug: string; // 정규화된 전체 경로 슬러그 (예: 'folder-name/note-name')
  title: string; // 원본 제목 (예: 'Note Name')
  filePath: string; // vault 기준 상대 파일 경로 (예: 'Folder Name/Note Name.md')
  simpleSlug: string; // 정규화된 단순 파일명 슬러그 (예: 'note-name')
}

/**
 * 그래프 시각화를 위한 노드 구조 정의.
 */
export interface GraphNode {
  id: string; // ProcessedNode의 slug와 동일
  label: string; // ProcessedNode의 title과 동일
}

/**
 * 그래프 시각화를 위한 엣지(연결선) 구조 정의.
 */
export interface GraphEdge {
  id: string; // "sourceSlug->targetSlug" 형태의 고유 ID
  source: string; // 연결 시작 노트의 slug
  target: string; // 연결 대상 노트의 slug
}

// 모든 처리된 노트 정보를 메모리에 캐싱하기 위한 변수
let allProcessedNotes: ProcessedNode[] | null = null;
// Key: 정규화된 전체 경로 슬러그 (예: 'folder-name/note-name'), Value: ProcessedNode
// 전체 경로 슬러그를 통해 노트 정보를 빠르게 찾기 위한 맵
let notesMapByFullPathSlug: Map<string, ProcessedNode> | null = null;
// Key: 정규화된 단순 파일명 슬러그 (예: 'note-name'), Value: Set<정규화된 전체 경로 슬러그>
// 단순 파일명 슬러그를 통해 노트 정보(들)을 찾기 위한 맵 (동일 파일명 처리)
let notesMapBySimpleSlug: Map<string, Set<string>> | null = null;

/**
 * Vault 디렉토리에서 모든 마크다운 파일을 읽고,
 * 각 파일의 메타데이터(슬러그, 제목, 경로 등)를 처리하여
 * 내부 캐시 변수(allProcessedNotes, notesMapByFullPathSlug, notesMapBySimpleSlug)를 초기화합니다.
 * 프로덕션 환경에서는 한 번만 실행됩니다.
 */
export async function initializeNotesData(): Promise<void> {
  if (notesMapByFullPathSlug && process.env.NODE_ENV === "production") {
    return;
  }
  const files = await glob("**/*.md", {
    cwd: vaultDir,
    ignore: ["node_modules/**", "**/.*"],
    nodir: true,
    posix: true, // Unix 스타일 경로 구분자 사용 보장
  });

  const processedNotesList: ProcessedNode[] = [];
  notesMapByFullPathSlug = new Map<string, ProcessedNode>();
  notesMapBySimpleSlug = new Map<string, Set<string>>();

  files.forEach((filePath) => {
    const title = path.basename(filePath).replace(/\.md$/, "");
    // 전체 경로를 포함하여 슬러그 생성 (예: 'folder/note-name')
    const fullPathSlug = filenameToSlug(filePath.replace(/\.md$/, ""));
    // 파일명만을 사용하여 슬러그 생성 (예: 'note-name')
    const simpleSlug = filenameToSlug(title);

    const noteData: ProcessedNode = {
      slug: fullPathSlug,
      title,
      filePath,
      simpleSlug,
    };
    processedNotesList.push(noteData);

    notesMapByFullPathSlug!.set(fullPathSlug, noteData);

    if (!notesMapBySimpleSlug!.has(simpleSlug)) {
      notesMapBySimpleSlug!.set(simpleSlug, new Set());
    }
    notesMapBySimpleSlug!.get(simpleSlug)!.add(fullPathSlug);
  });

  allProcessedNotes = processedNotesList;
}

/**
 * 모든 노트의 슬러그와 제목 목록을 반환합니다.
 * 주로 파일 트리나 전체 노트 목록 표시에 사용됩니다.
 * 데이터가 초기화되지 않았다면 내부적으로 initializeNotesData를 호출합니다.
 */
export async function getAllNotesForTree(): Promise<
  Pick<ProcessedNode, "slug" | "title">[]
> {
  if (!allProcessedNotes) await initializeNotesData();
  return allProcessedNotes!.map((note) => ({
    slug: note.slug,
    title: note.title,
  }));
}

/**
 * (내부 헬퍼 함수) 요청된 슬러그(단순 파일명 슬러그 또는 전체 경로 슬러그)를 기반으로
 * 해당하는 노트 정보를 찾습니다.
 * 전체 경로 슬러그를 우선 검색하고, 없으면 단순 파일명 슬러그로 검색합니다.
 * 단순 파일명 슬러그로 여러 노트가 매칭될 경우, 그 중 첫 번째 노트를 반환합니다.
 */
function findNoteByRequestedSlug(
  requestedSlug: string
): ProcessedNode | undefined {
  if (!notesMapByFullPathSlug || !notesMapBySimpleSlug) {
    // 데이터가 로드되지 않은 경우 초기화 시도 또는 오류 반환 필요
    // 이 함수는 initializeNotesData가 호출된 후에 사용된다고 가정
    return undefined;
  }

  // 1. 요청된 슬러그가 전체 경로 슬러그와 일치하는지 확인
  if (notesMapByFullPathSlug.has(requestedSlug)) {
    return notesMapByFullPathSlug.get(requestedSlug);
  }

  // 2. 요청된 슬러그가 단순 파일명 슬러그와 일치하는지 확인
  const possibleFullPathSlugs = notesMapBySimpleSlug.get(requestedSlug);
  if (possibleFullPathSlugs) {
    if (possibleFullPathSlugs.size === 1) {
      // 정확히 하나의 노트만 매칭되는 경우
      const fullPathSlug = possibleFullPathSlugs.values().next().value;
      if (fullPathSlug) {
        return notesMapByFullPathSlug.get(fullPathSlug);
      }
    } else if (possibleFullPathSlugs.size > 1) {
      // 여러 노트가 매칭되는 경우 (예: 다른 폴더에 동일한 파일명)
      // 여기서는 첫 번째 매칭되는 노트를 반환 (개선 가능 지점: 사용자에게 선택지를 주거나, 우선순위 규칙 적용)
      console.warn(
        `Warning: Simple slug '${requestedSlug}' mapped to multiple notes. Returning the first one.`
      );
      const firstMatch = possibleFullPathSlugs.values().next().value;
      if (firstMatch) {
        return notesMapByFullPathSlug.get(firstMatch);
      }
    }
  }

  return undefined; // 어떤 맵에서도 찾지 못한 경우
}

/**
 * 주어진 슬러그(URL에서 추출된 값, 예: 'cs' 또는 'folder/sub-folder/note-name')에 해당하는
 * 노트의 제목, 마크다운 내용, 그리고 실제 전체 경로 슬러그를 반환합니다.
 * 데이터가 초기화되지 않았다면 내부적으로 initializeNotesData를 호출합니다.
 */
export async function getNoteContentBySlug(
  requestedSlug: string
): Promise<{ title: string; markdownContent: string; slug: string } | null> {
  if (!notesMapByFullPathSlug || !notesMapBySimpleSlug) {
    // 데이터 초기화 보장
    await initializeNotesData();
  }

  const noteInfo = findNoteByRequestedSlug(requestedSlug);

  if (!noteInfo) {
    console.log(`Note not found for slug: ${requestedSlug}`);
    return null;
  }

  const fullPath = path.join(vaultDir, noteInfo.filePath);
  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    return {
      title: noteInfo.title,
      markdownContent: fileContents,
      slug: noteInfo.slug, // 실제 사용된 전체 경로 슬러그 반환
    };
  } catch (error) {
    console.error(
      `Error reading file for slug ${requestedSlug} at ${fullPath}:`,
      error
    );
    return null;
  }
}

/**
 * 모든 노트 간의 위키링크(wikilink, 예: [[Note Name]])를 분석하여
 * 그래프 시각화에 필요한 노드 및 엣지(연결선) 데이터를 생성합니다.
 * 데이터가 초기화되지 않았다면 내부적으로 initializeNotesData를 호출합니다.
 */
export async function buildGraphDataForRender(): Promise<{
  nodes: GraphNode[];
  edges: GraphEdge[];
}> {
  if (!allProcessedNotes || !notesMapByFullPathSlug || !notesMapBySimpleSlug) {
    await initializeNotesData();
  }

  const nodes: GraphNode[] = allProcessedNotes!.map((note) => ({
    id: note.slug,
    label: note.title,
  }));

  const edges: GraphEdge[] = [];
  const wikilinkRegex = /\[\[([^\]#|]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g;

  for (const sourceNote of allProcessedNotes!) {
    let fileContents = "";
    const fullPath = path.join(vaultDir, sourceNote.filePath);
    try {
      fileContents = fs.readFileSync(fullPath, "utf8");
    } catch (e) {
      continue; // 파일 읽기 실패 시 해당 노트는 건너뜀
    }

    let match;
    while ((match = wikilinkRegex.exec(fileContents)) !== null) {
      const linkTargetName = match[1].trim();
      const requestedTargetSlug = filenameToSlug(linkTargetName);

      // 변환된 슬러그를 사용하여 대상 노트 정보 검색
      const targetNoteInfo = findNoteByRequestedSlug(requestedTargetSlug);

      if (targetNoteInfo && sourceNote.slug !== targetNoteInfo.slug) {
        edges.push({
          id: `${sourceNote.slug}->${targetNoteInfo.slug}`,
          source: sourceNote.slug,
          target: targetNoteInfo.slug,
        });
      }
    }
  }
  return { nodes, edges };
}

/**
 * 초기화된 노트 정보 맵(notesMapByFullPathSlug, notesMapBySimpleSlug)을 반환합니다.
 * 주로 remark-wiki-link 플러그인에서 링크를 올바른 경로로 변환(resolve)할 때 사용됩니다.
 * 데이터가 초기화되지 않았다면 내부적으로 initializeNotesData를 호출합니다.
 */
export async function getNoteSlugMaps(): Promise<{
  notesMapByFullPathSlug: Map<string, ProcessedNode>;
  notesMapBySimpleSlug: Map<string, Set<string>>;
}> {
  if (!allProcessedNotes) {
    await initializeNotesData();
  }
  // null일 가능성에 대한 방어 코드
  if (!notesMapByFullPathSlug || !notesMapBySimpleSlug) {
    throw new Error("Note maps could not be initialized.");
  }
  return {
    notesMapByFullPathSlug,
    notesMapBySimpleSlug,
  };
}
