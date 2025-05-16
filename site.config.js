// site.config.js (프로젝트 루트 또는 적절한 경로에 위치)

const siteConfig = {
    // 기본 정보
    title: "My Awesome Website",
    description: "A brief description of my awesome website.",
    siteUrl: "https://example.com", // 사용자가 자신의 도메인으로 변경해야 함
    lang: "en", // 기본 언어 (예: "en", "ko")
    defaultNoteSlug: "welcome",

    metadata: {
        faviconPath: "/favicon.png",
    },

    sideBar: {
        title: "My Awesome Website",
    },

    openGraph: {
        type: "website",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Website Open Graph Image",
            },
        ],
        siteName: "My Awesome Website",
        locale: "en_US", // 기본 로케일 (예: "en_US", "ko_KR")
    },

    twitter: {
        card: "summary_large_image",
        images: ["/og-image.png"],
        site: "@YourTwitterSiteHandle",
        creator: "@YourTwitterHandle",
    },

    theme: {
        defaultTheme: "system", // 'light', 'dark', 'system'
    },
};

export default siteConfig;