import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'School Management System',
  description: 'A modern dashboard for managing school operations.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
