import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { contentRepository } from '@/services/content';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Baobabs Club de Teatro · Córdoba, Argentina',
  description:
    'Club de teatro independiente en Córdoba, Argentina. Cartelera de obras de sala, jam escénica, laboratorios y talleres de formación teatral.',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/images/logo/logo-baobabs.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteConfig = await contentRepository.getSiteConfig();

  return (
    <html
      lang="es"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-sans selection:bg-primary/20 selection:text-primary">
        <Header contacto={siteConfig.contacto} />
        <main className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer footer={siteConfig.footer} />
        <MobileBottomNav />
      </body>
    </html>
  );
}
