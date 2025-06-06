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
        <div className="container mx-auto">
          <Navbar />
          <div className="mx-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
