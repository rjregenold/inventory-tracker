import {AuthProvider} from '@/lib/contexts/auth-context';
import './global.css';
import Navbar from './navbar';

export const metadata = {
  title: 'GoodDay Software Coding Exercise',
  description: 'Thank you for your time!',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <AuthProvider>
          <div className="container mx-auto">
            <Navbar />
            <div className="mx-2">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
