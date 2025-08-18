import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Button, Input, Modal, ProgressBar } from '../components/ui';
import { Client, Dispute, Note, Document, Task, Invoice } from '../types';
import { 
    PlusCircle, MoreVertical, Upload, FilePlus, Bot, Send, RefreshCw, ChevronLeft, 
    Briefcase, FileText, History, BarChart2, Edit, StickyNote, FolderArchive, Download,
    ListTodo, Receipt, Trash2, Eye, ShieldCheck, User, Calendar, Fingerprint, MapPin, CalendarPlus, Clock,
    Search, ChevronRight
} from 'lucide-react';

// --- NEW TYPES ---
interface Letter {
  id: string;
  title: string;
  dateGenerated: string;
  content: string;
}

interface HistoryEvent {
  id: string;
  timestamp: string;
  event: string;
  icon: React.ReactNode;
}


// --- UI COMPONENTS ---

const CreditScoreMeter: React.FC<{ score: number }> = ({ score }) => {
    const getScoreData = (s: number) => {
        if (s >= 800) return { rating: 'Excellent', color: 'text-green-500', stroke: 'stroke-green-500' };
        if (s >= 740) return { rating: 'Very Good', color: 'text-teal-500', stroke: 'stroke-teal-500' };
        if (s >= 670) return { rating: 'Good', color: 'text-primary', stroke: 'stroke-primary' };
        if (s >= 580) return { rating: 'Fair', color: 'text-yellow-500', stroke: 'stroke-yellow-500' };
        return { rating: 'Poor', color: 'text-red-500', stroke: 'stroke-red-500' };
    };

    const scoreData = getScoreData(score);
    const sqSize = 200;
    const strokeWidth = 20;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    
    const scoreRange = 550; // 850 - 300
    const clampedScore = Math.max(300, Math.min(850, score));
    const percentage = (clampedScore - 300) / scoreRange;
    
    const arcLength = dashArray * 0.75;
    const dashOffset = arcLength * (1 - percentage);

    return (
        <div className="relative w-52 h-52 flex items-center justify-center">
            <svg width={sqSize} height={sqSize} viewBox={viewBox} className="transform rotate-[135deg]">
                <circle className="stroke-slate-200" cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`} fill="none" strokeDasharray={arcLength} strokeLinecap="round" />
                <circle className={`${scoreData.stroke} transition-all duration-1000 ease-in-out`} cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`} fill="none" strokeDasharray={arcLength} strokeDashoffset={dashOffset} strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
                <span className={`text-5xl font-bold ${scoreData.color}`}>{score}</span>
                <p className="text-lg font-semibold text-slate-600">{scoreData.rating}</p>
            </div>
        </div>
    );
};

const ClientStatusBadge: React.FC<{ status: Client['status'] }> = ({ status }) => {
    const statusClasses = {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-red-100 text-red-800',
        Pending: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>{status}</span>;
};

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; className?: string }> = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-start ${className}`}>
        <div className="flex-shrink-0 text-slate-400 mt-0.5">{icon}</div>
        <div className="ml-3">
            <p className="font-medium text-slate-500 text-xs">{label}</p>
            <p className="text-slate-800 font-medium">{value}</p>
        </div>
    </div>
);


// --- MOCK DATA (INITIAL STATE) ---

const mockClients: Client[] = [
    { id: 'C001', name: 'Emily White', email: 'emily@example.com', mobile: '555-1111', dob: '1990-05-15', ssn: '***-**-1234', address: '123 Oak St, Anytown, USA', status: 'Active', agent: 'Alice Johnson', createdDate: '2023-09-01', lastUpdate: '2023-10-25', profileCompletion: 80 },
    { id: 'C002', name: 'Michael Green', email: 'michael@example.com', mobile: '555-2222', dob: '1985-11-20', ssn: '***-**-5678', address: '456 Pine St, Anytown, USA', status: 'Active', agent: 'Bob Williams', createdDate: '2023-08-15', lastUpdate: '2023-10-20', profileCompletion: 95 },
    { id: 'C003', name: 'Jessica Blue', email: 'jessica@example.com', mobile: '555-3333', dob: '1992-02-10', ssn: '***-**-9012', address: '789 Maple St, Anytown, USA', status: 'Inactive', agent: 'Alice Johnson', createdDate: '2023-07-20', lastUpdate: '2023-09-30', profileCompletion: 40 },
    { id: 'C004', name: 'David Black', email: 'david.black@example.com', mobile: '555-4444', dob: '1988-03-12', ssn: '***-**-4444', address: '101 Elm St', status: 'Pending', agent: 'Charlie Green', createdDate: '2023-10-01', lastUpdate: '2023-10-26', profileCompletion: 20 },
    { id: 'C005', name: 'Laura Grey', email: 'laura.grey@example.com', mobile: '555-5555', dob: '1995-07-22', ssn: '***-**-5555', address: '202 Birch St', status: 'Active', agent: 'Bob Williams', createdDate: '2023-06-11', lastUpdate: '2023-10-24', profileCompletion: 100 },
    { id: 'C006', name: 'James Brown', email: 'james.brown@example.com', mobile: '555-6666', dob: '1979-01-30', ssn: '***-**-6666', address: '303 Cedar St', status: 'Active', agent: 'Alice Johnson', createdDate: '2023-05-02', lastUpdate: '2023-10-15', profileCompletion: 75 },
    { id: 'C007', name: 'Patricia Pink', email: 'patricia.pink@example.com', mobile: '555-7777', dob: '2000-12-01', ssn: '***-**-7777', address: '404 Walnut St', status: 'Inactive', agent: 'Charlie Green', createdDate: '2023-04-18', lastUpdate: '2023-08-01', profileCompletion: 60 },
    { id: 'C008', name: 'Robert Orange', email: 'robert.orange@example.com', mobile: '555-8888', dob: '1982-09-05', ssn: '***-**-8888', address: '505 Spruce St', status: 'Pending', agent: 'Bob Williams', createdDate: '2023-10-10', lastUpdate: '2023-10-25', profileCompletion: 15 },
    { id: 'C009', name: 'Linda Purple', email: 'linda.purple@example.com', mobile: '555-9999', dob: '1991-06-25', ssn: '***-**-9999', address: '606 Redwood St', status: 'Active', agent: 'Alice Johnson', createdDate: '2023-03-21', lastUpdate: '2023-10-22', profileCompletion: 90 },
    { id: 'C010', name: 'William Yellow', email: 'william.yellow@example.com', mobile: '555-1010', dob: '1976-08-14', ssn: '***-**-1010', address: '707 Aspen St', status: 'Active', agent: 'Charlie Green', createdDate: '2023-02-09', lastUpdate: '2023-10-26', profileCompletion: 85 },
];

const mockInitialDisputes: Dispute[] = [
    { id: 'D001', creditor: 'Capital One', type: 'Inaccuracy', reason: 'Incorrect late payment reported', status: 'Positive', dateAdded: '2023-09-05'},
    { id: 'D002', creditor: 'Equifax', type: 'Fraud', reason: 'Unauthorized inquiry', status: 'Investigating', dateAdded: '2023-10-10'},
];

const mockInitialCreditReportData = {
  equifax: { score: 680, accounts: [ { id: 'EQA1', name: 'Capital One Visa', type: 'Credit Card', balance: '$1,200', status: 'OK', opened: '2020-01-15' }, { id: 'EQA3', name: 'LVNV Funding LLC', type: 'Collection', balance: '$540', status: 'Negative', opened: '2022-03-10' } ], inquiries: [], publicRecords: [], },
  transunion: { score: 750, accounts: [ { id: 'TUA2', name: 'Incorrect Account', type: 'Unknown', balance: '$2,150', status: 'Negative', opened: '2022-11-05' }, { id: 'TUA3', name: 'Amex Gold', type: 'Revolving', balance: '$3,400', status: 'OK', opened: '2018-02-11' } ], inquiries: [], publicRecords: [], },
  experian: { score: 520, accounts: [ { id: 'EXA3', name: 'Midland Funding', type: 'Collection', balance: '$880', status: 'Negative', opened: '2021-12-01' } ], inquiries: [], publicRecords: [], },
};

const mockInitialNotes: Note[] = [
    { id: 'N001', content: 'Client called to check status. Advised that we are waiting for responses from bureaus.', timestamp: '2023-10-22, 10:30 AM', author: 'Alice Johnson' },
    { id: 'N002', content: 'Initial consultation complete. Client is motivated to improve their score.', timestamp: '2023-09-01, 02:15 PM', author: 'Alice Johnson' },
];

const mockInitialDocuments: Document[] = [
    { id: 'DOC001', name: 'Drivers_License.pdf', type: 'ID', dateUploaded: '2023-09-01', size: '1.2MB' },
    { id: 'DOC002', name: 'Utility_Bill_Sept.jpg', type: 'Proof of Address', dateUploaded: '2023-09-01', size: '800KB' },
];

const mockInitialTasks: Task[] = [
    { id: 'T001', description: 'Follow up with client on Equifax dispute', dueDate: '2023-11-15', assignee: 'Alice Johnson', status: 'In Progress' },
    { id: 'T002', description: 'Request updated proof of address from client', dueDate: '2023-11-10', assignee: 'Admin', status: 'To Do' },
];

const mockInitialInvoices: Invoice[] = [
    { id: 'I001', invoiceNumber: 'INV-2023-001', amount: 350.00, dueDate: '2023-10-01', status: 'Paid' },
    { id: 'I002', invoiceNumber: 'INV-2023-002', amount: 350.00, dueDate: '2023-11-01', status: 'Unpaid' },
];


// --- MODAL COMPONENTS ---

const mockAgents = ['Alice Johnson', 'Bob Williams', 'Charlie Green', 'Admin'];

export const ComprehensiveClientModal: React.FC<{ isOpen: boolean; onClose: () => void; client: Client | null; onSave: (clientData: Client) => void; }> = ({ isOpen, onClose, client, onSave }) => {
    const emptyClient: Omit<Client, 'id' | 'createdDate' | 'lastUpdate' | 'profileCompletion' | 'status'> = { name: '', email: '', mobile: '', dob: '', ssn: '', address: '', agent: mockAgents[0] };
    const [formData, setFormData] = useState(emptyClient);

    useEffect(() => {
        if (isOpen) {
            if (client) {
                setFormData(client);
            } else {
                setFormData(emptyClient);
            }
        }
    }, [client, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleSave = () => {
        const clientDataToSave = {
            ...mockClients[0], // default values for non-form fields
            ...client, // existing client data if editing
            ...formData, // new form data
            id: client?.id || `C${Date.now()}`,
            lastUpdate: new Date().toISOString().split('T')[0],
            createdDate: client?.createdDate || new Date().toISOString().split('T')[0],
            status: client?.status || 'Pending',
        };
        onSave(clientDataToSave as Client);
        onClose();
    };
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={client ? "Edit Client Information" : "Add New Client"} 
            footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Changes</Button></>}
        >
            <div className="space-y-4">
                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                <Input label="Mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} />
                <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                <Input label="SSN" name="ssn" placeholder="***-**-****" value={formData.ssn} onChange={handleChange} />
                <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Assign Agent</label>
                    <select 
                        name="agent" 
                        value={formData.agent} 
                        onChange={handleChange} 
                        className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {mockAgents.map(agentName => (
                            <option key={agentName} value={agentName}>{agentName}</option>
                        ))}
                    </select>
                </div>
            </div>
        </Modal>
    );
};


const ImportReportModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; }> = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Import Credit Report" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onConfirm}>Confirm Import</Button></>}>
        <p className="text-slate-600">This will simulate importing a new credit report and update the client's scores. Are you sure you want to proceed?</p>
        <div className="mt-4 text-sm p-3 bg-primary-bg-hover text-primary-dark rounded-lg">
            <strong>Note:</strong> In a real application, you would upload a file. For this demo, we'll generate new random scores.
        </div>
    </Modal>
);

const AddDisputeModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: Omit<Dispute, 'id' | 'dateAdded' | 'status'>) => void; disputedItem: { name: string } | null; }> = ({ isOpen, onClose, onSubmit, disputedItem }) => {
    const [creditor, setCreditor] = useState('');
    const [reason, setReason] = useState('');
    const [type, setType] = useState<'Inaccuracy' | 'Fraud' | 'Duplicate'>('Inaccuracy');

    useEffect(() => {
        if (isOpen) {
            setCreditor(disputedItem?.name || '');
            setReason('');
            setType('Inaccuracy');
        }
    }, [isOpen, disputedItem]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!creditor || !reason) return;
        onSubmit({ creditor, reason, type });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Dispute" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Add Dispute</Button></>}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Creditor / Furnisher" value={creditor} onChange={(e) => setCreditor(e.target.value)} placeholder="e.g., Capital One" required />
                <Input label="Reason for Dispute" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Incorrect late payment" required />
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Type of Dispute</label>
                    <select value={type} onChange={(e) => setType(e.target.value as any)} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Inaccuracy</option> <option>Fraud</option> <option>Duplicate</option>
                    </select>
                </div>
            </form>
        </Modal>
    );
};

const BuildLetterModal: React.FC<{ isOpen: boolean; onClose: () => void; disputes: Dispute[]; onConfirm: (selectedDisputeIds: string[]) => void; }> = ({ isOpen, onClose, disputes, onConfirm }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const activeDisputes = disputes.filter(d => d.status === 'Draft' || d.status === 'Submitted' || d.status === 'Investigating');

    useEffect(() => { if (isOpen) setSelectedIds([]) }, [isOpen]);
    
    const toggleSelection = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Build Round Letter" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onConfirm(selectedIds)} disabled={selectedIds.length === 0}>Generate Letter ({selectedIds.length})</Button></>}>
            <div>
                <h3 className="font-semibold mb-2">Select disputes to include:</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2 border rounded-lg bg-slate-50/50">
                    {activeDisputes.length > 0 ? activeDisputes.map(dispute => (
                        <div key={dispute.id} onClick={() => toggleSelection(dispute.id)} className="flex items-center p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                            <input type="checkbox" checked={selectedIds.includes(dispute.id)} readOnly className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
                            <div className="ml-3 text-sm">
                                <span className="font-medium text-slate-800">{dispute.creditor}</span>
                                <p className="text-slate-500">{dispute.reason}</p>
                            </div>
                        </div>
                    )) : <p className="text-slate-500 text-sm p-4 text-center">No active disputes available to add to a letter.</p>}
                </div>
            </div>
        </Modal>
    );
};

const SendReportModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; }> = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Send Report" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onConfirm}>Send</Button></>}>
        <p className="text-slate-600">Are you sure you want to send the latest report to the client?</p>
    </Modal>
);

const UpdateRoundModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; }> = ({ isOpen, onClose, onConfirm }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Round" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onConfirm}>Confirm</Button></>}>
        <p className="text-slate-600">This will mark the beginning of a new dispute round. Proceed?</p>
    </Modal>
);

const AddNoteModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (content: string) => void; }> = ({ isOpen, onClose, onSubmit }) => {
    const [content, setContent] = useState('');
    
    const handleSubmit = () => {
        if (!content.trim()) return;
        onSubmit(content);
        setContent('');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Note" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Save Note</Button></>}>
            <div>
                <label htmlFor="note-content" className="block text-sm font-medium text-slate-600 mb-1">Note Content</label>
                <textarea id="note-content" value={content} onChange={e => setContent(e.target.value)} rows={5} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
            </div>
        </Modal>
    );
};

const AddDocumentModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (doc: Omit<Document, 'id' | 'dateUploaded' | 'size'>) => void; }> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'ID' | 'Proof of Address' | 'Utility Bill' | 'Other'>('Other');
    
    const handleSubmit = () => {
        if(!name.trim()) return;
        onSubmit({ name, type });
        setName('');
        setType('Other');
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Document (Simulation)" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Add Document</Button></>}>
            <div className="space-y-4">
                <Input label="Document Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Bank Statement Oct.pdf" />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Document Type</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>ID</option><option>Proof of Address</option><option>Utility Bill</option><option>Other</option>
                    </select>
                </div>
                 <div className="mt-4 text-sm p-3 bg-primary-bg-hover text-primary-dark rounded-lg">
                    <strong>Note:</strong> This simulates adding a document record. No file is actually uploaded.
                </div>
            </div>
        </Modal>
    );
};

const AddTaskModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (task: Omit<Task, 'id' | 'status'>) => void; }> = ({ isOpen, onClose, onSubmit }) => {
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [assignee, setAssignee] = useState('Admin');
    
    const handleSubmit = () => {
        if (!description.trim() || !dueDate) return;
        onSubmit({ description, dueDate, assignee });
        setDescription(''); setDueDate(''); setAssignee('Admin');
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Task" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Add Task</Button></>}>
            <div className="space-y-4">
                <Input label="Task Description" value={description} onChange={e => setDescription(e.target.value)} required />
                <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Assign To</label>
                    <select value={assignee} onChange={e => setAssignee(e.target.value)} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Admin</option><option>Alice Johnson</option><option>Bob Williams</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};

const CreateInvoiceModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'status'>) => void; }> = ({ isOpen, onClose, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [dueDate, setDueDate] = useState('');
    
    const handleSubmit = () => {
        if (!amount || !dueDate) return;
        onSubmit({ amount: parseFloat(amount), dueDate });
        setAmount(''); setDueDate('');
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Invoice" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Create Invoice</Button></>}>
            <div className="space-y-4">
                <Input label="Invoice Amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g., 350.00" required />
                <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
            </div>
        </Modal>
    );
};


// --- TAB COMPONENTS ---

const DisputesTab: React.FC<{ disputes: Dispute[] }> = ({ disputes }) => {
    const getStatusColor = (status: Dispute['status']) => {
        if (status === 'Positive') return 'bg-green-100 text-green-800'; if (status === 'Negative') return 'bg-red-100 text-red-800'; if (status === 'Investigating') return 'bg-yellow-100 text-yellow-800'; return 'bg-primary-bg-active text-primary-dark';
    };
    const steps = ['Draft', 'Submitted', 'Investigating', 'Decision'];
    return (
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
            }) : <Card><p className="text-center text-slate-500 py-8">No disputes found. Add a dispute from the credit report or using the 'Add Dispute' button.</p></Card>}
        </div>
    );
};

const CreditReportTab: React.FC<{ reportData: typeof mockInitialCreditReportData; onAddDispute: (item: { name: string }) => void; }> = ({ reportData, onAddDispute }) => {
    const [activeBureau, setActiveBureau] = useState<keyof typeof mockInitialCreditReportData>('equifax');
    const report = reportData[activeBureau];
    const AccountStatusBadge: React.FC<{ status: 'OK' | 'Negative' | 'Closed' }> = ({ status }) => { const classes = { OK: 'bg-green-100 text-green-800', Negative: 'bg-red-100 text-red-800', Closed: 'bg-slate-100 text-slate-800' }; return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>; };
    return (
        <Card className="p-0"><div className="flex border-b border-slate-200">
            {(['equifax', 'transunion', 'experian'] as const).map(bureau => (<button key={bureau} onClick={() => setActiveBureau(bureau)} className={`py-3 px-6 font-medium text-sm transition-colors capitalize ${activeBureau === bureau ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:bg-slate-50'}`}>{bureau}</button>))}
        </div><div className="p-6"><div className="mb-8 flex flex-col items-center justify-center"><h3 className="text-lg font-semibold text-slate-700 mb-2 capitalize">{activeBureau} Score</h3><CreditScoreMeter score={report.score} /></div>
        <div className="space-y-6"><div><h4 className="text-lg font-semibold mb-2">Accounts</h4><div className="overflow-x-auto border border-slate-200/80 rounded-lg"><table className="min-w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left font-medium text-slate-600">Account</th><th className="p-3 text-left font-medium text-slate-600">Balance</th><th className="p-3 text-left font-medium text-slate-600">Status</th><th className="p-3 text-left font-medium text-slate-600">Action</th></tr></thead>
            <tbody>{report.accounts.map(acc => (<tr key={acc.id} className="border-t border-slate-200/80"><td className="p-3 font-medium">{acc.name}</td><td className="p-3 text-slate-600">{acc.balance}</td><td className="p-3"><AccountStatusBadge status={acc.status as any} /></td><td className="p-3">{acc.status === 'Negative' && <Button variant="outline" size="sm" onClick={() => onAddDispute(acc)}>Add Dispute</Button>}</td></tr>))}</tbody>
        </table></div></div></div></div></Card>
    );
};

const LettersTab: React.FC<{ letters: Letter[] }> = ({ letters }) => (
    <Card>{letters.length > 0 ? (<ul className="divide-y divide-slate-200/80">{letters.map(letter => (<li key={letter.id} className="py-4"><p className="font-semibold">{letter.title}</p><p className="text-sm text-slate-500">Generated on: {letter.dateGenerated}</p><p className="mt-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-md border border-slate-200/80">{letter.content}</p></li>))}</ul>) : (<p className="text-center text-slate-500 py-8">No letters generated yet. Use 'Build Round Letter' to create new letters from your active disputes.</p>)}</Card>
);

const HistoryTab: React.FC<{ history: HistoryEvent[] }> = ({ history }) => (
    <Card>{history.length > 0 ? (<div className="flow-root"><ul role="list" className="-mb-8">{history.map((event, eventIdx) => (<li key={event.id}><div className="relative pb-8">{eventIdx !== history.length - 1 ? (<span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />) : null}<div className="relative flex space-x-3"><span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center ring-8 ring-white">{event.icon}</span><div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5"><div><p className="text-sm text-slate-600">{event.event}</p></div><div className="whitespace-nowrap text-right text-sm text-slate-500"><time>{event.timestamp.split(',')[0]}</time></div></div></div></div></li>))}</ul></div>) : (<p className="text-center text-slate-500 py-8">A timeline of all activities will appear here as you work.</p>)}</Card>
);

const NotesTab: React.FC<{ notes: Note[]; onAddNote: () => void; }> = ({ notes, onAddNote }) => (
    <Card title="Client Notes" actions={<Button size="sm" onClick={onAddNote}><PlusCircle size={16} className="mr-2"/>Add Note</Button>}>
        {notes.length > 0 ? (<div className="space-y-4">{notes.map(note => (
            <div key={note.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <p className="text-sm text-slate-700">{note.content}</p>
                <p className="text-xs text-slate-500 mt-2">{note.author} - {note.timestamp}</p>
            </div>))}
        </div>) : (<p className="text-center text-slate-500 py-8">No notes yet. Add a note to record client communication or internal reminders.</p>)}
    </Card>
);

const DocumentsTab: React.FC<{ documents: Document[]; onAddDocument: () => void; }> = ({ documents, onAddDocument }) => (
    <Card title="Client Documents" actions={<Button size="sm" onClick={onAddDocument}><Upload size={16} className="mr-2"/>Add Document</Button>}>
        {documents.length > 0 ? (<div className="overflow-x-auto"><table className="min-w-full text-sm">
            <thead className="bg-slate-50"><tr><th className="p-3 text-left font-medium text-slate-600">Name</th><th className="p-3 text-left font-medium text-slate-600">Type</th><th className="p-3 text-left font-medium text-slate-600">Date Uploaded</th><th className="p-3 text-left font-medium text-slate-600">Action</th></tr></thead>
            <tbody>{documents.map(doc => (<tr key={doc.id} className="border-t border-slate-200/80"><td className="p-3 font-medium">{doc.name}</td><td className="p-3"><span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800">{doc.type}</span></td><td className="p-3 text-slate-500">{doc.dateUploaded}</td><td className="p-3"><Button variant="ghost" size="sm"><Download size={16}/></Button></td></tr>))}</tbody>
        </table></div>) : (<p className="text-center text-slate-500 py-8">No documents uploaded for this client.</p>)}
    </Card>
);

const TasksTab: React.FC<{ tasks: Task[]; onAddTask: () => void; onUpdateStatus: (taskId: string, status: Task['status']) => void; }> = ({ tasks, onAddTask, onUpdateStatus }) => {
    const statusClasses = { 'To Do': 'bg-slate-100 text-slate-800', 'In Progress': 'bg-yellow-100 text-yellow-800', 'Done': 'bg-green-100 text-green-800' };
    return (
        <Card title="Client Tasks" actions={<Button size="sm" onClick={onAddTask}><PlusCircle size={16} className="mr-2" />Add Task</Button>}>
            {tasks.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-slate-50"><tr><th className="p-3 text-left font-medium text-slate-600">Task</th><th className="p-3 text-left font-medium text-slate-600">Due Date</th><th className="p-3 text-left font-medium text-slate-600">Assignee</th><th className="p-3 text-left font-medium text-slate-600">Status</th></tr></thead>
                        <tbody>{tasks.map(task => (<tr key={task.id} className="border-t border-slate-200/80">
                            <td className="p-3 font-medium">{task.description}</td>
                            <td className="p-3 text-slate-600">{task.dueDate}</td>
                            <td className="p-3 text-slate-600">{task.assignee}</td>
                            <td className="p-3">
                                <select value={task.status} onChange={(e) => onUpdateStatus(task.id, e.target.value as Task['status'])} className={`text-xs font-medium rounded-full border-0 focus:ring-0 ${statusClasses[task.status]}`}>
                                    <option>To Do</option><option>In Progress</option><option>Done</option>
                                </select>
                            </td>
                        </tr>))}</tbody>
                    </table>
                </div>
            ) : (<p className="text-center text-slate-500 py-8">No tasks for this client. Click 'Add Task' to get started.</p>)}
        </Card>
    );
};

const BillingTab: React.FC<{ invoices: Invoice[]; onCreateInvoice: () => void; }> = ({ invoices, onCreateInvoice }) => {
    const statusClasses = { 'Paid': 'bg-green-100 text-green-800', 'Unpaid': 'bg-yellow-100 text-yellow-800', 'Overdue': 'bg-red-100 text-red-800' };
    return (
        <Card title="Billing & Invoices" actions={<Button size="sm" onClick={onCreateInvoice}><PlusCircle size={16} className="mr-2" />Create Invoice</Button>}>
            {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                     <table className="min-w-full text-sm">
                        <thead className="bg-slate-50"><tr><th className="p-3 text-left font-medium text-slate-600">Invoice #</th><th className="p-3 text-left font-medium text-slate-600">Amount</th><th className="p-3 text-left font-medium text-slate-600">Due Date</th><th className="p-3 text-left font-medium text-slate-600">Status</th><th className="p-3 text-left font-medium text-slate-600">Action</th></tr></thead>
                        <tbody>{invoices.map(invoice => (<tr key={invoice.id} className="border-t border-slate-200/80"><td className="p-3 font-medium">{invoice.invoiceNumber}</td><td className="p-3 text-slate-600">${invoice.amount.toFixed(2)}</td><td className="p-3 text-slate-600">{invoice.dueDate}</td><td className="p-3"><span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[invoice.status]}`}>{invoice.status}</span></td><td className="p-3"><Button variant="ghost" size="sm"><Download size={16}/></Button></td></tr>))}</tbody>
                    </table>
                </div>
            ) : (<p className="text-center text-slate-500 py-8">No invoices found for this client.</p>)}
        </Card>
    );
};


// --- PAGE COMPONENTS ---

const ClientListPage: React.FC = () => {
    const [clients, setClients] = useState<Client[]>(mockClients);
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const actionMenuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setOpenActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredClients = useMemo(() => {
        return clients
            .filter(client => statusFilter === 'All' || client.status === statusFilter)
            .filter(client =>
                client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                client.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [clients, searchQuery, statusFilter]);
    
    const paginatedClients = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredClients.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredClients, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

    const handleOpenModal = (client: Client | null) => {
        setClientToEdit(client);
        setIsClientModalOpen(true);
        setOpenActionMenu(null);
    };

    const handleSaveClient = (clientData: Client) => {
        setClients(prev => {
            if (prev.some(c => c.id === clientData.id)) {
                return prev.map(c => (c.id === clientData.id ? clientData : c));
            }
            return [clientData, ...prev];
        });
        setIsClientModalOpen(false);
    };
    
    const handleDeleteClient = (clientId: string) => {
        setClients(prev => prev.filter(c => c.id !== clientId));
        setOpenActionMenu(null);
    };

    const renderPagination = () => {
        const pages = [];
        const maxPagesToShow = 5;
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else {
            if (currentPage <= Math.floor(maxPagesToShow / 2)) {
                startPage = 1;
                endPage = maxPagesToShow;
            } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
                startPage = totalPages - maxPagesToShow + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - Math.floor(maxPagesToShow / 2);
                endPage = currentPage + Math.floor(maxPagesToShow / 2);
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 rounded-md text-sm ${currentPage === i ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}
                >{i}</button>
            );
        }
        return pages;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Clients</h1>
                    <p className="text-slate-500">Manage your active and inactive clients.</p>
                </div>
                <Button onClick={() => handleOpenModal(null)}><PlusCircle size={18} className="mr-2" />Add Client</Button>
            </div>
            
            <Card noPadding>
                <div className="p-4 sm:p-6 border-b border-slate-200/80 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-grow">
                        <Input 
                            placeholder="Search by name or email..." 
                            icon={<Search size={16} className="text-slate-400" />} 
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                    <select
                        className="border border-slate-300 rounded-lg text-sm focus:ring-primary focus:border-primary"
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    >
                        <option>All</option><option>Active</option><option>Inactive</option><option>Pending</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/80">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Agent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Update</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200/80">
                            {paginatedClients.map(client => (
                                <tr key={client.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => navigate(`/app/clients/${client.id}`)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{client.name}</div>
                                        <div className="text-sm text-slate-500">{client.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <ClientStatusBadge status={client.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{client.agent}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{client.lastUpdate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block text-left" ref={openActionMenu === client.id ? actionMenuRef : null}>
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === client.id ? null : client.id); }}><MoreVertical size={16}/></Button>
                                            {openActionMenu === client.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button onClick={(e) => {e.stopPropagation(); navigate(`/app/clients/${client.id}`)}} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem"><Eye size={14} className="mr-2" /> View Profile</button>
                                                        <button onClick={(e) => {e.stopPropagation(); handleOpenModal(client)}} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem"><Edit size={14} className="mr-2" /> Edit</button>
                                                        <button onClick={(e) => {e.stopPropagation(); handleDeleteClient(client.id)}} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem"><Trash2 size={14} className="mr-2" /> Delete</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-200/80 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing {paginatedClients.length} of {filteredClients.length} results</p>
                    {totalPages > 1 && (
                        <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
                            {renderPagination()}
                            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
                        </div>
                    )}
                </div>
            </Card>

            <ComprehensiveClientModal 
                isOpen={isClientModalOpen} 
                onClose={() => setIsClientModalOpen(false)} 
                client={clientToEdit}
                onSave={handleSaveClient}
            />
        </div>
    );
};

const ClientProfilePage: React.FC<{ client: Client }> = ({ client }) => {
    const [currentClient, setCurrentClient] = useState(client);
    const [activeTab, setActiveTab] = useState('report');
    const navigate = useNavigate();

    // STATE
    const [creditReportData, setCreditReportData] = useState(mockInitialCreditReportData);
    const [disputes, setDisputes] = useState<Dispute[]>(mockInitialDisputes);
    const [letters, setLetters] = useState<Letter[]>([]);
    const [history, setHistory] = useState<HistoryEvent[]>([]);
    const [notes, setNotes] = useState<Note[]>(mockInitialNotes);
    const [documents, setDocuments] = useState<Document[]>(mockInitialDocuments);
    const [tasks, setTasks] = useState<Task[]>(mockInitialTasks);
    const [invoices, setInvoices] = useState<Invoice[]>(mockInitialInvoices);
    
    // MODAL STATE
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
    const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
    const [disputedItem, setDisputedItem] = useState<{ name: string } | null>(null);
    const [isSendReportModalOpen, setIsSendReportModalOpen] = useState(false);
    const [isUpdateRoundModalOpen, setIsUpdateRoundModalOpen] = useState(false);
    const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
    const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
    const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
    const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
    const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);

    // HANDLERS
    const addHistoryEvent = (event: string, icon: React.ReactNode) => setHistory(prev => [{ id: `H${Date.now()}`, timestamp: new Date().toLocaleString(), event, icon }, ...prev]);
    const handleImportReport = () => {
        const newScores = { equifax: Math.floor(Math.random() * 351) + 500, transunion: Math.floor(Math.random() * 351) + 500, experian: Math.floor(Math.random() * 351) + 500 };
        setCreditReportData(prev => ({ ...prev, equifax: { ...prev.equifax, score: newScores.equifax }, transunion: { ...prev.transunion, score: newScores.transunion }, experian: { ...prev.experian, score: newScores.experian } }));
        addHistoryEvent(`Credit report imported. New scores: EQ(${newScores.equifax}), TU(${newScores.transunion}), EX(${newScores.experian}).`, <Upload size={16} className="text-blue-500" />);
        setIsImportModalOpen(false);
    };
    const openDisputeModal = (item: { name: string } | null = null) => { setDisputedItem(item); setIsDisputeModalOpen(true); };
    const handleAddDispute = (newDisputeData: Omit<Dispute, 'id' | 'dateAdded' | 'status'>) => {
        const newDispute: Dispute = { id: `D${Date.now()}`, ...newDisputeData, status: 'Draft', dateAdded: new Date().toISOString().split('T')[0] };
        setDisputes(prev => [newDispute, ...prev]);
        addHistoryEvent(`New dispute created for ${newDispute.creditor}.`, <FilePlus size={16} className="text-green-500" />);
        setIsDisputeModalOpen(false);
    };
    const handleBuildLetter = (selectedDisputeIds: string[]) => {
        setIsLetterModalOpen(false);
        if (selectedDisputeIds.length === 0) return;
        const newLetter: Letter = { id: `L${Date.now()}`, title: `Dispute Letter - ${new Date().toLocaleDateString()}`, dateGenerated: new Date().toLocaleString(), content: `This letter is a formal request to investigate the following disputed items: ${selectedDisputeIds.join(', ')}. Please refer to the attached documents.` };
        setLetters(prev => [newLetter, ...prev]);
        addHistoryEvent(`Generated letter for ${selectedDisputeIds.length} dispute(s).`, <Bot size={16} className="text-purple-500" />);
    };
    const handleSendReport = () => { addHistoryEvent(`Report sent to client at ${currentClient.email}.`, <Send size={16} className="text-blue-500" />); setIsSendReportModalOpen(false); };
    const handleUpdateRound = () => { addHistoryEvent(`Dispute round updated. New round started.`, <RefreshCw size={16} className="text-indigo-500" />); setIsUpdateRoundModalOpen(false); };
    const handleUpdateClient = (updatedClient: Client) => { setCurrentClient(updatedClient); addHistoryEvent(`Client details updated for ${updatedClient.name}.`, <Edit size={16} className="text-gray-500" />); setIsEditClientModalOpen(false); };
    const handleAddNote = (content: string) => { const newNote: Note = { id: `N${Date.now()}`, content, timestamp: new Date().toLocaleString(), author: 'Admin' }; setNotes(prev => [newNote, ...prev]); addHistoryEvent(`New note added.`, <StickyNote size={16} className="text-yellow-500" />); setIsAddNoteModalOpen(false); };
    const handleAddDocument = (doc: Omit<Document, 'id' | 'dateUploaded' | 'size'>) => { const newDoc: Document = { id: `DOC${Date.now()}`, ...doc, dateUploaded: new Date().toLocaleDateString(), size: `${(Math.random() * 2 + 0.1).toFixed(1)}MB` }; setDocuments(prev => [newDoc, ...prev]); addHistoryEvent(`Document "${newDoc.name}" uploaded.`, <FolderArchive size={16} className="text-green-500" />); setIsAddDocModalOpen(false); };
    const handleAddTask = (taskData: Omit<Task, 'id' | 'status'>) => { const newTask: Task = { id: `T${Date.now()}`, ...taskData, status: 'To Do' }; setTasks(prev => [newTask, ...prev]); addHistoryEvent(`New task created: "${newTask.description}".`, <ListTodo size={16} className="text-cyan-500" />); setIsAddTaskModalOpen(false); };
    const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => { setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t)); addHistoryEvent(`Task status updated to "${status}".`, <ListTodo size={16} className="text-cyan-500" />); };
    const handleCreateInvoice = (invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'status'>) => { const newInvoice: Invoice = { id: `I${Date.now()}`, invoiceNumber: `INV-${Date.now().toString().slice(-4)}`, ...invoiceData, status: 'Unpaid' }; setInvoices(prev => [newInvoice, ...prev]); addHistoryEvent(`Invoice ${newInvoice.invoiceNumber} created for $${newInvoice.amount.toFixed(2)}.`, <Receipt size={16} className="text-orange-500" />); setIsCreateInvoiceModalOpen(false); };

    
    const tabs = [{ id: 'report', name: 'Credit Report', icon: BarChart2 }, { id: 'disputes', name: 'Disputes', icon: Briefcase }, { id: 'letters', name: 'Letters', icon: FileText }, { id: 'notes', name: 'Notes', icon: StickyNote }, { id: 'documents', name: 'Documents', icon: FolderArchive }, { id: 'tasks', name: 'Tasks', icon: ListTodo }, { id: 'billing', name: 'Billing', icon: Receipt }, { id: 'history', name: 'History', icon: History }];
    
    return (
        <div className="space-y-6">
            <Button variant="outline" size="sm" onClick={() => navigate('/app/clients')}><ChevronLeft size={16} className="mr-1" /> Back to Clients</Button>
            <Card className="relative">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">{currentClient.name}</h1>
                        <p className="text-slate-500">{currentClient.email} &bull; {currentClient.mobile}</p>
                    </div>
                    <div className="w-full md:w-1/3 pt-2"><ProgressBar value={client.profileCompletion} /></div>
                </div>

                <div className="border-t border-slate-200/80 pt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-6 text-sm">
                    <DetailItem icon={<ShieldCheck size={16} />} label="Status" value={<ClientStatusBadge status={currentClient.status} />} />
                    <DetailItem icon={<User size={16} />} label="Assigned Agent" value={currentClient.agent} />
                    <DetailItem icon={<Calendar size={16} />} label="Date of Birth" value={currentClient.dob} />
                    <DetailItem icon={<Fingerprint size={16} />} label="SSN" value={currentClient.ssn} />
                    <DetailItem icon={<MapPin size={16} />} label="Address" value={currentClient.address} className="sm:col-span-2 lg:col-span-3 xl:col-span-1" />
                    <DetailItem icon={<CalendarPlus size={16} />} label="Client Since" value={currentClient.createdDate} />
                    <DetailItem icon={<Clock size={16} />} label="Last Update" value={currentClient.lastUpdate} />
                </div>

                <Button variant="ghost" size="sm" className="absolute top-4 right-4 p-2" onClick={() => setIsEditClientModalOpen(true)} aria-label="Edit Client"><Edit size={18} /></Button>
                
                <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setIsImportModalOpen(true)}><Upload size={16} className="mr-2" /> Import Credit Report</Button>
                    <Button size="sm" onClick={() => openDisputeModal()}><FilePlus size={16} className="mr-2" /> Add Dispute</Button>
                    <Button size="sm" onClick={() => setIsLetterModalOpen(true)}><Bot size={16} className="mr-2" /> Build Round Letter</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsSendReportModalOpen(true)}><Send size={16} className="mr-2" /> Send Report</Button>
                    <Button size="sm" variant="outline" onClick={() => setIsUpdateRoundModalOpen(true)}><RefreshCw size={16} className="mr-2" /> Update Round</Button>
                </div>
            </Card>
            <div>
                <div className="border-b border-slate-200"><nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}><tab.icon size={16} className="mr-2" />{tab.name}</button>))}</nav></div>
                <div className="py-6">
                    {activeTab === 'report' && <CreditReportTab reportData={creditReportData} onAddDispute={openDisputeModal} />}
                    {activeTab === 'disputes' && <DisputesTab disputes={disputes} />}
                    {activeTab === 'letters' && <LettersTab letters={letters} />}
                    {activeTab === 'notes' && <NotesTab notes={notes} onAddNote={() => setIsAddNoteModalOpen(true)} />}
                    {activeTab === 'documents' && <DocumentsTab documents={documents} onAddDocument={() => setIsAddDocModalOpen(true)} />}
                    {activeTab === 'tasks' && <TasksTab tasks={tasks} onAddTask={() => setIsAddTaskModalOpen(true)} onUpdateStatus={handleUpdateTaskStatus} />}
                    {activeTab === 'billing' && <BillingTab invoices={invoices} onCreateInvoice={() => setIsCreateInvoiceModalOpen(true)} />}
                    {activeTab === 'history' && <HistoryTab history={history} />}
                </div>
            </div>
            <ImportReportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onConfirm={handleImportReport} />
            <AddDisputeModal isOpen={isDisputeModalOpen} onClose={() => setIsDisputeModalOpen(false)} onSubmit={handleAddDispute} disputedItem={disputedItem} />
            <BuildLetterModal isOpen={isLetterModalOpen} onClose={() => setIsLetterModalOpen(false)} disputes={disputes} onConfirm={handleBuildLetter} />
            <SendReportModal isOpen={isSendReportModalOpen} onClose={() => setIsSendReportModalOpen(false)} onConfirm={handleSendReport} />
            <UpdateRoundModal isOpen={isUpdateRoundModalOpen} onClose={() => setIsUpdateRoundModalOpen(false)} onConfirm={handleUpdateRound} />
            <ComprehensiveClientModal isOpen={isEditClientModalOpen} onClose={() => setIsEditClientModalOpen(false)} client={currentClient} onSave={handleUpdateClient} />
            <AddNoteModal isOpen={isAddNoteModalOpen} onClose={() => setIsAddNoteModalOpen(false)} onSubmit={handleAddNote} />
            <AddDocumentModal isOpen={isAddDocModalOpen} onClose={() => setIsAddDocModalOpen(false)} onSubmit={handleAddDocument} />
            <AddTaskModal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)} onSubmit={handleAddTask} />
            <CreateInvoiceModal isOpen={isCreateInvoiceModalOpen} onClose={() => setIsCreateInvoiceModalOpen(false)} onSubmit={handleCreateInvoice} />
        </div>
    );
};

const ClientsPage: React.FC = () => {
    const { clientId } = useParams();
    const client = mockClients.find(c => c.id === clientId);
    // In a real app, you'd fetch the client data here.
    // For this demo, we use the mock data. If a client is found, show their profile.
    return client ? <ClientProfilePage client={client} /> : <ClientListPage />;
};

export default ClientsPage;