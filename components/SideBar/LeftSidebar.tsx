"use client";

import React from "react";
import { useTheme } from "next-themes";
import { SearchOutline, Sunny, Moon, GridOutline } from "react-ionicons";
import type { LeftSidebarProps } from "./sidebarTypes";
import TreeItem from "./TreeItem";
import { useSidebarState } from "./hooks/useSidebarState";
import siteConfig from "../../site.config";

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  treeData = [],
  currentNodeId,
  onToggleRightPanel,
  onLinkClick,
  sideBarTitle = siteConfig.sideBar.title
}) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { mounted, expandedFolders, toggleFolder } = useSidebarState(
    currentNodeId ?? undefined
  );

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const renderThemeIcon = () => {
    if (!mounted) return <div className="w-[18px] h-[18px]" />;
    const iconColor =
      resolvedTheme === "dark" ? "var(--primary-dark)" : "var(--primary-light)";
    return resolvedTheme === "light" ? (
      <Sunny color={iconColor} height="18px" width="18px" />
    ) : (
      <Moon color={iconColor} height="18px" width="18px" />
    );
  };

  const gridIconColor = mounted ? "var(--foreground-muted)" : "transparent";

  return (
    <div className="p-4 bg-[var(--background)] h-full flex flex-col transition-colors duration-150 ease-in-out">
      <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 transition-colors duration-150 ease-in-out">
        {sideBarTitle}
      </h2>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pr-10 rounded bg-[var(--search-input-background)] text-[var(--search-input-text-color)] focus:outline-none transition-colors duration-150 ease-in-out placeholder:text-[var(--search-input-placeholder-color)]"
        />
        <SearchOutline
          color="var(--search-input-icon-color)"
          height="18px"
          width="18px"
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-[var(--accent-default-bg)] rounded transition-colors duration-150 ease-in-out focus:outline-none"
          title="Toggle Dark Mode"
        >
          {renderThemeIcon()}
        </button>
        {onToggleRightPanel && (
          <button
            onClick={onToggleRightPanel}
            className="p-2 hover:bg-[var(--accent-default-bg)] rounded transition-colors duration-150 ease-in-out focus:outline-none"
            title="Toggle Right Panel"
          >
            <GridOutline color={gridIconColor} height="18px" width="18px" />
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-grow">
        <h3
          className="text-lg font-semibold mb-1 sticky top-0 py-1 z-10 transition-colors duration-150 ease-in-out
                     px-1
                     bg-[var(--tertiary-container-light)] text-[var(--on-tertiary-container-light)]
                     dark:bg-[var(--tertiary-container-dark)] dark:text-[var(--on-tertiary-container-dark)]
                     rounded-md"
        >
          Explorer
        </h3>
        <ul className="text-sm space-y-1 pt-1 pb-2 px-1 rounded-b-md">
          {treeData.map((node) => (
            <TreeItem
              key={node.id}
              node={node}
              currentNodeId={currentNodeId}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              onLinkClick={onLinkClick}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
