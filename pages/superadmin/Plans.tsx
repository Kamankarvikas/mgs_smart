import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { SubscriptionPlan } from '../../types';
import { PlusCircle, Edit, Trash2, Check, Users, FileText } from 'lucide-react';

const mockInitialPlans: SubscriptionPlan[] = [
    { id: 'plan_basic', name: 'Basic', price: 99, clientLimit: 50, userLimit: 2, features: ['Client Portal', 'Basic Dispute Letters', 'Email Support'] },
    { id: 'plan_pro', name: 'Pro', price: 199, clientLimit: 200, userLimit: 10, features: ['Everything in Basic', 'Advanced Reporting', 'Letter Automation', 'Team Management'] },
    { id: 'plan_ent', name: 'Enterprise', price: 499, clientLimit: 1000, userLimit: 50, features: ['Everything in Pro', 'API Access', 'Dedicated Account Manager', 'White Labeling'] },
];

const PlanModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (plan: SubscriptionPlan) => void;
    planToEdit: SubscriptionPlan | null;
}> = ({ isOpen, onClose, onSave, planToEdit }) => {
    
    const getInitial = (): Omit<SubscriptionPlan, 'id'> => ({
        name: '', price: 0, clientLimit: 0, userLimit: 0, features: []
    });

    const [formData, setFormData] = useState(getInitial());
    const [featuresStr, setFeaturesStr] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            if (planToEdit) {
                setFormData(planToEdit);
                setFeaturesStr(planToEdit.features.join('\n'));
            } else {
                setFormData(getInitial());
                setFeaturesStr('');
            }
        }
    }, [planToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value }));
    };

    const handleSave = () => {
        onSave({ ...formData, features: featuresStr.split('\n').filter(f => f.trim() !== ''), id: planToEdit?.id || `plan_${Date.now()}` });
    };

    return (
        <Modal
            isOpen={isOpen} onClose={onClose} title={planToEdit ? 'Edit Plan' : 'Add New Plan'}
            footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Plan</Button></>}
        >
            <div className="space-y-4">
                <Input label="Plan Name" name="name" value={formData.name} onChange={handleChange} />
                <Input label="Price (per month)" name="price" type="number" value={String(formData.price)} onChange={handleChange} />
                <Input label="Client Limit" name="clientLimit" type="number" value={String(formData.clientLimit)} onChange={handleChange} />
                <Input label="User Limit" name="userLimit" type="number" value={String(formData.userLimit)} onChange={handleChange} />
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Features (one per line)</label>
                    <textarea value={featuresStr} onChange={e => setFeaturesStr(e.target.value)} rows={5} className="block w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"></textarea>
                </div>
            </div>
        </Modal>
    );
};

const PlanCard: React.FC<{ plan: SubscriptionPlan, onEdit: () => void }> = ({ plan, onEdit }) => (
    <Card className="flex flex-col">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
            <Button variant="ghost" size="sm" onClick={onEdit}><Edit size={16} /></Button>
        </div>
        <div className="my-4">
            <span className="text-4xl font-extrabold">${plan.price}</span>
            <span className="text-base font-medium text-slate-500">/month</span>
        </div>
        <div className="flex-grow space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center text-sm"><FileText size={16} className="mr-2 text-slate-500" /> Up to <strong>{plan.clientLimit}</strong> clients</div>
            <div className="flex items-center text-sm"><Users size={16} className="mr-2 text-slate-500" /> Up to <strong>{plan.userLimit}</strong> team members</div>
            {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start text-sm">
                    <Check size={16} className="mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                </div>
            ))}
        </div>
        <Button className="w-full mt-6">Choose Plan</Button>
    </Card>
);


const PlansPage: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>(mockInitialPlans);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planToEdit, setPlanToEdit] = useState<SubscriptionPlan | null>(null);

    const handleOpenModal = (plan: SubscriptionPlan | null = null) => {
        setPlanToEdit(plan);
        setIsModalOpen(true);
    };

    const handleSave = (data: SubscriptionPlan) => {
        setPlans(prev => {
            if (prev.some(p => p.id === data.id)) return prev.map(p => p.id === data.id ? data : p);
            return [...prev, data];
        });
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Subscription Plans</h1>
                    <p className="text-slate-500">Manage pricing and features for your customers.</p>
                </div>
                <Button onClick={() => handleOpenModal()}><PlusCircle size={18} className="mr-2" /> Add New Plan</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map(plan => (
                    <PlanCard key={plan.id} plan={plan} onEdit={() => handleOpenModal(plan)} />
                ))}
            </div>

            <PlanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} planToEdit={planToEdit} onSave={handleSave} />
        </div>
    );
};

export default PlansPage;
