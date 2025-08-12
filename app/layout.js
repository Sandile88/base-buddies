import '../styles/globals.css'
import { MiniKitContextProvider } from '../providers/MiniKitProvider';

export const metadata = {
  title: 'Base Buddies',
  description: 'A fun onchain app built on Base!',
  other: {
    "fc:frame": JSON.stringify({
      version: "next",
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