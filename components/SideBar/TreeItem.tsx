// components/TreeItem.tsx
"use client";

import React from "react";
import Link from "next/link";
import {
  FolderOutline,
  FolderOpenOutline,
  DocumentTextOutline,
} from "react-ionicons";
import type { TreeItemProps } from "./sidebarTypes";

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  currentNodeId,
  expandedFolders,
  toggleFolder,
  onLinkClick,
}) => {
  const isFolder = node.type === "folder";
  const isExpanded = isFolder && expandedFolders.has(node.id);
  const isActive = node.id === currentNodeId;

  const indentStyle = { paddingLeft: `${node.depth * 0.75}rem` };

  // getItemClasses는 이제 주로 배경색과 공통 레이아웃, 비활성 텍스트 색상을 담당
  const getCommonItemClasses = (active: boolean) => {
    let baseClasses =
      "flex items-center px-2 py-1 rounded transition-colors duration-150 ease-in-out w-full text-left";
    if (active) {
      // 활성 상태: 배경색과 폰트 굵기만 여기서 처리
      return `${baseClasses} font-bold bg-[var(--accent-selected-bg)]`;
    } else {
      // 비활성 상태: 기본 텍스트 색상 및 호버 효과
      return `${baseClasses} text-[var(--foreground)] hover:bg-[var(--accent-default-bg)] hover:text-[var(--accent-default-fg)]`;
    }
  };

  // 텍스트 색상만 별도로 처리하는 함수 또는 조건부 클래스
  const getTextColorClasses = (active: boolean) => {
    if (active) {
      return `!text-[var(--accent-selected-fg)]`; // 활성 텍스트 색상
    }
    // 비활성 시에는 getCommonItemClasses 또는 Link의 기본 클래스에서 이미 처리됨
    // (text-[var(--foreground)] hover:text-[var(--accent-default-fg)])
    // 만약 Link 컴포넌트의 className에 직접 text-[var(--foreground)] 등을 넣어주려면 여기서 반환
    return `text-[var(--foreground)] hover:text-[var(--accent-default-fg)]`;
  };

  const iconColor = isActive
    ? "var(--accent-selected-fg)"
    : "var(--foreground-muted)";

  if (isFolder) {
    return (
      <li key={node.id}>
        <div className={getCommonItemClasses(isActive)} style={indentStyle}>
          <span
            onClick={(e) => {
              e.stopPropagation();
              toggleFolder(node.id);
            }}
            className={`cursor-pointer mr-1 ml-0 flex-shrink-0 p-1 rounded ${
              isActive ? "" : "hover:bg-[var(--accent-default-bg)]"
            }`}
            aria-label={isExpanded ? "Collapse folder" : "Expand folder"}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") toggleFolder(node.id);
            }}
          >
            {isExpanded ? (
              <FolderOpenOutline color={iconColor} height="16px" width="16px" />
            ) : (
              <FolderOutline color={iconColor} height="16px" width="16px" />
            )}
          </span>
          <Link
            href={`/?note=${node.id}`}
            className={`truncate flex-grow ${getTextColorClasses(isActive)}`}
            onClick={(e) => {
              if (onLinkClick) {
                onLinkClick(node.id);
              }
            }}
          >
            {node.name}
          </Link>
        </div>
        {isExpanded && node.children && node.children.length > 0 && (
          <ul className="pl-0">
            {node.children.map((child) => (
              <TreeItem
                key={child.id}
                node={child}
                currentNodeId={currentNodeId}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onLinkClick={onLinkClick}
              />
            ))}
          </ul>
        )}
      </li>
    );
  } else {
    const fileItemClasses = `${getCommonItemClasses(
      isActive
    )} ${getTextColorClasses(isActive)}`;

    return (
      <li key={node.id}>
        <Link
          href={`/?note=${node.id}`}
          className={fileItemClasses}
          style={indentStyle}
          onClick={() => {
            if (onLinkClick) {
              onLinkClick(node.id);
            }
          }}
        >
          <DocumentTextOutline
            color={
              isActive ? "var(--accent-selected-fg)" : "var(--foreground-muted)"
            }
            height="16px"
            width="16px"
            className="mr-1 ml-0 flex-shrink-0"
          />
          <span className="truncate">{node.name}</span>
        </Link>
      </li>
    );
  }
};

export default TreeItem;
