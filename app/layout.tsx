import type { Metadata } from 'next';
import { IBM_Plex_Sans_Arabic, Space_Grotesk, Silkscreen } from 'next/font/google';
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

const silkscreen = Silkscreen({
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'شاهدت — تابع أفلامك ومسلسلاتك',
  description: 'متتبع أفلام ومسلسلات شخصي: شباك واحد بس بكل الأعمال اللي بتشاهدها، مع مزامنة سحابية وواجهة عربية.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${plexAr.variable} ${grotesk.variable} ${silkscreen.variable}`}>
      <body>
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}
