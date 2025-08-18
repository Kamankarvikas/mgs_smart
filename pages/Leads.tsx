
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card, Button, Input, Modal } from '../components/ui';
import { Lead } from '../types';
import { PlusCircle, MoreVertical, Edit, Trash2, Search, ChevronLeft, ChevronRight, ChevronsRight, ChevronDown } from 'lucide-react';

const allMockLeads: Lead[] = [
  { id: 'L001', name: 'John Doe', email: 'john.d@example.com', mobile: '555-0101', dob: '1985-01-15', ssn: '***-**-1111', address: '111 Pine St', status: 'New', salesperson: 'Alice Johnson', dateEntered: '2023-10-26', stage: 'Initial Inquiry' },
  { id: 'L002', name: 'Jane Smith', email: 'jane.s@example.com', mobile: '555-0102', dob: '1990-02-20', ssn: '***-**-2222', address: '222 Oak St', status: 'Contacted', salesperson: 'Bob Williams', dateEntered: '2023-10-25', stage: 'Follow-up' },
  { id: 'L003', name: 'Mike Brown', email: 'mike.b@example.com', mobile: '555-0103', dob: '1978-03-25', ssn: '***-**-3333', address: '333 Maple St', status: 'Qualified', salesperson: 'Alice Johnson', dateEntered: '2023-10-24', stage: 'Negotiation' },
  { id: 'L004', name: 'Sarah Davis', email: 'sarah.d@example.com', mobile: '555-0104', dob: '1995-04-30', ssn: '***-**-4444', address: '444 Birch St', status: 'Lost', salesperson: 'Charlie Green', dateEntered: '2023-10-23', stage: 'Follow-up' },
  { id: 'L005', name: 'Chris Wilson', email: 'chris.w@example.com', mobile: '555-0105', dob: '1992-05-10', ssn: '***-**-5555', address: '555 Elm St', status: 'New', salesperson: 'Alice Johnson', dateEntered: '2023-10-22', stage: 'Initial Inquiry' },
  { id: 'L006', name: 'Patricia Martinez', email: 'patricia.m@example.com', mobile: '555-0106', dob: '1988-06-15', ssn: '***-**-6666', address: '666 Cedar St', status: 'Contacted', salesperson: 'Bob Williams', dateEntered: '2023-10-21', stage: 'Follow-up' },
  { id: 'L007', name: 'Robert Anderson', email: 'robert.a@example.com', mobile: '555-0107', dob: '1975-07-20', ssn: '***-**-7777', address: '777 Walnut St', status: 'Qualified', salesperson: 'Alice Johnson', dateEntered: '2023-10-20', stage: 'Negotiation' },
  { id: 'L008', name: 'Linda Thomas', email: 'linda.t@example.com', mobile: '555-0108', dob: '1998-08-25', ssn: '***-**-8888', address: '888 Spruce St', status: 'New', salesperson: 'Charlie Green', dateEntered: '2023-10-19', stage: 'Initial Inquiry' },
  { id: 'L009', name: 'James Jackson', email: 'james.j@example.com', mobile: '555-0109', dob: '1983-09-30', ssn: '***-**-9999', address: '999 Redwood St', status: 'Lost', salesperson: 'Bob Williams', dateEntered: '2023-10-18', stage: 'Follow-up' },
  { id: 'L010', name: 'Jennifer White', email: 'jennifer.w@example.com', mobile: '555-0110', dob: '1991-10-05', ssn: '***-**-1010', address: '1010 Aspen St', status: 'Qualified', salesperson: 'Alice Johnson', dateEntered: '2023-10-17', stage: 'Negotiation' },
  { id: 'L011', name: 'David Harris', email: 'david.h@example.com', mobile: '555-0111', dob: '1986-11-10', ssn: '***-**-1111', address: '1111 Sequoia St', status: 'New', salesperson: 'Charlie Green', dateEntered: '2023-10-16', stage: 'Initial Inquiry' },
  { id: 'L012', name: 'Barbara Clark', email: 'barbara.c@example.com', mobile: '555-0112', dob: '1993-12-15', ssn: '***-**-1212', address: '1212 Willow St', status: 'Contacted', salesperson: 'Bob Williams', dateEntered: '2023-10-15', stage: 'Follow-up' },
];

const getStatusClasses = (status: Lead['status']) => {
  const statusClasses = {
    New: 'bg-blue-100 text-blue-800',
    Contacted: 'bg-yellow-100 text-yellow-800',
    Qualified: 'bg-green-100 text-green-800',
    Lost: 'bg-red-100 text-red-800',
  };
  return statusClasses[status] || 'bg-gray-100 text-gray-800';
};

const getStageClasses = (stage: Lead['stage']) => {
  const stageClasses = {
    'Initial Inquiry': 'bg-slate-100 text-slate-800',
    'Follow-up': 'bg-orange-100 text-orange-800',
    'Negotiation': 'bg-violet-100 text-violet-800',
  };
  return stageClasses[stage] || 'bg-gray-100 text-gray-800';
};

const LeadModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (lead: Lead) => void;
    leadToEdit: Lead | null;
}> = ({ isOpen, onClose, onSave, leadToEdit }) => {
    const getInitialFormData = (): Omit<Lead, 'id' | 'dateEntered'> => ({
        name: '', email: '', mobile: '', dob: '', ssn: '', address: '',
        status: 'New', salesperson: '', stage: 'Initial Inquiry'
    });
    
    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (isOpen) {
            if (leadToEdit) {
                setFormData({
                    ...getInitialFormData(),
                    ...leadToEdit
                });
            } else {
                setFormData(getInitialFormData());
            }
        }
    }, [leadToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        if (!formData.name || !formData.salesperson) return; // Basic validation
        const leadData: Lead = {
            ...formData,
            id: leadToEdit?.id || `L${Date.now()}`,
            dateEntered: leadToEdit?.dateEntered || new Date().toISOString().split('T')[0],
        };
        onSave(leadData);
    };

    const commonSelectClasses = "block w-full px-4 h-10 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={leadToEdit ? 'Edit Lead' : 'Add New Lead'}
            footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Lead</Button></>}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Salesperson" name="salesperson" value={formData.salesperson} onChange={handleChange} required />
                    <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
                    <Input label="Mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} />
                    <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                    <Input label="SSN" name="ssn" value={formData.ssn} onChange={handleChange} />
                    <div className="md:col-span-2">
                        <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className={commonSelectClasses}>
                            <option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">Stage</label>
                        <select name="stage" value={formData.stage} onChange={handleChange} className={commonSelectClasses}>
                            <option>Initial Inquiry</option><option>Follow-up</option><option>Negotiation</option>
                        </select>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

const ConversionModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: () => void; leadName: string; }> = ({ isOpen, onClose, onConfirm, leadName }) => (
    <Modal isOpen={isOpen} onClose={onClose} title="Convert Lead to Client" footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={onConfirm}>Confirm</Button></>}>
        <p className="text-slate-600">Are you sure you want to convert lead <strong className="text-primary">{leadName}</strong> into an active client? This action cannot be undone.</p>
    </Modal>
);

const LeadsPage: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(allMockLeads);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
    const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
    const actionMenuRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
    const itemsPerPage = 7;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setOpenActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => statusFilter === 'All' || lead.status === statusFilter)
            .filter(lead =>
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
    }, [leads, searchQuery, statusFilter]);

    const paginatedLeads = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredLeads.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredLeads, currentPage, itemsPerPage]);
    
    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLeadToEdit(null);
    };

    const handleOpenModal = (lead: Lead | null = null) => {
        setLeadToEdit(lead);
        setIsModalOpen(true);
        setOpenActionMenu(null);
    };

    const handleSaveLead = (leadData: Lead) => {
        setLeads(prev => {
            const exists = prev.some(l => l.id === leadData.id);
            if (exists) {
                return prev.map(l => (l.id === leadData.id ? leadData : l));
            }
            return [leadData, ...prev];
        });
        handleCloseModal();
    };

    const handleDeleteLead = (leadId: string) => {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        setOpenActionMenu(null);
    };

    const handleConvertLead = () => {
        if (leadToConvert) {
            console.log(`Converting lead ${leadToConvert.name} to client.`);
            setLeads(prev => prev.filter(l => l.id !== leadToConvert.id));
            setLeadToConvert(null);
        }
    };

    const handleLeadUpdate = (e: React.ChangeEvent<HTMLSelectElement>, leadId: string, field: keyof Lead) => {
        e.stopPropagation();
        const { value } = e.target;
        setLeads(prevLeads =>
            prevLeads.map(lead =>
                lead.id === leadId ? { ...lead, [field]: value } : lead
            )
        );
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
                    <h1 className="text-3xl font-bold">Leads</h1>
                    <p className="text-slate-500">Manage your potential clients and sales pipeline.</p>
                </div>
                <Button onClick={() => handleOpenModal()}><PlusCircle size={18} className="mr-2" /> Add Lead</Button>
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
                        <option>All</option><option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/80">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Salesperson</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date Entered</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Stage</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200/80">
                            {paginatedLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-sm font-medium text-slate-900">{lead.name}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="relative w-32">
                                            <select 
                                                value={lead.status}
                                                onChange={(e) => handleLeadUpdate(e, lead.id, 'status')}
                                                onClick={(e) => e.stopPropagation()}
                                                className={`appearance-none w-full text-xs font-semibold rounded-full px-3 py-1.5 pr-8 border-0 focus:ring-2 focus:ring-offset-1 focus:ring-primary/50 ${getStatusClasses(lead.status)}`}
                                            >
                                                <option value="New">New</option><option value="Contacted">Contacted</option><option value="Qualified">Qualified</option><option value="Lost">Lost</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{lead.salesperson}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{lead.dateEntered}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <div className="relative w-36">
                                            <select 
                                                value={lead.stage}
                                                onChange={(e) => handleLeadUpdate(e, lead.id, 'stage')}
                                                onClick={(e) => e.stopPropagation()}
                                                className={`appearance-none w-full text-xs font-semibold rounded-full px-3 py-1.5 pr-8 border-0 focus:ring-2 focus:ring-offset-1 focus:ring-primary/50 ${getStageClasses(lead.stage)}`}
                                            >
                                                <option>Initial Inquiry</option><option>Follow-up</option><option>Negotiation</option>
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current">
                                                <ChevronDown size={14} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="relative inline-block text-left" ref={openActionMenu === lead.id ? actionMenuRef : null}>
                                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setOpenActionMenu(openActionMenu === lead.id ? null : lead.id) }}><MoreVertical size={16}/></Button>
                                            {openActionMenu === lead.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(lead); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem"><Edit size={14} className="mr-2" /> Edit</button>
                                                        {lead.status === 'Qualified' && <button onClick={(e) => { e.stopPropagation(); setLeadToConvert(lead); setOpenActionMenu(null); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50" role="menuitem"><ChevronsRight size={14} className="mr-2" /> Convert to Client</button>}
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteLead(lead.id); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50" role="menuitem"><Trash2 size={14} className="mr-2" /> Delete</button>
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
                    <p className="text-sm text-slate-500">Showing {paginatedLeads.length} of {filteredLeads.length} results</p>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
                        {renderPagination()}
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
                    </div>
                </div>
            </Card>

            <LeadModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal}
                leadToEdit={leadToEdit}
                onSave={handleSaveLead}
            />
            {leadToConvert && (
                <ConversionModal
                    isOpen={!!leadToConvert}
                    onClose={() => setLeadToConvert(null)}
                    onConfirm={handleConvertLead}
                    leadName={leadToConvert.name}
                />
            )}
        </div>
    );
};

export default LeadsPage;
