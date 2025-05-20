import { useState, useEffect, useCallback } from "react";

export const useSidebarState = (currentNodeId?: string) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (currentNodeId) {
      const parts = currentNodeId.split("/");
      if (parts.length > 1) {
        // 파일이 폴더 내에 있는 경우에만
        const pathsToExpand = new Set<string>();
        let currentPath = "";
        for (let i = 0; i < parts.length - 1; i++) {
          // 마지막 파일 이름은 제외
          currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
          pathsToExpand.add(currentPath);
        }
        setExpandedFolders(pathsToExpand);
      } else {
        // 루트 파일이거나 폴더가 없는 경우 모든 폴더를 닫음 (선택적)
        setExpandedFolders(new Set());
      }
    } else {
      // currentNodeId가 없으면 모든 폴더 닫음 (선택적)
      setExpandedFolders(new Set());
    }
  }, [currentNodeId]); // currentNodeId가 변경될 때마다 실행

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  }, []);

  return {
    mounted,
    expandedFolders,
    toggleFolder,
  };
};
