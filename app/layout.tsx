import type { Metadata } from 'next';
import { Cairo, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { TrackingProvider } from '@/lib/store/tracking-context';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'شاهدت | Shahadt - تتبع الأفلام والمسلسلات',
  description: 'تطبيقك السينمائي الأنيق لتتبع ما تشاهده وما أتممته من أفلام ومسلسلات مع جلب البيانات من توب سينما وأهواك تي في',
  keywords: ['أفلام', 'مسلسلات', 'تتبع الأفلام', 'توب سينما', 'أهواك تي في', 'Shahadt', 'Movie Tracker'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${jakarta.variable}`}>
      <body className="font-sans bg-[#080C14] text-slate-100 min-h-screen selection:bg-red-600 selection:text-white">
        <TrackingProvider>
          {children}
        </TrackingProvider>
      </body>
    </html>
  );
}
