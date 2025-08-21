
import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '../../components/ui';
import { User, Mail, Phone, Home, Calendar, Fingerprint, Edit } from 'lucide-react';

interface ClientProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    ssn: string;
    address: string;
}

const mockProfile: ClientProfile = {
    firstName: 'Jessica',
    lastName: 'Day',
    email: 'client@example.com',
    phone: '555-0199',
    dob: '1988-04-12',
    ssn: '***-**-1234',
    address: '890 Loft Ave, Anytown, USA',
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode; className?: string }> = ({ icon, label, value, className = '' }) => (
    <div className={`flex items-start ${className}`}>
        <div className="flex-shrink-0 text-slate-400 mt-1">{icon}</div>
        <div className="ml-3">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-base font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);

const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; profile: ClientProfile; onSave: (data: ClientProfile) => void; }> = ({ isOpen, onClose, profile, onSave }) => {
    const [formData, setFormData] = useState(profile);

    React.useEffect(() => {
        if (isOpen) setFormData(profile);
    }, [isOpen, profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen} onClose={onClose} title="Edit Your Information"
            footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave}>Save Changes</Button></>}
        >
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                    <Input label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                </div>
                <Input label="Email" name="email" value={formData.email} onChange={handleChange} />
                <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                <Input label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                <Input label="Address" name="address" value={formData.address} onChange={handleChange} />
                <Input label="SSN" name="ssn" value={formData.ssn} onChange={handleChange} helperText="For security, this field is masked." />
            </div>
        </Modal>
    );
};


const ClientAccountPage: React.FC = () => {
    const [profile, setProfile] = useState<ClientProfile>(mockProfile);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSaveProfile = (updatedProfile: ClientProfile) => {
        setProfile(updatedProfile);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-slate-500">View and manage your personal information.</p>
                </div>
                <Button onClick={() => setIsEditModalOpen(true)}>
                    <Edit size={18} className="mr-2" /> Edit Profile
                </Button>
            </div>

            <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                    <InfoItem icon={<User size={16} />} label="Full Name" value={`${profile.firstName} ${profile.lastName}`} />
                    <InfoItem icon={<Mail size={16} />} label="Email" value={profile.email} />
                    <InfoItem icon={<Phone size={16} />} label="Phone" value={profile.phone} />
                    <InfoItem icon={<Calendar size={16} />} label="Date of Birth" value={profile.dob} />
                    <InfoItem icon={<Home size={16} />} label="Address" value={profile.address} className="sm:col-span-2" />
                    <InfoItem icon={<Fingerprint size={16} />} label="SSN" value={profile.ssn} />
                </div>
            </Card>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default ClientAccountPage;
