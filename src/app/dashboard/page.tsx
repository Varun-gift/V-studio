'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

export default function DashboardPage() {
  const [drafts, setDrafts] = useState<Invoice[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load drafts from localStorage on component mount
    const savedDrafts = localStorage.getItem('invoice-drafts');
    if (savedDrafts) {
      setDrafts(JSON.parse(savedDrafts));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      const newDrafts = drafts.filter((draft) => draft.id !== id);
      setDrafts(newDrafts);
      localStorage.setItem('invoice-drafts', JSON.stringify(newDrafts));
    }
  };

  const handleEdit = (id: string) => {
    const draft = drafts.find(d => d.id === id);
    const type = draft?.type || 'invoice';
    router.push(`/invoices/new?type=${type}&draftId=${id}`);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Here are your saved drafts.
          </p>
        </div>
      </div>

      {drafts.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">You have no saved drafts.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Click the "+" button below to create a new document.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drafts.map((draft) => (
             <Card key={draft.id}>
              <CardHeader>
                <CardTitle>{draft.type === 'quotation' ? 'Quotation' : 'Invoice'} {draft.invoiceNumber}</CardTitle>
                <CardDescription>To: {draft.client.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatCurrency(draft.total)}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(draft.id)}>
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(draft.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
