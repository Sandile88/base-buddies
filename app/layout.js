import '../styles/globals.css'


export const metadata = {
  title: 'Base Buddies',
  description: 'A fun onchain app built on Base!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}