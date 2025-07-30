import { InvoiceForm } from '@/components/invoice-form';

export default function NewInvoicePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">New Invoice</h1>
        <p className="mt-2 text-muted-foreground">
          Fill out the form below to create a new invoice.
        </p>
      </div>
      <InvoiceForm />
    </div>
  );
}
