import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, Button, Input } from '../../components/ui';
import { CheckCircle, ChevronLeft, ChevronRight, UploadCloud, CreditCard, ShieldCheck } from 'lucide-react';
import { useAppSettings } from '../../App';

const OnboardingStep: React.FC<{ step: number; title: string; isActive: boolean; isCompleted: boolean }> = ({ step, title, isActive, isCompleted }) => (
    <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
            {isCompleted ? <CheckCircle size={24} /> : step}
        </div>
        <div>
            <h3 className={`font-semibold ${isActive ? 'text-primary' : 'text-slate-800'}`}>{title}</h3>
        </div>
    </div>
);

const ClientOnboardingPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const totalSteps = 4;

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    
    const finishOnboarding = () => {
        localStorage.setItem('clientOnboardingComplete', 'true');
        navigate('/client/dashboard');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Client Onboarding</h1>
                    <p className="text-slate-500 mt-1">Please complete the following steps to activate your portal.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="space-y-6">
                            <OnboardingStep step={1} title="Sign Agreement" isActive={currentStep === 1} isCompleted={currentStep > 1} />
                            <OnboardingStep step={2} title="Upload Documents" isActive={currentStep === 2} isCompleted={currentStep > 2} />
                            <OnboardingStep step={3} title="Select Plan" isActive={currentStep === 3} isCompleted={currentStep > 3} />
                            <OnboardingStep step={4} title="Payment" isActive={currentStep === 4} isCompleted={currentStep > 4} />
                        </div>
                    </div>
                    <div className="md:col-span-3">
                        <Card className="min-h-[500px] flex flex-col">
                            <div className="flex-grow">
                                {currentStep === 1 && <AgreementStep />}
                                {currentStep === 2 && <DocumentsStep />}
                                {currentStep === 3 && <PlanStep />}
                                {currentStep === 4 && <PaymentStep />}
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                                {currentStep > 1 ? (
                                    <Button variant="outline" onClick={prevStep}><ChevronLeft size={16} className="mr-1" /> Back</Button>
                                ) : <div />}
                                
                                {currentStep < totalSteps && <Button onClick={nextStep}>Next <ChevronRight size={16} className="ml-1" /></Button>}
                                {currentStep === totalSteps && <Button onClick={finishOnboarding}>Complete Setup <CheckCircle size={16} className="ml-1" /></Button>}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AgreementStep = () => {
    const { settings } = useAppSettings();
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Step 1: Client Agreement</h3>
            <div className="p-4 border rounded-lg bg-slate-50 max-h-80 overflow-y-auto text-sm text-slate-600 space-y-2">
                <p>This Client Agreement ("Agreement") is made and entered into by and between you ("Client") and {settings.companyName} ("Company").</p>
                <p><strong>1. Services.</strong> Company agrees to provide credit repair services to Client as permitted by law. These services include evaluating Client's current credit reports as listed with the three major credit bureaus and assisting Client in identifying and disputing inaccurate or unverifiable information.</p>
                <p><strong>2. Client Obligations.</strong> Client agrees to provide all necessary documents and information to Company in a timely manner. This includes, but is not limited to, personal identification, proof of address, and credit reports.</p>
                <p>...</p>
                <p>(More legal text would follow here)</p>
            </div>
            <div className="mt-6 relative flex items-start">
                <div className="flex items-center h-5">
                    <input id="agreement" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="agreement" className="font-medium text-slate-700">I have read, understood, and agree to the terms of the Client Agreement.</label>
                </div>
            </div>
        </div>
    );
};

const DocumentsStep = () => (
    <div>
        <h3 className="text-lg font-semibold mb-4">Step 2: Upload Required Documents</h3>
        <div className="space-y-4">
            <p className="text-sm text-slate-500">Please upload a clear copy of the following documents. This is required to verify your identity with the credit bureaus.</p>
            <DocumentUploadBox title="Driver's License or State ID" />
            <DocumentUploadBox title="Proof of Address (e.g., Utility Bill)" />
        </div>
    </div>
);

const DocumentUploadBox: React.FC<{title: string}> = ({title}) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{title}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg">
            <div className="space-y-1 text-center">
                <UploadCloud size={40} className="mx-auto text-slate-400" />
                <div className="flex text-sm text-slate-600">
                    <label htmlFor={`file-upload-${title}`} className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id={`file-upload-${title}`} name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
            </div>
        </div>
    </div>
);

const PlanStep = () => {
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const plans = [
        { id: 'monthly', name: 'Monthly', price: 99, desc: 'Billed every month.' },
        { id: 'quarterly', name: 'Quarterly', price: 279, desc: 'Save $18. Billed every 3 months.' },
        { id: 'yearly', name: 'Yearly', price: 999, desc: 'Save $189. Billed once a year.' },
    ];
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">Step 3: Choose Your Subscription</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {plans.map(plan => (
                    <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer text-center ${selectedPlan === plan.id ? 'border-primary ring-2 ring-primary/30' : 'border-slate-300'}`}
                    >
                        <h4 className="font-bold">{plan.name}</h4>
                        <p className="text-2xl font-extrabold my-2">${plan.price}</p>
                        <p className="text-xs text-slate-500">{plan.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PaymentStep = () => (
    <div>
        <h3 className="text-lg font-semibold mb-4">Step 4: Payment Details</h3>
        <div className="space-y-4">
            <Input label="Name on Card" placeholder="John M Doe" />
            <Input label="Card Number" placeholder="**** **** **** 1234" icon={<CreditCard size={16} className="text-slate-400"/>} />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Expiration Date (MM/YY)" placeholder="MM/YY" />
                <Input label="CVC" placeholder="123" />
            </div>
        </div>
         <div className="mt-6 flex items-start p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
            <ShieldCheck size={24} className="text-green-500 mr-3 flex-shrink-0" />
            <p className="text-xs text-slate-500">Your payment is processed securely. We do not store your full card details on our servers.</p>
        </div>
    </div>
);

export default ClientOnboardingPage;
