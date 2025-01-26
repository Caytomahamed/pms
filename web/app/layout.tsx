'use client';

import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '../components/navbar/app-sidebar';
import { useEffect, useState } from 'react';
import Login from './login/page';
import { useSearchParams } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userLoggedIn = Boolean(localStorage.getItem('isLogin')); // Example: Check from localStorage or API
    setIsLoggedIn(userLoggedIn);
  }, []);

  const paramers = useSearchParams();

  // console.log('searhc', paramers);

  return (
    <html lang="en">
      <body className={`${inter.className} `}>
        {isLoggedIn ? (
          <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <main className="flex flex-1 mx-5 mr-10 ">
              <div className="flex-1 flex-col">
                {/* <div className="py-5 ">
                  <h1 className="text-2xl capitalize">
                    poultry management system
                  </h1>
                </div> */}
                <div className="mt-5">{children}</div>
              </div>
            </main>
          </SidebarProvider>
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} />
        )}
      </body>
    </html>
  );
}
