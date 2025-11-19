
'use client';

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { InvoiceForm } from '@/components/invoice-form';
import { InvoicePreview } from '@/components/invoice-preview';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { FileText, FileSignature } from 'lucide-react';

const initialInvoiceState = {
  id: '',
  invoiceNumber: '',
  type: 'invoice' as 'invoice' | 'quotation',
  company: { name: '', email: '', phone: '', address: '', website: '' },
  client: { name: '', phone: '', address: '' },
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: '',
  items: [{ id: uuidv4(), description: '', quantity: 1, rate: 0 }],
  tax: 0,
  subtotal: 0,
  total: 0,
  logoUrl: '',
};

export type Invoice = typeof initialInvoiceState;
export type Template = 'classic' | 'modern' | 'professional' | 'ginyard' | 'vss' | 'cvs';
export type DocumentType = 'invoice' | 'quotation';

function NewInvoicePageContents() {
  const [invoice, setInvoice] = useState<Invoice>(initialInvoiceState);
  const [template, setTemplate] = useState<Template>('classic');
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');
  const docType = searchParams.get('type') as DocumentType | null;

  const docTitle = useMemo(() => docType === 'quotation' ? 'Quotation' : 'Invoice', [docType]);
  const docNumberPrefix = useMemo(() => docType === 'quotation' ? 'QUO' : 'INV', [docType]);

  useEffect(() => {
    if (!docType && !draftId) {
      setShowTypeSelector(true);
    } else {
      setShowTypeSelector(false);
    }
  }, [docType, draftId]);

  useEffect(() => {
    const loadData = () => {
      if (draftId) {
        const savedDrafts = JSON.parse(
          localStorage.getItem('invoice-drafts') || '[]'
        );
        const draftToEdit = savedDrafts.find((d: any) => d.id === draftId);
        if (draftToEdit) {
          setInvoice(draftToEdit);
          if (draftToEdit.template) setTemplate(draftToEdit.template);
        }
      } else if (docType) {
        const savedSettings = JSON.parse(localStorage.getItem('company-settings') || '{}');
        const newInvoiceNumber = `${docNumberPrefix}-${String(Date.now()).slice(-6)}`;
        setInvoice({
          ...initialInvoiceState,
          id: uuidv4(),
          type: docType,
          invoiceNumber: newInvoiceNumber,
          company: savedSettings.company || initialInvoiceState.company,
          logoUrl: savedSettings.logoUrl || '',
        });
        setTemplate(savedSettings.defaultTemplate || 'classic');
      }
    };
    loadData();
  }, [draftId, docType, docNumberPrefix]);

  useEffect(() => {
    const subtotal = invoice.items.reduce(
      (acc, item) => acc + item.quantity * item.rate,
      0
    );
    const taxAmount = subtotal * (invoice.tax / 100);
    const total = subtotal + taxAmount;
    setInvoice((prev) => ({ ...prev, subtotal, total }));
  }, [invoice.items, invoice.tax]);

  const handleSaveDraft = () => {
    if (!invoice.type) return;
    const dataToSave = { ...invoice, template };
    const savedDrafts = JSON.parse(
      localStorage.getItem('invoice-drafts') || '[]'
    );
    const existingDraftIndex = savedDrafts.findIndex(
      (d: any) => d.id === invoice.id
    );

    if (existingDraftIndex > -1) {
      savedDrafts[existingDraftIndex] = dataToSave;
    } else {
      savedDrafts.push(dataToSave);
    }

    localStorage.setItem('invoice-drafts', JSON.stringify(savedDrafts));
    alert('Draft saved!');
    router.push('/dashboard');
  };
  
  const handleSelectType = (type: DocumentType) => {
    router.push(`/invoices/new?type=${type}`);
  }

  const handleClearForm = () => {
     if (!docType) return;
     const savedSettings = JSON.parse(localStorage.getItem('company-settings') || '{}');
     const newInvoiceNumber = `${docNumberPrefix}-${String(Date.now()).slice(-6)}`;
     setInvoice({
       ...initialInvoiceState,
       id: uuidv4(),
       type: docType,
       invoiceNumber: newInvoiceNumber,
       company: savedSettings.company || initialInvoiceState.company,
       logoUrl: savedSettings.logoUrl || '',
     });
     setTemplate(savedSettings.defaultTemplate || 'classic');
  };

  if (!docType && !draftId) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && router.push('/dashboard')}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>What would you like to create?</DialogTitle>
            <DialogDescription>
              Choose whether you want to create a new invoice or a quotation.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 py-8">
            <Button variant="outline" className="h-24 w-24 flex-col gap-2" onClick={() => handleSelectType('invoice')}>
              <FileText className="w-8 h-8"/>
              <span>Invoice</span>
            </Button>
            <Button variant="outline" className="h-24 w-24 flex-col gap-2" onClick={() => handleSelectType('quotation')}>
              <FileSignature className="w-8 h-8" />
              <span>Quotation</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="lg:sticky lg:top-8 order-last lg:order-first">
        <InvoicePreview
          invoice={invoice}
          template={template}
          onTemplateChange={setTemplate}
        />
      </div>
      <div className="space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">New {docTitle}</h1>
          <p className="mt-2 text-muted-foreground">
            Fill out the form below to create a new {docTitle.toLowerCase()}.
          </p>
        </div>
        <InvoiceForm
          invoice={invoice}
          setInvoice={setInvoice}
          onSaveDraft={handleSaveDraft}
          onClearForm={handleClearForm}
        />
      </div>
    </div>
  );
}

export default function NewInvoicePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewInvoicePageContents />
    </Suspense>
  )
}
