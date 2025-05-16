// components/AppBar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MenuOutline, SearchOutline, Sunny, Moon } from "react-ionicons";
import siteConfig from '../site.config';

interface AppBarProps {
  siteTitle?: string;
  onToggleSidebar: () => void;
}

const AppBar: React.FC<AppBarProps> = ({
  siteTitle = siteConfig.title,
  onToggleSidebar,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const renderThemeChanger = () => {
    if (!mounted) {
      return <div className="w-6 h-6" />;
    }
    const iconColor =
      resolvedTheme === "dark"
        ? "var(--primary-dark)"
        : "var(--primary-light)";

    if (resolvedTheme === "dark") {
      return <Moon color={iconColor} height="24px" width="24px" />;
    } else {
      return <Sunny color={iconColor} height="24px" width="24px" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 py-3 bg-[var(--card-background)] text-[var(--foreground)] h-16 transition-colors duration-150 ease-in-out">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-md hover:bg-[var(--accent-default-bg)] focus:outline-none mr-2 transition-colors duration-150 ease-in-out"
        >
          <MenuOutline color="currentColor" height="24px" width="24px" />
        </button>
        <h1 className="text-xl font-semibold hidden sm:block transition-colors duration-150 ease-in-out">
          {siteTitle}
        </h1>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:block"
        >
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-40 sm:w-64 text-sm text-[var(--foreground)] bg-[var(--card-background)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-transparent transition-colors duration-150 ease-in-out placeholder:text-[var(--foreground-muted)]"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--foreground-muted)] transition-colors duration-150 ease-in-out">
            <SearchOutline color="currentColor" height="20px" width="20px" />
          </div>
        </form>

        <button
          className="p-2 rounded-md hover:bg-[var(--accent-default-bg)] md:hidden text-[var(--foreground-muted)] focus:outline-none transition-colors duration-150 ease-in-out"
          aria-label="Search"
        >
          <SearchOutline color="currentColor" height="20px" width="20px" />
        </button>

        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="p-2 rounded-md hover:bg-[var(--accent-default-bg)] focus:outline-none transition-colors duration-150 ease-in-out"
        >
          {renderThemeChanger()}
        </button>
      </div>
    </header>
  );
};

export default AppBar;
