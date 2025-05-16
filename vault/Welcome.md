
# 환영합니다! 나만의 디지털 정원(Digital Garden) 만들기 🪴

이 프로젝트는 여러분의 [Obsidian](https://obsidian.md/) Vault를 멋진 정적 웹사이트로 만들어주는 도구입니다. 여러분의 노트를 쉽게 웹에 게시하고 공유할 수 있도록 설계되었습니다.

Markdown으로 생각을 정리하고, 이 프로젝트를 통해 자동으로 웹사이트에 반영하세요!

## 주요 특징

* **Obsidian 통합**: 여러분이 이미 사용하고 있는 Obsidian 환경에서 `vault` 폴더의 콘텐츠를 직접 관리하고 작성할 수 있습니다.
* **쉬운 설정**: `site.config.js` 파일 하나만 수정하여 웹사이트의 제목, 설명, URL, 테마 등 대부분의 설정을 변경할 수 있습니다.
* **자동 배포**: GitHub 저장소에 변경 사항을 Push 하기만 하면, [Vercel](https://vercel.com/)이나 [Netlify](https://www.netlify.com/)와 같은 호스팅 서비스를 통해 웹사이트가 자동으로 업데이트됩니다.
* **Markdown 지원**: 표준 Markdown 문법과 위키링크 스타일의 내부 링크를 지원하여 노트 간의 연결을 쉽게 표현할 수 있습니다.
* **커스터마이징 가능**: 기본 제공되는 테마와 레이아웃을 사용하거나, React 컴포넌트 및 CSS를 직접 수정하여 원하는 대로 디자인을 변경할 수 있습니다. (고급 사용자)

## 시작하기

다음 단계를 따라 여러분만의 웹사이트를 만들어보세요.

### 1단계: 프로젝트 포크(Fork) 및 클론(Clone)

1.  **GitHub 저장소 포크**: 이 프로젝트의 GitHub 저장소 페이지 우측 상단의 "Fork" 버튼을 클릭하여 여러분의 GitHub 계정으로 복제합니다.
2.  **로컬 환경에 클론**: 포크한 여러분의 저장소를 로컬 컴퓨터로 클론합니다.
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
    cd YOUR_REPOSITORY_NAME
    ```
    (여기서 `YOUR_USERNAME`과 `YOUR_REPOSITORY_NAME`을 여러분의 정보로 바꿔주세요.)

### 2단계: 의존성 설치

프로젝트 폴더로 이동한 후, 필요한 Node.js 패키지들을 설치합니다.
```bash
npm install
# 또는 yarn을 사용한다면
# yarn install
# 또는 pnpm을 사용한다면
# pnpm install
````

### 3단계: 웹사이트 설정

프로젝트 루트 디렉터리에 있는 `site.config.js` 파일을 열어 웹사이트의 주요 정보를 수정합니다. 이 파일은 여러분의 웹사이트를 개인화하는 가장 중요한 단계입니다\!

```javascript
// site.config.js 예시
const siteConfig = {
  title: "나의 멋진 블로그", // 웹사이트 제목
  description: "나의 생각과 지식을 공유하는 공간입니다.", // 웹사이트 설명
  siteUrl: "[https://your-unique-domain.com](https://your-unique-domain.com)", // ✨ 여러분의 웹사이트 도메인으로 변경하세요!
  lang: "ko", // 기본 언어 (예: "en", "ko")
  defaultNoteSlug: "home", // ✨ 웹사이트 접속 시 보여줄 기본 노트 슬러그 (예: 'home', 'index', 'welcome')
  // ... 기타 설정들 ...
  // 예: appBar, sidebar 등의 설정도 이곳에서 관리합니다.
  // appBar: {
  //   searchPlaceholder: "노트 검색...",
  // },
  // sidebar: {
  //   ownerName: "홍길동",
  //   searchPlaceholder: "파일 검색...",
  //   explorerTitle: "탐색기",
  //   tooltips: {
  //     toggleDarkMode: "다크/라이트 모드 전환",
  //     toggleRightPanel: "그래프 패널 토글",
  //   }
  // }
};

export default siteConfig;
```

**중요**:

  * `siteUrl`을 여러분이 사용할 실제 도메인으로 변경해야 합니다.
  * `defaultNoteSlug`는 웹사이트의 첫 페이지로 보여줄 노트의 파일명(확장자 제외, 슬러그 형태)으로 설정하세요. (예로 현제 'welcome'으로 되어 있습니다)
  * `title` 및 기타 placeholder 값들을 여러분의 정보로 채워주세요.

### 4단계: 콘텐츠 작성

1.  **Obsidian으로 'vault' 폴더 열기**:
      * Obsidian을 실행합니다.
      * "Open folder as vault" (또는 "다른 Vault 열기" \> "Vault 열기") 옵션을 선택하고, 이 프로젝트 내의 `vault` 폴더를 지정합니다.
2.  **노트 작성 및 수정**:
      * 이제 Obsidian에서 평소처럼 노트를 작성하고 관리할 수 있습니다. 모든 변경 사항은 `vault` 폴더에 저장됩니다.
      * `welcome.md` 파일은 여러분의 첫 번째 노트가 될 수 있습니다. 내용을 수정하거나, 여러분의 `defaultNoteSlug`에 해당하는 새 파일을 만드세요. (예: `vault/home.md`)
      * 폴더를 만들어 노트를 체계적으로 정리할 수 있습니다.

### 5단계: 로컬에서 웹사이트 확인하기

웹사이트가 어떻게 보이는지 로컬에서 테스트할 수 있습니다.

```bash
npm run dev
# 또는
# yarn dev
# 또는
# pnpm dev
```

터미널에 나타난 주소 (보통 `http://localhost:3000`)를 웹 브라우저에서 열어 확인합니다.

### 6단계: GitHub에 변경 사항 Push

로컬에서 수정한 내용 (특히 `site.config.js`와 `vault` 폴더의 콘텐츠)을 여러분의 GitHub 저장소에 Push합니다.

```bash
git add .
git commit -m "나의 첫 번째 설정 및 콘텐츠 업데이트"
git push origin main # 또는 master 등 여러분의 기본 브랜치 이름
```

### 7단계: 웹사이트 배포 (Vercel 또는 Netlify 추천)

1.  **호스팅 서비스 가입**: [Vercel](https://vercel.com/) 또는 [Netlify](https://www.netlify.com/)에 가입합니다 (GitHub 계정으로 쉽게 가입 가능).
2.  **새 프로젝트 생성 및 저장소 연결**:
      * Vercel/Netlify 대시보드에서 "New Project" (또는 유사한 버튼)를 클릭합니다.
      * "Import Git Repository" (또는 "Add new site" \> "Import an existing project") 섹션에서 여러분이 포크한 GitHub 저장소를 선택합니다.
3.  **빌드 설정**:
      * **Framework Preset**: 대부분의 경우 "Next.js" (또는 사용된 프레임워크)로 자동 감지됩니다.
      * **Build Command**: Vercel의 경우 보통 next build로 자동 설정됩니다.
4.  **배포 (Deploy)**: 설정을 확인하고 "Deploy" 버튼을 클릭합니다.

배포가 완료되면 고유한 URL이 제공되며, 앞으로 여러분의 GitHub 저장소에 `git push` 할 때마다 웹사이트가 자동으로 업데이트됩니다\! 만약 개인 도메인을 연결하고 싶다면, Vercel/Netlify의 도메인 설정 가이드를 참조하세요.

## 이제 여러분의 차례입니다\!

지금 이 'welcome.md' 파일을 여러분의 첫 번째 글로 삼거나 삭제하고 새로운 글들로 채워주세요. 멋진 디지털 정원을 가꾸시길 바랍니다\!

궁금한 점이나 문제가 있다면 이슈를 남겨주세요.
