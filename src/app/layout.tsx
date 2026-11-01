import type { Metadata } from 'next';
import './globals.css';
import { BizLinkProvider } from '@/context/BizLinkContext';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'BizLink | Connected B2B Supply Chain & Business Discovery Network',
  description: 'Searchable digital business ecosystem connecting manufacturers, super wholesalers, wholesalers, retailers, and local customers powered by SerpApi discovery.',
  keywords: ['B2B Network', 'Supply Chain Discovery', 'Wholesale Suppliers', 'SerpApi', 'Business Network', 'Ambala', 'Retailers'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans antialiased bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <BizLinkProvider>
          {children}
          <ToastContainer />
        </BizLinkProvider>
      </body>
    </html>
  );
}
