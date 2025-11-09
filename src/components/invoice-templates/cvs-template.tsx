
'use client';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/app/invoices/new/page';

interface CvsTemplateProps {
  invoice: Invoice;
}

export function CvsTemplate({ invoice }: CvsTemplateProps) {
  const { client, items, total, subtotal, tax } = invoice;
  const vssBlue = '#002D62';
  const vssRed = '#E60000';

  return (
    <div className="bg-white p-0 text-black font-sans text-sm flex flex-col min-h-full">
      {/* Header */}
      <header className="p-4 border-b-4" style={{ borderColor: vssRed }}>
          <div className="flex justify-between items-center">
              <div>
                  <h2 className="text-3xl font-bold" style={{ color: vssBlue }}>INVOICE</h2>
                  <p><span className="font-bold">Invoice #:</span> {invoice.invoiceNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                  <svg width="40" height="30" viewBox="0 0 65 45">
                      <path d="M0 22.5 L13 22.5 L19.5 11.25 L26 33.75 L32.5 22.5 L39 22.5" stroke="#E60000" strokeWidth="5" fill="none" />
                      <path d="M30 22.5 L35 40 L40 5 L45 40 L50 5" stroke="#002D62" strokeWidth="5" fill="none" />
                      <path d="M50 22.5 L65 22.5" stroke="#002D62" strokeWidth="5" fill="none" />
                  </svg>
                  <div>
                      <h1 className="text-xl font-bold" style={{ color: vssBlue }}>VSS ELECTRICALS</h1>
                      <p className="text-xs font-semibold" style={{ color: vssRed }}>Govt. Licensed Class-I Electrical Contractor</p>
                  </div>
              </div>
          </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-4 flex-grow">
          <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                  <h3 className="font-bold mb-2 text-gray-500">BILLED TO</h3>
                  <p className="font-semibold text-lg" style={{color: vssBlue}}>{client.name}</p>
                  <p>{client.address}</p>
                  <p>{client.phone}</p>
              </div>
              <div className="text-right">
                  <h3 className="font-bold mb-2 text-gray-500">DETAILS</h3>
                  <p><span className="font-bold">Date of Issue:</span> {invoice.invoiceDate}</p>
                  <p><span className="font-bold">Due Date:</span> {invoice.dueDate}</p>
              </div>
          </div>
          
          <table className="w-full mb-8">
              <thead>
                  <tr className="text-white" style={{ backgroundColor: vssBlue }}>
                      <th className="text-left font-bold p-2">Item Description</th>
                      <th className="text-center font-bold p-2">Qty</th>
                      <th className="text-right font-bold p-2">Unit Price</th>
                      <th className="text-right font-bold p-2">Total</th>
                  </tr>
              </thead>
              <tbody className="bg-gray-100">
                  {items.map(item => (
                      <tr key={item.id}>
                          <td className="p-2 border-b">{item.description}</td>
                          <td className="p-2 border-b text-center">{item.quantity}</td>
                          <td className="p-2 border-b text-right">{formatCurrency(item.rate)}</td>
                          <td className="p-2 border-b text-right">{formatCurrency(item.quantity * item.rate)}</td>
                      </tr>
                  ))}
              </tbody>
          </table>

          <div className="flex justify-end">
              <div className="w-2/5 space-y-2">
                  <div className="flex justify-between">
                      <span className="text-gray-700">Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Tax ({tax}%)</span>
                      <span>{formatCurrency(subtotal * (tax / 100))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-2xl p-2 rounded" style={{ backgroundColor: vssBlue, color: 'white' }}>
                      <span>Amount Due</span>
                      <span>{formatCurrency(total)}</span>
                  </div>
              </div>
          </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-gray-100 text-center p-4 text-xs" style={{color: vssBlue}}>
          <p className="font-bold">THANK YOU FOR YOUR BUSINESS</p>
          <p># 783, Sy. No 136, Arkavathi Layout 19th Block Chelekere Village, Kalyan Nagar Post, Bangalore - 43.</p>
          <p>M : 98451 61952 / 63604 92911 | Email : vsselectricals@gmail.com</p>
      </footer>
    </div>
  );
}
