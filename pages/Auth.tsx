import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { Building2, Mail, Lock, CheckCircle, ArrowRight, User, Phone, Globe, Hash, Home, Calendar, ShieldCheck, UploadCloud, ChevronRight, ChevronLeft, Bot, BarChart2, FileText, Users, Quote, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../App';
import { Card, Input, Button } from '../components/ui';

// Login Page Component
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Building2 size={40} className="text-primary mb-2" />
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <p className="text-slate-500">Sign in to manage your business.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <Input id="email" type="email" label="Email" placeholder="you@example.com" icon={<Mail size={16} className="text-slate-400" />} defaultValue="admin@mgssmartcredit.com" />
          <Input id="password" type="password" label="Password" placeholder="••••••••" icon={<Lock size={16} className="text-slate-400" />} defaultValue="password" />
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-primary-dark">Forgot your password?</a>
            </div>
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Not a member? <Link to="/onboarding" className="font-medium text-primary hover:text-primary-dark">Start your free trial</Link>
        </p>
      </Card>
       <div className="mt-6 text-center">
        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary flex items-center justify-center group">
          <ArrowLeft size={16} className="mr-1 transition-transform group-hover:-translate-x-1" />
          Back to Home Page
        </Link>
      </div>
    </div>
  );
};


// Onboarding Page Component
const OnboardingStep: React.FC<{ step: number; title: string; description: string; isActive: boolean; isCompleted: boolean }> = ({ step, title, description, isActive, isCompleted }) => (
    <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${isActive ? 'bg-primary text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
            {isCompleted ? <CheckCircle size={24} /> : step}
        </div>
        <div>
            <h3 className={`font-semibold ${isActive ? 'text-primary' : 'text-slate-800'}`}>{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

export const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 4;

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
    const finishOnboarding = () => {
        // Here you would typically submit the form data
        navigate('/login');
    };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Setup Your Account</h1>
            <p className="text-slate-500 mt-1">Complete the following steps to get your business ready.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="space-y-6">
                <OnboardingStep step={1} title="Create Account" description="Set your login details." isActive={currentStep === 1} isCompleted={currentStep > 1} />
                <OnboardingStep step={2} title="Company Info" description="Tell us about your business." isActive={currentStep === 2} isCompleted={currentStep > 2} />
                <OnboardingStep step={3} title="Owner Info" description="Provide personal details." isActive={currentStep === 3} isCompleted={currentStep > 3} />
                <OnboardingStep step={4} title="Compliance" description="Complete necessary legal steps." isActive={currentStep === 4} isCompleted={currentStep > 4} />
            </div>
          </div>
          <div className="md:col-span-2">
            <Card className="min-h-[500px] flex flex-col">
                <div className="flex-grow">
              {currentStep === 1 && <CreateAccountStep />}
              {currentStep === 2 && <CompanyInfoStep />}
              {currentStep === 3 && <OwnerInfoStep />}
              {currentStep === 4 && <ComplianceStep />}
                </div>
              <div className="mt-6 pt-6 border-t border-slate-200 flex justify-between items-center">
                {currentStep > 1 ? (
                   <Button variant="outline" onClick={prevStep}><ChevronLeft size={16} className="mr-1" /> Back</Button>
                ) : <div />}
                
                {currentStep < totalSteps && <Button onClick={nextStep}>Next Step <ChevronRight size={16} className="ml-1" /></Button>}
                {currentStep === totalSteps && <Button onClick={finishOnboarding}>Finish Setup <CheckCircle size={16} className="ml-1" /></Button>}
              </div>
            </Card>
          </div>
        </div>
         <div className="mt-6 text-center">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary flex items-center justify-center group">
            <ArrowLeft size={16} className="mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
};

const CreateAccountStep: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold mb-4">Step 1: Create Your Account</h3>
        <div className="space-y-4">
            <Input label="Email Address" type="email" placeholder="you@example.com" icon={<Mail size={16} className="text-slate-400" />} />
            <Input label="Password" type="password" placeholder="••••••••" icon={<Lock size={16} className="text-slate-400" />} />
            <Input label="Confirm Password" type="password" placeholder="••••••••" icon={<Lock size={16} className="text-slate-400" />} />
        </div>
    </div>
);

const CompanyInfoStep: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold mb-4">Step 2: Company Information</h3>
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center">
                    <UploadCloud size={32} className="text-slate-400" />
                </div>
                <Button variant="outline">Upload Logo</Button>
            </div>
            <Input label="Business Name" placeholder="Your Company LLC" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Business Email" type="email" placeholder="contact@company.com" />
                <Input label="Business Phone" type="tel" placeholder="(555) 123-4567" />
            </div>
            <Input label="Website" placeholder="https://company.com" />
            <Input label="Address" placeholder="123 Main St, Anytown, USA" />
            <Input label="EIN" placeholder="12-3456789" />
        </div>
    </div>
);

const OwnerInfoStep: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold mb-4">Step 3: Owner Information</h3>
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
            </div>
            <Input label="Email" type="email" placeholder="john.doe@email.com" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Date of Birth" type="date" />
                <Input label="SSN" placeholder="•••-••-••••" />
            </div>
            <Input label="Address" placeholder="456 Oak Ave, Anytown, USA" />
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Upload ID Document</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                        <UploadCloud size={40} className="mx-auto text-slate-400" />
                        <div className="flex text-sm text-slate-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ComplianceStep: React.FC = () => (
    <div>
        <h3 className="text-lg font-semibold mb-4">Step 4: Compliance</h3>
        <div className="space-y-6">
            <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input id="croa" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="croa" className="font-medium text-slate-700">CROA Compliance</label>
                    <p className="text-slate-500">I acknowledge and agree to comply with the Credit Repair Organizations Act.</p>
                </div>
            </div>
            <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input id="esign" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="esign" className="font-medium text-slate-700">E-Signature Agreement</label>
                    <p className="text-slate-500">I agree to use electronic signatures for all documents.</p>
                </div>
            </div>
            <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input id="licensing" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="licensing" className="font-medium text-slate-700">State-Specific Licensing</label>
                    <p className="text-slate-500">I have obtained all necessary licenses required by my state.</p>
                </div>
            </div>
             <div className="relative flex items-start">
                <div className="flex items-center h-5">
                    <input id="reminders" type="checkbox" className="focus:ring-primary h-4 w-4 text-primary border-slate-300 rounded" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="reminders" className="font-medium text-slate-700">Document Expiry Reminders</label>
                    <p className="text-slate-500">Enable email reminders for expiring compliance documents.</p>
                </div>
            </div>
        </div>
    </div>
);