'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/invoices/new', label: 'New Invoice', icon: FileText },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-background p-4">
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
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
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
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
