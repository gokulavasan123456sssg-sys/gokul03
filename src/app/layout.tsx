import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://gokulavasan.vercel.app'),
  title: 'GOKULAVASAN | Video Editor • Cinematographer • Photographer',
  description:
    'Luxury creative portfolio of Gokulavasan. Showcasing narrative films, commercial video editing, wedding cinematography, photography, and VFX breakdowns.',
  keywords: [
    'Gokulavasan',
    'Video Editor',
    'Cinematographer',
    'Photographer',
    'Colorist',
    'DaVinci Resolve',
    'Premiere Pro',
    'VFX Artist',
    'Portfolio',
  ],
  authors: [{ name: 'Gokulavasan' }],
  creator: 'Gokulavasan',
  openGraph: {
    title: 'GOKULAVASAN | Creative Portfolio',
    description: 'Capturing Moments. Creating Stories. Video Editor • Cinematographer • Photographer',
    url: 'https://gokulavasan.vercel.app',
    siteName: 'GOKULAVASAN Portfolio',
    images: [
      {
        url: '/images/gokul-portrait.jpg',
        width: 1200,
        height: 630,
        alt: 'Gokulavasan Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-neutral-100 min-h-screen flex flex-col film-grain antialiased selection:bg-gold-400 selection:text-black">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
