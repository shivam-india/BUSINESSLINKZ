import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BizLinkProvider } from '@/context/BizLinkContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'BizLink | Universal Business Network — Every Industry, Worldwide',
  description: 'BizLink is the universal digital network connecting every legitimate business — manufacturers, agencies, freelancers, healthcare, logistics, tech, and more — across 190+ countries.',
  keywords: ['Universal Business Network', 'B2B Discovery', 'Global Business Platform', 'Cross-Industry Networking', 'Business Ecosystem'],
};

export const viewport: Viewport = {
  themeColor: '#04070f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full antialiased bg-mesh" style={{ background: 'var(--bg-base)' }}>
        <BizLinkProvider>
          {children}
          <ToastContainer />
        </BizLinkProvider>
      </body>
    </html>
  );
}
