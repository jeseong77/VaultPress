// TreeNode
export interface TreeNode {
  id: string;
  name: string;
  type: "file" | "folder";
  depth: number;
  children?: TreeNode[];
}

// LeftSidebar
export interface LeftSidebarProps {
  treeData: TreeNode[];
  currentNodeId?: string | null;
  onToggleRightPanel?: () => void;
  onLinkClick?: (targetNoteId: string) => void;
  sideBarTitle?: string;
}

// TreeItem
export interface TreeItemProps {
  node: TreeNode;
  currentNodeId?: string | null;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  onLinkClick?: (targetNoteId: string) => void;
}
