'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';

const initialInvoiceState = {
  id: '',
  invoiceNumber: '',
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

export function InvoiceForm() {
  const [invoice, setInvoice] = useState(initialInvoiceState);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  useEffect(() => {
    if (draftId) {
      const savedDrafts = JSON.parse(localStorage.getItem('invoice-drafts') || '[]');
      const draftToEdit = savedDrafts.find((d: any) => d.id === draftId);
      if (draftToEdit) {
        setInvoice(draftToEdit);
        if (draftToEdit.logoUrl) {
          setLogoPreview(draftToEdit.logoUrl);
        }
      }
    } else {
        const newInvoiceNumber = `INV-${String(Date.now()).slice(-6)}`;
        setInvoice(prev => ({...prev, invoiceNumber: newInvoiceNumber, id: uuidv4()}));
    }
  }, [draftId]);


  const handleInputChange = (section: 'company' | 'client', field: string, value: string) => {
    setInvoice(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleGeneralChange = (field: string, value: string | number) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setInvoice(prev => ({...prev, logoUrl: result}));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveDraft = () => {
    const savedDrafts = JSON.parse(localStorage.getItem('invoice-drafts') || '[]');
    const existingDraftIndex = savedDrafts.findIndex((d: any) => d.id === invoice.id);

    if (existingDraftIndex > -1) {
        savedDrafts[existingDraftIndex] = invoice;
    } else {
        savedDrafts.push(invoice);
    }
    
    localStorage.setItem('invoice-drafts', JSON.stringify(savedDrafts));
    alert('Draft saved!');
    router.push('/dashboard');
  };

  const handleClearForm = () => {
    setInvoice(initialInvoiceState);
    setLogoPreview(null);
    const newInvoiceNumber = `INV-${String(Date.now()).slice(-6)}`;
    setInvoice(prev => ({...initialInvoiceState, invoiceNumber: newInvoiceNumber, id: uuidv4()}));
  }

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader><CardTitle>Branding</CardTitle></CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="flex items-center gap-4">
                        {logoPreview && <Image src={logoPreview} alt="Logo Preview" width={80} height={80} className="rounded-md" />}
                        <div>
                            <Label htmlFor="logo">Company Logo</Label>
                            <Input id="logo" type="file" onChange={handleLogoChange} className="mt-1" accept="image/*" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      
        <Card>
            <CardHeader><CardTitle>Your Info</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
            <div><Label>Company Name</Label><Input value={invoice.company.name} onChange={e => handleInputChange('company', 'name', e.target.value)} /></div>
            <div><Label>Company Email</Label><Input type="email" value={invoice.company.email} onChange={e => handleInputChange('company', 'email', e.target.value)} /></div>
            <div><Label>Company Phone</Label><Input value={invoice.company.phone} onChange={e => handleInputChange('company', 'phone', e.target.value)} /></div>
            <div><Label>Company Website</Label><Input value={invoice.company.website} onChange={e => handleInputChange('company', 'website', e.target.value)} /></div>
            <div className="md:col-span-2"><Label>Company Address</Label><Textarea value={invoice.company.address} onChange={e => handleInputChange('company', 'address', e.target.value)} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Client Info</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
            <div><Label>Client Name</Label><Input value={invoice.client.name} onChange={e => handleInputChange('client', 'name', e.target.value)} /></div>
            <div><Label>Client Phone</Label><Input value={invoice.client.phone} onChange={e => handleInputChange('client', 'phone', e.target.value)} /></div>
            <div className="md:col-span-2"><Label>Client Address</Label><Textarea value={invoice.client.address} onChange={e => handleInputChange('client', 'address', e.target.value)} /></div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader><CardTitle>Invoice Details</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div><Label>Invoice Number</Label><Input value={invoice.invoiceNumber} onChange={e => handleGeneralChange('invoiceNumber', e.target.value)} /></div>
            <div><Label>Tax (%)</Label><Input type="number" value={invoice.tax} onChange={e => handleGeneralChange('tax', parseFloat(e.target.value) || 0)} /></div>
            <div><Label>Invoice Date</Label><Input type="date" value={invoice.invoiceDate} onChange={e => handleGeneralChange('invoiceDate', e.target.value)} /></div>
            <div><Label>Due Date</Label><Input type="date" value={invoice.dueDate} onChange={e => handleGeneralChange('dueDate', e.target.value)} /></div>
            </CardContent>
        </Card>

      <Separator />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleClearForm}>Clear</Button>
        <Button onClick={handleSaveDraft}>Save Draft</Button>
      </div>
    </div>
  );
}
