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

  const getCommonItemClasses = (active: boolean) => {
    let baseClasses =
      "flex items-center px-2 py-1 rounded transition-colors duration-150 ease-in-out w-full text-left";
    if (active) {
      return `${baseClasses} font-bold bg-[var(--accent-selected-bg)]`;
    } else {
      return `${baseClasses} text-[var(--foreground)] hover:bg-[var(--accent-default-bg)] hover:text-[var(--accent-default-fg)]`;
    }
  };

  const getTextColorClasses = (active: boolean) => {
    if (active) {
      return `!text-[var(--accent-selected-fg)]`;
    }
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
