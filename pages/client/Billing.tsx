import React from 'react';
import { Card, Button } from '../../components/ui';
import { Invoice } from '../../types';
import { CreditCard, Download, CheckCircle, Clock } from 'lucide-react';

const mockInvoices: Invoice[] = [
    { id: 'I001', invoiceNumber: 'INV-2023-010', amount: 99.00, dueDate: '2023-10-15', status: 'Paid' },
    { id: 'I002', invoiceNumber: 'INV-2023-009', amount: 99.00, dueDate: '2023-09-15', status: 'Paid' },
    { id: 'I003', invoiceNumber: 'INV-2023-008', amount: 99.00, dueDate: '2023-08-15', status: 'Paid' },
];

const ClientBillingPage: React.FC = () => {
    const statusClasses = { 'Paid': 'bg-green-100 text-green-800', 'Unpaid': 'bg-yellow-100 text-yellow-800', 'Overdue': 'bg-red-100 text-red-800' };
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Billing Details</h1>
                <p className="text-slate-500">Manage your subscription and view payment history.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Current Plan">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-primary">Monthly Plan</h3>
                                <p className="text-slate-500">Your plan renews on November 15, 2023.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold">$99.00</p>
                                <p className="text-slate-500">per month</p>
                            </div>
                        </div>
                    </Card>
                     <Card title="Payment Method">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <CreditCard size={24} className="text-slate-600" />
                                <div className="ml-4">
                                    <p className="font-semibold">Visa ending in 1234</p>
                                    <p className="text-sm text-slate-500">Expires 12/2025</p>
                                </div>
                            </div>
                            <Button variant="outline">Update</Button>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="Plan Status">
                         <div className="text-center p-4">
                            <CheckCircle size={48} className="text-green-500 mx-auto" />
                            <h3 className="text-lg font-semibold mt-2">Your Subscription is Active</h3>
                            <p className="text-sm text-slate-500 mt-1">Thank you for being a valued client. Your access to the portal and our services is fully active.</p>
                            <Button variant="outline" className="mt-4 w-full">Cancel Subscription</Button>
                        </div>
                    </Card>
                </div>
            </div>

            <Card title="Invoice History">
                {mockInvoices.length > 0 ? (
                    <div className="overflow-x-auto">
                         <table className="min-w-full text-sm">
                            <thead className="bg-slate-50"><tr><th className="p-3 text-left font-medium text-slate-600">Invoice #</th><th className="p-3 text-left font-medium text-slate-600">Amount</th><th className="p-3 text-left font-medium text-slate-600">Date</th><th className="p-3 text-left font-medium text-slate-600">Status</th><th className="p-3 text-left font-medium text-slate-600">Action</th></tr></thead>
                            <tbody>{mockInvoices.map(invoice => (<tr key={invoice.id} className="border-t border-slate-200/80"><td className="p-3 font-medium">{invoice.invoiceNumber}</td><td className="p-3 text-slate-600">${invoice.amount.toFixed(2)}</td><td className="p-3 text-slate-600">{invoice.dueDate}</td><td className="p-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[invoice.status]}`}>{invoice.status}</span></td><td className="p-3"><Button variant="ghost" size="sm"><Download size={16}/></Button></td></tr>))}</tbody>
                        </table>
                    </div>
                ) : (<p className="text-center text-slate-500 py-8">No invoices found.</p>)}
            </Card>
        </div>
    );
};

export default ClientBillingPage;
