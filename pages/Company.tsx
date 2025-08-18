import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../components/ui';
import { CompanyProfile, OwnerProfile, Compliance } from '../types';
import { Building2, User, Mail, Phone, Globe, Hash, Home, Calendar, Fingerprint, CheckCircle, Edit, UploadCloud } from 'lucide-react';
import { useAppSettings } from '../App';

interface FullProfile {
    company: CompanyProfile;
    owner: OwnerProfile;
    compliance: Compliance;
}

const mockProfileData: FullProfile = {
    company: {
        logoUrl: '',
        name: 'MGS SmartCredit',
        email: 'contact@mgssmartcredit.com',
        phone: '(555) 123-4567',
        website: 'https://mgssmartcredit.com',
        address: '123 Main St, Anytown, USA',
        ein: '12-3456789',
    },
    owner: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        dob: '1980-01-01',
        address: '456 Oak Ave, Anytown, USA',
        ssn: '***-**-5678',
    },
    compliance: {
        croa: true,
        eSignature: true,
        stateLicensing: false,
    }
};

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; value: React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0 text-slate-400 mt-1">{icon}</div>
        <div className="ml-3">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="text-base font-semibold text-slate-800">{value}</p>
        </div>
    </div>
);

const ComplianceItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
     <div className="flex items-center">
        <CheckCircle size={20} className={checked ? 'text-green-500' : 'text-slate-300'} />
        <span className="ml-2 text-base font-semibold text-slate-800">{label}</span>
    </div>
)

const EditProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; profile: FullProfile; onSave: (data: FullProfile) => void; }> = ({ isOpen, onClose, profile, onSave }) => {
    const [formData, setFormData] = useState(profile);
    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => {
        if (isOpen) {
            setFormData(profile);
            setCurrentStep(1);
        }
    }, [isOpen, profile]);

    const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, company: { ...prev.company, [name]: value } }));
    };

    const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, owner: { ...prev.owner, [name]: value } }));
    };

    const handleSave = () => {
        onSave(formData);
        onClose();
    };
    
    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);
    
    const renderFooter = () => {
        if (currentStep === 1) {
            return (
                <>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={nextStep}>Next: Owner Info</Button>
                </>
            );
        }
        return (
            <>
                <Button variant="outline" onClick={prevStep}>Back</Button>
                <div className="flex-grow" />
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
            </>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Company Profile"
            footer={renderFooter()}
        >
            <div className="mb-4">
                <ol className="flex items-center w-full">
                    <li className={`flex w-full items-center ${currentStep >= 1 ? 'text-primary' : 'text-slate-500'} after:content-[''] after:w-full after:h-1 after:border-b ${currentStep > 1 ? 'after:border-primary' : 'after:border-slate-200'} after:inline-block`}>
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${currentStep >= 1 ? 'bg-primary text-white' : 'bg-slate-200'}`}>1</span>
                    </li>
                    <li className={`flex items-center ${currentStep === 2 ? 'text-primary' : 'text-slate-500'}`}>
                        <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${currentStep === 2 ? 'bg-primary text-white' : 'bg-slate-200'}`}>2</span>
                    </li>
                </ol>
            </div>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Company Information</h3>
                        <Input label="Business Name" name="name" value={formData.company.name} onChange={handleCompanyChange} />
                        <Input label="Business Email" name="email" value={formData.company.email} onChange={handleCompanyChange} />
                        <Input label="Business Phone" name="phone" value={formData.company.phone} onChange={handleCompanyChange} />
                        <Input label="Website" name="website" value={formData.company.website} onChange={handleCompanyChange} />
                        <Input label="Address" name="address" value={formData.company.address} onChange={handleCompanyChange} />
                        <Input label="EIN" name="ein" value={formData.company.ein} onChange={handleCompanyChange} />
                    </div>
                )}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Owner Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="First Name" name="firstName" value={formData.owner.firstName} onChange={handleOwnerChange} />
                            <Input label="Last Name" name="lastName" value={formData.owner.lastName} onChange={handleOwnerChange} />
                        </div>
                        <Input label="Email" name="email" value={formData.owner.email} onChange={handleOwnerChange} />
                        <Input label="Date of Birth" name="dob" type="date" value={formData.owner.dob} onChange={handleOwnerChange} />
                        <Input label="SSN" name="ssn" value={formData.owner.ssn} onChange={handleOwnerChange} />
                        <Input label="Address" name="address" value={formData.owner.address} onChange={handleOwnerChange} />
                    </div>
                )}
            </div>
        </Modal>
    );
};

const CompanyProfilePage: React.FC = () => {
    const { settings, updateSettings } = useAppSettings();
    const [profile, setProfile] = useState<FullProfile>(() => ({
        ...mockProfileData,
        company: {
            ...mockProfileData.company,
            name: settings.companyName,
        }
    }));
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        setProfile(prev => ({
            ...prev,
            company: { ...prev.company, name: settings.companyName }
        }));
    }, [settings.companyName]);


    const handleSaveProfile = (updatedProfile: FullProfile) => {
        setProfile(updatedProfile);
        updateSettings({ companyName: updatedProfile.company.name });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Company Profile</h1>
                    <p className="text-slate-500">View and manage your business information.</p>
                </div>
                <Button onClick={() => setIsEditModalOpen(true)}>
                    <Edit size={18} className="mr-2" />
                    Edit Profile
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="Company Information" className="lg:col-span-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                         <div className="flex items-center gap-4 sm:col-span-2">
                            <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                                <UploadCloud size={32} className="text-slate-400" />
                            </div>
                             <div>
                                 <h3 className="text-xl font-bold text-slate-900">{profile.company.name}</h3>
                                 <p className="text-sm text-primary">{profile.company.website}</p>
                             </div>
                        </div>
                        <InfoItem icon={<Mail size={16} />} label="Email" value={profile.company.email} />
                        <InfoItem icon={<Phone size={16} />} label="Phone" value={profile.company.phone} />
                        <InfoItem icon={<Home size={16} />} label="Address" value={profile.company.address} />
                        <InfoItem icon={<Hash size={16} />} label="EIN" value={profile.company.ein} />
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Owner Information">
                        <div className="space-y-4">
                            <InfoItem icon={<User size={16} />} label="Name" value={`${profile.owner.firstName} ${profile.owner.lastName}`} />
                            <InfoItem icon={<Mail size={16} />} label="Email" value={profile.owner.email} />
                            <InfoItem icon={<Calendar size={16} />} label="Date of Birth" value={profile.owner.dob} />
                            <InfoItem icon={<Fingerprint size={16} />} label="SSN" value={profile.owner.ssn} />
                        </div>
                    </Card>

                    <Card title="Compliance Status">
                        <div className="space-y-4">
                           <ComplianceItem label="CROA Compliance" checked={profile.compliance.croa} />
                           <ComplianceItem label="E-Signature Agreement" checked={profile.compliance.eSignature} />
                           <ComplianceItem label="State-Specific Licensing" checked={profile.compliance.stateLicensing} />
                        </div>
                    </Card>
                </div>
            </div>

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default CompanyProfilePage;