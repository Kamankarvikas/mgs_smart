import React from 'react';
import { Card } from '../../components/ui';
import { Dispute } from '../../types';

const mockInitialDisputes: Dispute[] = [
    { id: 'D001', creditor: 'Capital One', type: 'Inaccuracy', reason: 'Incorrect late payment reported', status: 'Positive', dateAdded: '2023-09-05'},
    { id: 'D002', creditor: 'Equifax', type: 'Fraud', reason: 'Unauthorized inquiry', status: 'Investigating', dateAdded: '2023-10-10'},
    { id: 'D003', creditor: 'LVNV Funding LLC', type: 'Inaccuracy', reason: 'Account is not mine', status: 'Submitted', dateAdded: '2023-10-15'},
    { id: 'D004', creditor: 'Midland Funding', type: 'Inaccuracy', reason: 'Incorrect balance reported', status: 'Draft', dateAdded: '2023-10-20'},
];

const ClientDisputesPage: React.FC = () => {
    const disputes = mockInitialDisputes;
    const getStatusColor = (status: Dispute['status']) => {
        if (status === 'Positive') return 'bg-green-100 text-green-800'; if (status === 'Negative') return 'bg-red-100 text-red-800'; if (status === 'Investigating') return 'bg-yellow-100 text-yellow-800'; return 'bg-primary-bg-active text-primary-dark';
    };
    const steps = ['Draft', 'Submitted', 'Investigating', 'Decision'];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dispute Status</h1>
                <p className="text-slate-500">Track the progress of all your active and past disputes.</p>
            </div>
            <div className="space-y-4">
            {disputes.length > 0 ? disputes.map(dispute => {
                const currentStepIndex = dispute.status === 'Positive' || dispute.status === 'Negative' ? 3 : steps.indexOf(dispute.status);
                return (
                    <Card key={dispute.id}>
                        <div className="flex justify-between items-start">
                            <div><p className="font-semibold text-lg">{dispute.creditor}</p><p className="text-sm text-slate-500">{dispute.reason}</p></div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>{dispute.status}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200/80"><div className="flex items-center">
                            {steps.map((step, index) => (<React.Fragment key={step}><div className="flex items-center flex-col sm:flex-row"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index <= currentStepIndex ? 'bg-primary' : 'bg-slate-300'}`}>{index < currentStepIndex || (index === 3 && (dispute.status === 'Positive' || dispute.status === 'Negative')) ? '✓' : index + 1}</div><span className={`ml-0 mt-2 sm:ml-2 sm:mt-0 text-xs sm:text-sm ${index <= currentStepIndex ? 'text-slate-800' : 'text-slate-500'}`}>{step}</span></div>{index < steps.length - 1 && <div className={`flex-auto border-t-2 mx-2 sm:mx-4 ${index < currentStepIndex ? 'border-primary' : 'border-slate-300'}`}></div>}</React.Fragment>))}
                        </div></div>
                    </Card>
                )
            }) : <Card><p className="text-center text-slate-500 py-8">You have no disputes yet. Your case manager will add them here as they are created.</p></Card>}
        </div>
        </div>
    );
};

export default ClientDisputesPage;
