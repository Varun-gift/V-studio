'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Home, FileText, Settings, FileSignature, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from './ui/button';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, exact: true },
    { href: '/invoices/new?type=invoice', label: 'New Invoice', icon: FileText, type: 'invoice' },
    { href: '/invoices/new?type=quotation', label: 'New Quotation', icon: FileSignature, type: 'quotation' },
    { href: '/settings', label: 'Settings', icon: Settings, exact: true },
  ];
  
  const NavContent = () => (
    <>
       <div className="flex items-center gap-2 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8 text-primary"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          <h1 className="text-2xl font-bold">Invoicer</h1>
        </div>
        <nav>
          <ul>
            {navLinks.map((link) => {
              let isActive = false;
              if(link.exact) {
                isActive = pathname === link.href;
              } else if (link.type) {
                isActive = pathname === '/invoices/new' && type === link.type;
              } else {
                 isActive = pathname.startsWith(link.href);
              }
              
              if(link.href === '/invoices/new?type=quotation') return null;
              if(link.href === '/invoices/new?type=invoice' && pathname === '/invoices/new' && type === 'quotation') {
                  // Don't render the 'New Invoice' link when we are on the 'New Quotation' page
              }

              const displayLabel = pathname === '/invoices/new'
                ? (type === 'quotation' ? 'New Quotation' : 'New Invoice')
                : link.label;

              const displayIcon = pathname === '/invoices/new'
                ? (type === 'quotation' ? FileSignature : FileText)
                : link.icon;
              
              const currentLink = pathname === '/invoices/new'
                ? `/invoices/new?type=${type || 'invoice'}`
                : link.href;

              if(link.label === "New Quotation") return null;
              if(link.label === "New Invoice") {
                 const active = pathname === '/invoices/new';
                 return (
                    <li key={link.href}>
                      <Link
                        href={currentLink}
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
                          active
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <displayIcon className="w-5 h-5" />
                        <span>{displayLabel}</span>
                      </Link>
                    </li>
                 )
              }

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
    </>
  )

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar */}
      <div className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setSidebarOpen(false)}></div>
      <aside className={cn(
          "fixed top-0 left-0 h-full w-64 bg-card border-r p-4 z-50 transform transition-transform md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <NavContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r bg-card p-4 hidden md:block">
        <NavContent />
      </aside>

      <main className="flex-1 flex flex-col">
          <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-6 h-6" />
              </Button>
               <h1 className="text-xl font-bold">Invoicer</h1>
               <div className='w-10'></div>
          </header>
          <div className="p-4 md:p-8 flex-1">
             {children}
          </div>
      </main>
    </div>
  );
}
