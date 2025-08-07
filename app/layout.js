import '../styles/globals.css'
import { MiniKitContextProvider } from '../providers/MiniKitProvider';

export const metadata = {
  title: 'Base Buddies',
  description: 'A fun onchain app built on Base!',
  // other: {
  //   "fc:frame": JSON.stringify({
  //     version: "next",
  //     imageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
  //     button: {
  //       title: `Launch ${process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Base Buddies'}`,
  //       action: {
  //         type: "launch_frame",
  //         name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || 'Base Buddies',
  //         url: process.env.NEXT_PUBLIC_URL,
  //         splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
  //         splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
  //       },
  //     },
  //   }),
  // },
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