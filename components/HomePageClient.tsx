"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppBar from "./AppBar";
import LeftSidebar from "./SideBar/LeftSidebar";
import NoteGraph from "./NoteGraph/NoteGraph";
import type { TreeNode } from "../lib/utils";
import { filenameToSlug } from "../lib/utils";
import type { ProcessedNode } from "../lib/notes-processor";
import MarkdownRenderer from "./MarkdownRenderer";

const SimpleSpinner = () => (
  <motion.div
    key="spinner"
    className="fixed inset-0 flex items-center justify-center z-[9999] bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(0,0,0,0.6)]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  >
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--primary-light)] dark:border-[var(--primary-dark)]"></div>
  </motion.div>
);

interface HomePageClientProps {
  initialNodes: { id: string; label: string }[];
  initialEdges: { id: string; source: string; target: string }[];
  title: string;
  markdownContent: string;
  requestedNoteId: string;
  treeData: TreeNode[];
  notesMapByFullPathSlug: Map<string, ProcessedNode> | null;
  notesMapBySimpleSlug: Map<string, Set<string>> | null;
}

export default function HomePageClient({
  initialNodes,
  initialEdges,
  title,
  markdownContent,
  requestedNoteId,
  treeData,
  notesMapByFullPathSlug,
  notesMapBySimpleSlug,
}: HomePageClientProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  const toggleRightPanel = useCallback(
    () => setIsRightPanelOpen((prev) => !prev),
    []
  );

  const stopLoading = useCallback(() => setIsLoading(false), []);

  useEffect(() => {
    stopLoading();
  }, [requestedNoteId, stopLoading]);

  const handleNavigate = useCallback(
    (targetNoteId: string) => {
      if (targetNoteId === requestedNoteId) {
        // 이미 현재 보고 있는 노트인 경우 로딩 스피너를 띄우지 않음
        if (isMobileSidebarOpen) {
          setIsMobileSidebarOpen(false);
        }
        return;
      }

      // 다른 노트로 이동하는 경우 로딩 시작
      setIsLoading(true);

      // 모바일 사이드바가 열려있다면 닫기
      if (isMobileSidebarOpen) {
        setIsMobileSidebarOpen(false);
      }
    },
    [requestedNoteId, setIsLoading, isMobileSidebarOpen]
  );

  const wikiLinkOptions = {
    pageResolver: (name: string) => {
      const permalinkAsSlug = filenameToSlug(name.replace(/\.md$/, ""));
      if (notesMapByFullPathSlug?.has(permalinkAsSlug))
        return [permalinkAsSlug];
      if (notesMapBySimpleSlug?.has(permalinkAsSlug)) {
        const possibleFullSlugs = notesMapBySimpleSlug.get(permalinkAsSlug);
        if (possibleFullSlugs && possibleFullSlugs.size > 0)
          return Array.from(possibleFullSlugs);
      }
      return [permalinkAsSlug];
    },
    hrefTemplate: (resolvedPermalink: string) => `/?note=${resolvedPermalink}`,
    wikiLinkClassName: "internal-link",
    aliasDivider: "|",
  };

  const contentFadeTransition = {
    duration: 0.3,
    ease: "easeInOut",
  };

  const modalFadeTransition = {
    duration: 0.2,
    ease: "easeOut",
  };

  const CloseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );

  return (
    <div className="flex h-screen w-full bg-[var(--background)] transition-colors duration-150 ease-in-out md:flex-row flex-col">
      <AnimatePresence>{isLoading && <SimpleSpinner />}</AnimatePresence>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50">
        <AppBar siteTitle="Jeseong's" onToggleSidebar={toggleMobileSidebar} />
      </div>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-[rgba(0,0,0,0.4)] dark:bg-[rgba(0,0,0,0.6)] backdrop-blur-sm md:hidden"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
        ></div>
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--card-background)] shadow-xl py-4 z-40
                   transform transition-transform ease-in-out duration-300 md:hidden
                   ${
                     isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                   }`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <LeftSidebar
          treeData={treeData}
          currentNodeId={requestedNoteId}
          onToggleRightPanel={toggleRightPanel}
          onLinkClick={handleNavigate}
        />
        <button
          onClick={toggleMobileSidebar}
          className="mt-auto p-2 w-full text-left bg-[var(--accent-default-bg)] hover:bg-[var(--accent-selected-bg)] text-[var(--accent-default-fg)] hover:text-[var(--accent-selected-fg)] rounded transition-colors duration-150 ease-in-out"
        >
          Close
        </button>
      </div>

      <div className="hidden md:flex md:flex-col md:w-64 h-full bg-[var(--inverse-primary-light)] dark:bg-[var(--inverse-primary-dark)] md:rounded-lg overflow-y-auto flex-shrink-0 transition-colors duration-150 ease-in-out">
        <LeftSidebar
          treeData={treeData}
          currentNodeId={requestedNoteId}
          onToggleRightPanel={toggleRightPanel}
          onLinkClick={handleNavigate}
        />
      </div>

      <main className="flex-1 flex flex-col pt-16 md:pt-0 relative">
        <motion.div
          layout
          className={`bg-[var(--card-background)] text-[var(--foreground)] md:rounded-lg 
                      p-6 
                      ${isLoading ? "opacity-50" : ""}
                      flex-1 flex flex-col min-h-0 
                      overflow-y-auto 
                      `}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={requestedNoteId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={contentFadeTransition}
              className="w-full"
            >
              <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 text-[var(--foreground)] transition-colors duration-150 ease-in-out">
                  {title || requestedNoteId}
                </h1>
                {markdownContent ? (
                  <MarkdownRenderer
                    markdownContent={markdownContent}
                    wikiLinkOptions={wikiLinkOptions}
                    onLinkClick={handleNavigate}
                  />
                ) : (
                  <p className="text-[var(--foreground-muted)] transition-colors duration-150 ease-in-out">
                    Note{" "}
                    <span className="font-semibold">{requestedNoteId}</span> not
                    found or content is empty.
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </main>

      <AnimatePresence>
        {isRightPanelOpen && (
          <motion.div
            key="graph-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={modalFadeTransition}
            className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(0,0,0,0.7)] 
                       flex items-center justify-center p-4"
            onClick={toggleRightPanel}
          >
            <motion.div
              key="graph-modal-content"
              className="bg-[var(--card-background)] text-[var(--foreground)] 
                         rounded-lg shadow-xl w-full max-w-2xl h-[80vh] md:h-[75vh] 
                         flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ ...modalFadeTransition, delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)] flex-shrink-0">
                <h2 className="text-xl font-semibold">Knowledge Tree</h2>
                <button
                  onClick={toggleRightPanel}
                  className="p-1 text-[var(--foreground-muted)] hover:text-[var(--foreground)] rounded-md focus:outline-none focus:ring-1 focus:ring-inset focus:ring-[var(--primary-light)] dark:focus:ring-[var(--primary-dark)]"
                  aria-label="Close Knowledge Tree Modal"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="flex-grow w-full min-h-0 p-2 md:p-4">
                <NoteGraph
                  initialNodes={initialNodes}
                  initialEdges={initialEdges}
                  currentNodeId={requestedNoteId}
                  onNodeClick={handleNavigate}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
