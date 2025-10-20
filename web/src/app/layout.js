import './globals.css';
import ToastProvider from '../components/ToastProvider';

export const metadata = {
  title: 'Last Call - Bidding Platform',
  description: 'Real-time bidding platform for auctions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}