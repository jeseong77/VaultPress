# VaultPress - Obsidian 기반 정적 웹사이트 퍼블리셔

### [Example](https://www.jeseong.com)

**VaultPress**는 [Obsidian](https://obsidian.md/) Vault의 Markdown 노트들을 활용하여 빠르고 현대적인 정적 웹사이트를 구축하는 솔루션입니다. 개인 지식 베이스, 기술 블로그, 디지털 정원 등을 손쉽게 웹으로 발행하고 공유할 수 있도록 지원합니다.

## 💡 주요 컨셉

* **Obsidian 중심**: Obsidian 환경에서 `vault/` 폴더 내의 콘텐츠를 관리합니다.
* **정적 사이트 생성**: **Next.js**를 활용하여 빌드 시점에 최적화된 정적 페이지들을 생성합니다.
* **간편한 설정 및 배포**: `site.config.js` 파일로 사이트의 주요 설정을 관리하며, Vercel/Netlify 등을 통해 GitHub Push 시 자동 배포가 가능합니다.

## 🛠️ 기술 스택

* **프레임워크**: Next.js (v15)
* **언어**: TypeScript (v5)
* **스타일링**: Tailwind CSS (v4), CSS Variables (다크/라이트 모드 지원)
* **Markdown 처리**:
    * `remark` (v15.0.1) / `rehype` (v11.1.2 for `remark-rehype`)
    * `gray-matter` (v4.0.3) - Frontmatter 파싱
    * `remark-gfm` (v4.0.1) - GitHub Flavored Markdown
    * `remark-wiki-link` (v2.0.1) - Obsidian 스타일 위키링크
    * `rehype-raw` (v7.0.0) - HTML 직접 사용 지원
    * `rehype-pretty-code` (v0.14.1) & `shiki` (v3.4.0) - 코드 구문 강조
* **노트 연결 시각화**: D3.js (v7.9.0)
* **상태 및 테마 관리**: React Context API, `next-themes` (v0.4.6)
* **애니메이션**: `framer-motion` (v12.11.3)
* **아이콘**: `react-ionicons` (v4.2.1)
* **개발 도구**: ESLint (v9)

## ⚙️ 주요 기능 및 구현

* **Markdown 콘텐츠 처리 (`lib/notes-processor.ts`)**:
    * `vault/` 내 `.md` 파일들을 재귀적으로 탐색하여 frontmatter와 본문 내용을 파싱합니다 (`glob` v11.0.2 활용).
    * Obsidian 스타일의 내부 링크 (`[[위키링크]]`) 및 이미지 경로를 웹 환경에 맞게 변환합니다.
    * 노트 간 연결 정보를 추출하여 그래프 데이터(노드, 간선)를 생성합니다.
* **동적 라우팅 및 페이지 렌더링 (`src/app/`)**:
    * 파일 경로를 기반으로 슬러그(slug)를 생성하고, 이를 웹 페이지 경로로 매핑합니다.
    * `src/app/page.tsx`에서 요청된 슬러그에 해당하는 노트 데이터를 가져와 `MarkdownRenderer.tsx` 컴포넌트 (`react-markdown` v10.1.0 사용)를 통해 렌더링합니다.
* **사용자 인터페이스 (`src/components/`)**:
    * `AppBar.tsx`: 상단 네비게이션 및 테마 전환 기능 제공.
    * `LeftSidebar.tsx`: 파일/폴더 계층 구조를 트리 형태로 시각화하여 탐색 편의성 제공.
    * `NoteGraph.tsx`: D3.js를 사용하여 노트 간의 관계를 인터랙티브한 그래프로 표현 (`reactflow` v11.11.4와 함께 사용될 수 있음 - package.json에 명시됨).
    * `ThemeProvider.tsx`: `next-themes`를 활용한 다크/라이트 모드 관리.
* **전역 설정 (`site.config.js`)**:
    * 사이트 제목, 설명, URL, 기본 노트, UI 텍스트 등 주요 설정을 한 곳에서 관리합니다.

## 🚀 시작하기

1.  **저장소 복제 (Clone)**:
    ```bash
    git clone [https://github.com/jeseong77/obsidian-website.git](https://github.com/jeseong77/obsidian-website.git)
    cd obsidian-website
    ```
2.  **의존성 설치**:
    ```bash
    npm install # 또는 yarn install / pnpm install
    ```
3.  **설정 파일 수정**: `site.config.js` 파일을 열어 본인의 정보로 수정합니다. (특히 `siteUrl`, `title`, `defaultNoteSlug`)
4.  **콘텐츠 작성**: `vault/` 디렉터리를 Obsidian으로 열고 노트를 작성합니다.
5.  **개발 서버 실행**:
    ```bash
    npm run dev
    ```
    브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다. (Turbopack 사용)

## 🌐 배포

GitHub 저장소를 Vercel 또는 Netlify에 연결하여 정적 사이트로 손쉽게 배포할 수 있습니다. 이후 `main` (또는 기본) 브랜치에 Push 할 때마다 자동으로 사이트가 업데이트됩니다.

## 📄 라이선스

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[MIT License](LICENSE.md)

---
