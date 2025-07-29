import { AppLayout } from '@/components/app-layout';
import { InvoiceForm } from '@/components/invoice-form';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Link from 'next/link';

export default function NewInvoicePage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-lg">
        <header className="flex items-center justify-between mb-6">
          <Link href="/invoices" passHref>
             <Button variant="ghost" size="icon">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
             </Button>
          </Link>
          <h1 className="text-xl font-semibold">New Invoice</h1>
          <div className="w-8"></div>
        </header>
        <InvoiceForm />
      </div>
    </AppLayout>
  );
}
