import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProductStore',
  description: 'Gestión de productos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
        <main className="flex-1 bg-gray-100">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}