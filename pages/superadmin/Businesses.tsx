import React, { useState, useMemo } from 'react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { Business, SubscriptionPlan } from '../../types';
import { PlusCircle, Search, MoreVertical, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

const mockPlans: SubscriptionPlan[] = [
    { id: 'plan_basic', name: 'Basic', price: 99, features: [], clientLimit: 50, userLimit: 2 },
    { id: 'plan_pro', name: 'Pro', price: 199, features: [], clientLimit: 200, userLimit: 10 },
    { id: 'plan_ent', name: 'Enterprise', price: 499, features: [], clientLimit: 1000, userLimit: 50 },
];

const allMockBusinesses: Business[] = [
  { id: 'B001', name: 'Credit Pros', ownerEmail: 'owner1@example.com', planId: 'plan_pro', status: 'Active', createdDate: '2023-10-01', userCount: 5 },
  { id: 'B002', name: 'FixItCredit', ownerEmail: 'owner2@example.com', planId: 'plan_pro', status: 'Active', createdDate: '2023-09-15', userCount: 8 },
  { id: 'B003', name: 'Score Boosters', ownerEmail: 'owner3@example.com', planId: 'plan_basic', status: 'Trial', createdDate: '2023-10-25', userCount: 1 },
  { id: 'B004', name: 'Financial Future', ownerEmail: 'owner4@example.com', planId: 'plan_basic', status: 'Active', createdDate: '2023-08-20', userCount: 2 },
  { id: 'B005', name: 'Credit Experts LLC', ownerEmail: 'owner5@example.com', planId: 'plan_ent', status: 'Active', createdDate: '2023-05-10', userCount: 25 },
  { id: 'B006', name: 'Legacy Credit', ownerEmail: 'owner6@example.com', planId: 'plan_basic', status: 'Inactive', createdDate: '2023-02-11', userCount: 1 },
];

const getStatusClasses = (status: Business['status']) => ({
    Active: 'bg-green-100 text-green-800',
    Inactive: 'bg-red-100 text-red-800',
    Trial: 'bg-yellow-100 text-yellow-800',
}[status]);

const BusinessModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (business: Business) => void;
    businessToEdit: Business | null;
}> = ({ isOpen, onClose, onSave, businessToEdit }) => {
    
    const getInitial = (): Omit<Business, 'id' | 'createdDate' | 'userCount'> => ({
        name: '', ownerEmail: '', planId: mockPlans[0].id, status: 'Trial'
    });

    const [formData, setFormData] = useState(getInitial());

    React.useEffect(() => {
        if(isOpen) setFormData(businessToEdit || getInitial());
    }, [businessToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        onSave({ ...formData, id: businessToEdit?.id || `B${Date.now()}`, createdDate: businessToEdit?.createdDate || new Date().toISOString().split('T')[0], userCount: businessToEdit?.userCount || 1 });
    };

    return (
        <Modal
            isOpen={isOpen} onClose={onClose} title={businessToEdit ? 'Edit Business' : 'Add New Business'}
            footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save</Button></>}
        >
            <div className="space-y-4">
                <Input label="Business Name" name="name" value={formData.name} onChange={handleChange} />
                <Input label="Owner Email" name="ownerEmail" type="email" value={formData.ownerEmail} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Subscription Plan</label>
                    <select name="planId" value={formData.planId} onChange={handleChange} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        {mockPlans.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price}/mo)</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Active</option><option>Inactive</option><option>Trial</option>
                    </select>
                </div>
            </div>
        </Modal>
    );
};

const BusinessesPage: React.FC = () => {
    const [businesses, setBusinesses] = useState<Business[]>(allMockBusinesses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [businessToEdit, setBusinessToEdit] = useState<Business | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    const filteredBusinesses = useMemo(() => {
        return businesses.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.ownerEmail.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [businesses, searchQuery]);

    const paginatedBusinesses = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredBusinesses.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredBusinesses, currentPage, itemsPerPage]);
    
    const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);

    const handleOpenModal = (business: Business | null = null) => {
        setBusinessToEdit(business);
        setIsModalOpen(true);
    };
    
    const handleSave = (data: Business) => {
        setBusinesses(prev => {
            if (prev.some(b => b.id === data.id)) return prev.map(b => b.id === data.id ? data : b);
            return [data, ...prev];
        });
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Businesses</h1>
                    <p className="text-slate-500">Manage all businesses using the platform.</p>
                </div>
                <Button onClick={() => handleOpenModal()}><PlusCircle size={18} className="mr-2" /> Add Business</Button>
            </div>
            
            <Card noPadding>
                <div className="p-4 sm:p-6 border-b border-slate-200/80">
                    <Input placeholder="Search by name or owner email..." icon={<Search size={16} className="text-slate-400" />} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200/80">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Business</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Plan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Users</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Joined</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Action</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200/80">
                            {paginatedBusinesses.map(business => (
                                <tr key={business.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-900">{business.name}</div>
                                        <div className="text-sm text-slate-500">{business.ownerEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-700">{mockPlans.find(p => p.id === business.planId)?.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(business.status)}`}>{business.status}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{business.userCount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{business.createdDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(business)}><Edit size={16}/></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 border-t border-slate-200/80 flex items-center justify-between">
                    <p className="text-sm text-slate-500">Showing {paginatedBusinesses.length} of {filteredBusinesses.length} results</p>
                    <div className="flex items-center gap-1">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft size={14} /></Button>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight size={14} /></Button>
                    </div>
                </div>
            </Card>

            <BusinessModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} businessToEdit={businessToEdit} onSave={handleSave} />
        </div>
    );
};

export default BusinessesPage;
