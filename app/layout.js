import '../styles/globals.css'
import { MiniKitContextProvider } from '../providers/MiniKitProvider';

export const metadata = {
  title: 'Base Buddies',
  description: 'A fun onchain app built on Base for social challenges and rewards!',
  metadataBase: process.env.NEXT_PUBLIC_URL ? new URL(process.env.NEXT_PUBLIC_URL) : undefined,
  openGraph: {
    title: 'Base Buddies',
    description: 'A fun onchain app built on Base for social challenges and rewards!',
    url: process.env.NEXT_PUBLIC_URL,
    images: [
      {
        url: process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/og-image.png` : '/og-image.png',
        width: 1200,
        height: 800,
        alt: 'Base Buddies',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base Buddies',
    description: 'A fun onchain app built on Base for social challenges and rewards!',
    images: [process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/og-image.png` : '/og-image.png'],
  },
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: process.env.NEXT_PUBLIC_URL ? `${process.env.NEXT_PUBLIC_URL}/og-image.png` : undefined,
      button: {
        title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Base Buddies'}`,
        action: {
          type: "launch_frame",
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Base Buddies',
          url: process.env.NEXT_PUBLIC_URL,
        },
      },
    }),
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MiniKitContextProvider>
          {children}
        </MiniKitContextProvider>
      </body>
    </html>
  );
}