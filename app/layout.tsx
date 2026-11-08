import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { TrackingProvider } from '@/lib/store/tracking-context';

const plexAr = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--font-plex-ar',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'شاهدت — سجل مشاهداتك',
  description: 'دفتر شخصي أنيق لتتبع الأفلام والمسلسلات التي تشاهدها، مع جلب البيانات تلقائياً من توب سينما وأهواك.',
  keywords: ['أفلام', 'مسلسلات', 'تتبع الأفلام', 'توب سينما', 'أهواك تي في', 'Shahadt', 'Movie Tracker'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${plexAr.variable} ${grotesk.variable}`}>
      <body className="min-h-screen selection:bg-[#f2b441] selection:text-[#12100c]">
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}
