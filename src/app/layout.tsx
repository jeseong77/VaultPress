// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; 
import { ThemeProvider } from '../../components/ThemeProvider';
import siteConfig from '../../site.config'; 

const inter = Inter({ subsets: ['latin'] });
const ogImage = siteConfig.openGraph.images[0];
const twitterImageUrl = siteConfig.twitter.images[0];


export const metadata: Metadata = {
  // 기본 메타데이터
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: { icon: siteConfig.metadata.faviconPath },

  // 오픈 그래프 메타데이터
  openGraph: {
    type: siteConfig.openGraph.type as 'website' | 'article' | 'book' | 'profile',
    url: siteConfig.siteUrl,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: ogImage.url,
        width: ogImage.width,
        height: ogImage.height,
        alt: ogImage.alt,
      },
    ],
    siteName: siteConfig.openGraph.siteName,
    locale: siteConfig.openGraph.locale,
  },

  // 트위터 카드 메타데이터
  twitter: {
    card: siteConfig.twitter.card as "summary" | "summary_large_image" | "app" | "player",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [twitterImageUrl], // twitterImageUrl은 문자열 URL
    // siteConfig.twitter에 site/creator 속성이 존재하고 값이 있을 경우에만 추가
    // TypeScript 오류를 피하려면 siteConfig.twitter 타입에 site?: string; creator?: string; 와 같이 optional로 정의되어야 함
    ...(siteConfig.twitter.site && { site: siteConfig.twitter.site }),
    ...(siteConfig.twitter.creator && { creator: siteConfig.twitter.creator }),
  },

  // metadataBase 설정
  metadataBase: new URL(siteConfig.siteUrl),
};

// Viewport 설정 (선택 사항)
// export const viewport: Viewport = {
//   themeColor: 'black', // 또는 siteConfig에서 가져올 수 있음
//   width: 'device-width',
//   initialScale: 1,
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.theme.defaultTheme}
          enableSystem
        // disableTransitionOnChange // 필요시 주석 해제
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}