import React, { useState } from 'react';
import { Card, Button, Input } from '../../components/ui';
import { CheckCircle, Bell, CreditCard } from 'lucide-react';

const Switch: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; label: string; description: string; }> = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
        <div>
            <p className="font-medium text-slate-800">{label}</p>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
        <button
            type="button"
            className={`${checked ? 'bg-primary' : 'bg-slate-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
        >
            <span className={`${checked ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`} />
        </button>
    </div>
);

const SuperAdminSettingsPage: React.FC = () => {
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = () => {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };
    
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Platform Settings</h1>
            
            <Card>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-slate-600" />
                        <h2 className="text-xl font-semibold">Billing & API</h2>
                    </div>
                    <Button onClick={handleSave} disabled={isSaved}>
                      {isSaved ? <><CheckCircle size={16} className="mr-2" /> Saved!</> : 'Save Changes'}
                    </Button>
                </div>
                <div className="space-y-6">
                    <Input label="Stripe API Public Key" type="password" defaultValue="pk_test_1234567890" />
                    <Input label="Stripe API Secret Key" type="password" defaultValue="sk_test_1234567890" />
                </div>
            </Card>

             <Card>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                     <div className="flex items-center gap-3">
                        <Bell size={20} className="text-slate-600" />
                        <h2 className="text-xl font-semibold">Notifications</h2>
                    </div>
                </div>
                <div className="space-y-6">
                    <Input label="Platform Admin Email" defaultValue="admins@mgssmartcredit.com" helperText="This email receives notifications about new sign-ups and failed payments." />
                    <Switch
                        label="New Sign-up Notifications"
                        description="Send an email to the platform admin when a new business signs up."
                        checked={true}
                        onChange={() => {}}
                    />
                </div>
            </Card>
        </div>
    );
};

export default SuperAdminSettingsPage;