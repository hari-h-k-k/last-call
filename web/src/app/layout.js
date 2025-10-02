import './globals.css';

export const metadata = {
  title: 'Last Call - Bidding Platform',
  description: 'Real-time bidding platform for auctions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}