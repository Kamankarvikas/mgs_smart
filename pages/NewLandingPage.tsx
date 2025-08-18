import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Building2, Users, Bot, BarChart2, Briefcase, UploadCloud, FileCog, CheckCircle, Zap, ShieldCheck, Star, ChevronDown, ChevronUp, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useAppSettings } from '../App';

const Header: React.FC = () => {
    const { settings } = useAppSettings();
    return (
        <header className="absolute inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="container mx-auto px-6 lg:px-8">
                <nav className="flex items-center justify-between h-20" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <Link to="/" className="-m-1.5 p-1.5 flex items-center gap-2">
                            <Building2 size={28} className="text-primary" />
                            <span className="text-xl font-bold text-primary">{settings.companyName}</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <Link to="/login">
                            <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link to="/onboarding">
                            <Button>Sign Up</Button>
                        </Link>
                    </div>
                </nav>
            </div>
        </header>
    );
};

const SectionTitle: React.FC<{ subtitle: string, title: string, description: string }> = ({ subtitle, title, description }) => (
    <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-base font-semibold leading-7 text-primary">{subtitle}</h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</p>
        <p className="mt-6 text-lg leading-8 text-slate-600">{description}</p>
    </div>
);

const NewLandingPage: React.FC = () => {
    const { settings } = useAppSettings();
    return (
        <div className="bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <div className="relative isolate pt-20">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="container mx-auto px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                                    Empower Your Credit Repair Business
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-slate-600">
                                    The all-in-one software designed to automate your workflow, manage clients effortlessly, and scale your operations.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link to="/onboarding">
                                        <Button size="lg">Get Started Free</Button>
                                    </Link>
                                    <a href="#features">
                                        <Button size="lg" variant="outline">Learn More</Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-16 sm:py-20 bg-slate-50">
                    <div className="container mx-auto px-6 lg:px-8">
                        <SectionTitle
                            subtitle="Core Features"
                            title="Everything You Need to Succeed"
                            description="Our platform is packed with powerful features to streamline every aspect of your credit repair business."
                        />
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-slate-900">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                            <Users className="h-6 w-6 text-white" />
                                        </div>
                                        Client Management
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-slate-600">A complete CRM to manage clients, track progress, and handle communications from a single dashboard.</dd>
                                </div>
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-slate-900">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                            <BarChart2 className="h-6 w-6 text-white" />
                                        </div>
                                        Dispute Tracking
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-slate-600">Automate dispute letter creation and track every dispute across all three credit bureaus with our visual timeline.</dd>
                                </div>
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-slate-900">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                            <Bot className="h-6 w-6 text-white" />
                                        </div>
                                        Letter Automation
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-slate-600">Generate professional dispute letters in seconds using our library of templates or create your own.</dd>
                                </div>
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-slate-900">
                                        <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                            <Briefcase className="h-6 w-6 text-white" />
                                        </div>
                                        Team Collaboration
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-slate-600">Manage your team, assign clients, and track performance to keep everyone on the same page.</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="py-16 sm:py-20">
                     <div className="container mx-auto px-6 lg:px-8">
                        <SectionTitle
                            subtitle="Get Started"
                            title="A Simple, Powerful Workflow"
                            description="Launch your operations in three simple steps and start seeing results faster."
                        />
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                           <div className="flex flex-col items-center text-center p-8 border border-slate-200 rounded-xl shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-primary">
                                    <UploadCloud size={24} />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-slate-900">1. Import Credit Reports</h3>
                                <p className="mt-2 text-base text-slate-600">Easily import credit reports from all major providers to get a complete view of your client's financial picture.</p>
                           </div>
                            <div className="flex flex-col items-center text-center p-8 border border-slate-200 rounded-xl shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-primary">
                                    <FileCog size={24} />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-slate-900">2. Create & Send Disputes</h3>
                                <p className="mt-2 text-base text-slate-600">Identify inaccuracies and generate dispute letters with our smart tools. Send them with just a few clicks.</p>
                           </div>
                            <div className="flex flex-col items-center text-center p-8 border border-slate-200 rounded-xl shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-primary">
                                    <CheckCircle size={24} />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-slate-900">3. Track & Report Results</h3>
                                <p className="mt-2 text-base text-slate-600">Monitor dispute progress, celebrate positive outcomes, and keep your clients informed with automated updates.</p>
                           </div>
                        </div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="bg-slate-50 py-16 sm:py-20">
                    <div className="container mx-auto px-6 lg:px-8">
                        <SectionTitle
                            subtitle="Social Proof"
                            title="Trusted by Top Credit Repair Companies"
                            description={`See how ${settings.companyName} is helping businesses like yours save time and achieve better results for their clients.`}
                        />
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                             <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm">
                                <div className="flex text-yellow-400"> <Star size={20} /> <Star size={20} /> <Star size={20} /> <Star size={20} /> <Star size={20} /> </div>
                                <blockquote className="mt-4 text-lg leading-8 text-slate-700">
                                    <p>{`“Switching to ${settings.companyName} was a game-changer. Our efficiency has doubled, and our clients are happier than ever. The automation is simply brilliant.”`}</p>
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-x-4">
                                    <img className="h-10 w-10 rounded-full bg-slate-50" src="https://i.pravatar.cc/150?u=jane" alt="" />
                                    <div>
                                        <div className="font-semibold text-slate-900">Jane Cooper</div>
                                        <div className="text-slate-600">CEO, BoostCredit</div>
                                    </div>
                                </figcaption>
                            </div>
                             <div className="flex flex-col rounded-2xl bg-white p-8 shadow-sm">
                                <div className="flex text-yellow-400"> <Star size={20} /> <Star size={20} /> <Star size={20} /> <Star size={20} /> <Star size={20} /> </div>
                                <blockquote className="mt-4 text-lg leading-8 text-slate-700">
                                    <p>{`“The best part about ${settings.companyName} is the intuitive interface and the amazing support team. It’s powerful without being complicated.”`}</p>
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-x-4">
                                    <img className="h-10 w-10 rounded-full bg-slate-50" src="https://i.pravatar.cc/150?u=mark" alt="" />
                                    <div>
                                        <div className="font-semibold text-slate-900">Mark Thompson</div>
                                        <div className="text-slate-600">Founder, Clear Path Financial</div>
                                    </div>
                                </figcaption>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    );
};


const Footer: React.FC = () => {
    const { settings } = useAppSettings();
    return (
        <footer className="bg-slate-900" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="container mx-auto px-6 py-12 lg:px-8">
                 <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                     <div className="space-y-8">
                         <div className="flex items-center gap-2">
                             <Building2 size={32} className="text-white" />
                             <span className="text-2xl font-bold text-white">{settings.companyName}</span>
                         </div>
                         <p className="text-sm leading-6 text-slate-300">The ultimate platform for credit repair professionals.</p>
                         <div className="flex space-x-6">
                             <a href="#" className="text-slate-400 hover:text-white"><span className="sr-only">Facebook</span><Facebook /></a>
                             <a href="#" className="text-slate-400 hover:text-white"><span className="sr-only">Twitter</span><Twitter /></a>
                             <a href="#" className="text-slate-400 hover:text-white"><span className="sr-only">LinkedIn</span><Linkedin /></a>
                         </div>
                     </div>
                     <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                 <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">Client Management</a></li>
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">Automation</a></li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                 <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">Pricing</a></li>
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">Documentation</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                 <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">About</a></li>
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">Blog</a></li>
                                </ul>
                            </div>
                             <div className="mt-10 md:mt-0">
                                 <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">Privacy</a></li>
                                     <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-white">Terms</a></li>
                                </ul>
                            </div>
                        </div>
                     </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-slate-400">&copy; 2024 {settings.companyName}, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};


export default NewLandingPage;
