// components/SimpleSpinner.tsx
"use client";

import React from "react";

const SimpleSpinner: React.FC = () => (
  <div
    className="absolute inset-0 flex items-center justify-center z-[9999] transition-opacity duration-150 ease-in-out"
    // ✨ 인라인 스타일로 직접 RGBA 배경색 적용 (Tailwind 클래스 bg-[...] 및 bg-opacity-* 제거)
    //    라이트 모드와 다크 모드 스타일을 분리하기 위해,
    //    실제로는 컴포넌트 내부에서 theme을 확인하고 style 객체를 동적으로 생성해야 하지만,
    //    여기서는 Tailwind의 dark: 접두사를 활용할 수 없으므로, 우선 라이트 모드 기준으로 테스트하거나,
    //    JavaScript로 테마를 감지하여 style을 동적으로 설정해야 합니다.
    //
    //    가장 간단한 테스트는 일단 하나의 고정된 RGBA 값을 넣는 것입니다.
    //    만약 이것이 작동한다면, 문제는 CSS 변수 참조 또는 Tailwind의 CSS 변수+opacity 처리 방식에 있습니다.
    //
    //    더 나은 테스트를 위해, Tailwind의 임의 값 기능을 사용하여 다크모드까지 처리해보겠습니다.
    //    Tailwind는 className 내에서 직접 rgba 값을 사용할 수 있습니다.
    //    예: bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(0,0,0,0.6)]
    //
    //    기존 className 구조를 최대한 활용하면서 테스트해보겠습니다.
    //    bg-[var(--scrim-light)] -> bg-[rgba(0,0,0,0.5)] 로 직접 변경
    //    dark:bg-[var(--scrim-dark)] -> dark:bg-[rgba(0,0,0,0.6)] 로 직접 변경
    //    bg-opacity-* 클래스는 제거합니다.
  >
    {/* 스피너 내부 요소는 그대로 유지 */}
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[var(--primary-light)] dark:border-[var(--primary-dark)]"></div>
  </div>
);

// export default SimpleSpinner; // 만약 SimpleSpinner가 HomePageClient.tsx 외부에 있다면 export

// HomePageClient.tsx 내부의 SimpleSpinner 정의를 직접 수정하는 것이 좋습니다.
// 아래는 HomePageClient.tsx 내부의 SimpleSpinner를 수정하는 예시입니다.
