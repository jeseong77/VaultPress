"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

interface ThemeColorSynchronizerProps {
  lightColor: string;
  darkColor: string;
}

const ThemeColorSynchronizer: React.FC<ThemeColorSynchronizerProps> = ({
  lightColor,
  darkColor,
}) => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const metaThemeColorTag = document.querySelector(
      "meta[name='theme-color']"
    );
    const newColor = resolvedTheme === "dark" ? darkColor : lightColor;

    if (metaThemeColorTag) {
      metaThemeColorTag.setAttribute("content", newColor);
    } else {
      const newMetaTag = document.createElement("meta");
      newMetaTag.name = "theme-color";
      newMetaTag.content = newColor;
      document.head.appendChild(newMetaTag);
    }
  }, [resolvedTheme, lightColor, darkColor]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default ThemeColorSynchronizer;
