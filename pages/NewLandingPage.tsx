import React, { useState, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui';
import { Building2, Users, Bot, BarChart2, Briefcase, UploadCloud, FileCog, CheckCircle, Star, ChevronDown, Facebook, Twitter, Linkedin } from 'lucide-react';
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

const FeatureCard: React.FC<{ icon: React.ReactElement<SVGProps<SVGSVGElement>>; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200/80 transition-transform transform hover:-translate-y-2">
        <div className="inline-block p-4 bg-primary-bg-hover rounded-lg">
            {React.cloneElement(icon, { className: "h-8 w-8 text-primary" })}
        </div>
        <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-base text-slate-600">{description}</p>
    </div>
);


const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-slate-200 py-6">
            <dt>
                <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-start justify-between text-left text-slate-900 group">
                    <span className="text-base font-semibold leading-7 group-hover:text-primary transition-colors">{question}</span>
                    <span className="ml-6 flex h-7 items-center">
                       <ChevronDown className={`h-6 w-6 text-slate-400 group-hover:text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </span>
                </button>
            </dt>
            <div className={`grid overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <dd className="mt-2 pr-12 pt-2">
                        <p className="text-base leading-7 text-slate-600">{answer}</p>
                    </dd>
                </div>
            </div>
        </div>
    );
};


const NewLandingPage: React.FC = () => {
    const { settings } = useAppSettings();

    const faqs = [
      { question: "Is there a free trial available?", answer: `Yes, you can sign up and use ${settings.companyName} for 14 days completely free, with no credit card required. This gives you full access to all our features.` },
      { question: "What kind of support can I expect?", answer: "We offer 24/7 email support and dedicated account managers for our enterprise clients. Our extensive documentation and tutorials are also available to all users." },
      { question: "Can I import my existing client data?", answer: "Absolutely. Our onboarding process includes a simple data import tool that allows you to upload your existing client information via CSV files to get you started quickly." },
      { question: "Is my data secure?", answer: "Yes, security is our top priority. We use industry-standard encryption for all data at rest and in transit, and our platform is hosted on secure, compliant infrastructure." },
    ];
    
    const features = [
      { icon: <Users />, title: "Client Management", description: "A complete CRM to manage clients, track progress, and handle communications from a single dashboard." },
      { icon: <BarChart2 />, title: "Dispute Tracking", description: "Automate dispute letter creation and track every dispute across all three credit bureaus with our visual timeline." },
      { icon: <Bot />, title: "Letter Automation", description: "Generate professional dispute letters in seconds using our library of templates or create your own." },
      { icon: <Briefcase />, title: "Team Collaboration", description: "Manage your team, assign clients, and track performance to keep everyone on the same page." }
    ];

    return (
        <div className="bg-white">
            <Header />

            <main>
                {/* Hero Section */}
                <div className="relative isolate pt-20">
                    <div className="absolute inset-0 -z-10">
                        <img 
                            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop" 
                            alt="Modern office with team collaborating"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/60"></div>
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="container mx-auto px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                                    Empower Your Credit Repair Business
                                </h1>
                                <p className="mt-6 text-lg leading-8 text-slate-200">
                                    The all-in-one software designed to automate your workflow, manage clients effortlessly, and scale your operations.
                                </p>
                                <div className="mt-10 flex items-center justify-center gap-x-6">
                                    <Link to="/onboarding">
                                        <Button size="lg">Get Started Free</Button>
                                    </Link>
                                    <a href="#features">
                                        <Button size="lg" variant="outline" className="border-slate-300 text-white hover:bg-white/10">Learn More</Button>
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
                         <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-4">
                            {features.map(feature => (
                                <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
                            ))}
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
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-bg-hover text-primary">
                                    <UploadCloud size={24} />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-slate-900">1. Import Credit Reports</h3>
                                <p className="mt-2 text-base text-slate-600">Easily import credit reports from all major providers to get a complete view of your client's financial picture.</p>
                           </div>
                            <div className="flex flex-col items-center text-center p-8 border border-slate-200 rounded-xl shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-bg-hover text-primary">
                                    <FileCog size={24} />
                                </div>
                                <h3 className="mt-6 text-lg font-semibold text-slate-900">2. Create & Send Disputes</h3>
                                <p className="mt-2 text-base text-slate-600">Identify inaccuracies and generate dispute letters with our smart tools. Send them with just a few clicks.</p>
                           </div>
                            <div className="flex flex-col items-center text-center p-8 border border-slate-200 rounded-xl shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-bg-hover text-primary">
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

                {/* FAQ Section */}
                <div className="py-16 sm:py-20">
                    <div className="container mx-auto px-6 lg:px-8">
                        <SectionTitle
                            subtitle="Frequently Asked Questions"
                            title="Your Questions, Answered"
                            description="Have more questions? Reach out to our support team anytime."
                        />
                        <div className="mx-auto mt-16 max-w-4xl">
                            <dl className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
                                <div className="space-y-2">
                                    {faqs.slice(0, 2).map((faq, index) => (
                                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                                    ))}
                                </div>
                                <div className="space-y-2">
                                     {faqs.slice(2, 4).map((faq, index) => (
                                        <FAQItem key={index} question={faq.question} answer={faq.answer} />
                                    ))}
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div 
                    className="relative bg-cover bg-center bg-fixed"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')" }}
                >
                    <div className="absolute inset-0 bg-slate-900/70"></div>
                    <div className="relative container mx-auto px-6 py-16 sm:py-20 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                Ready to transform your credit repair business?
                            </h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-200">
                                Join hundreds of successful businesses who trust {settings.companyName} to automate their workflow and delight their clients.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link to="/onboarding">
                                    <Button size="lg">
                                        Get Started Free
                                    </Button>
                                </Link>
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
            <div className="container mx-auto px-6 pt-16 pb-8 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="space-y-8 lg:col-span-5">
                        <div className="flex items-center gap-2">
                            <Building2 size={32} className="text-white" />
                            <span className="text-2xl font-bold text-white">{settings.companyName}</span>
                        </div>
                        <p className="text-sm leading-6 text-slate-300">The ultimate platform for credit repair professionals.</p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-slate-400 hover:text-primary-light"><span className="sr-only">Facebook</span><Facebook /></a>
                            <a href="#" className="text-slate-400 hover:text-primary-light"><span className="sr-only">Twitter</span><Twitter /></a>
                            <a href="#" className="text-slate-400 hover:text-primary-light"><span className="sr-only">LinkedIn</span><Linkedin /></a>
                        </div>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 lg:col-span-7 lg:mt-0 md:grid-cols-4">
                        <div>
                            <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Client Management</a></li>
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Automation</a></li>
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Dispute Tracking</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Pricing</a></li>
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Documentation</a></li>
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Contact Us</a></li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">About</a></li>
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Blog</a></li>
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Careers</a></li>
                            </ul>
                        </div>
                         <div>
                            <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                            <ul role="list" className="mt-6 space-y-4">
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Privacy</a></li>
                                <li><a href="#" className="text-sm leading-6 text-slate-300 hover:text-primary-light">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                     <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex-1 w-full">
                            <h3 className="text-sm font-semibold leading-6 text-white">Subscribe to our newsletter</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-400">The latest news, articles, and resources, sent to your inbox weekly.</p>
                        </div>
                        <form className="w-full md:max-w-md flex-1">
                            <div className="flex gap-x-4">
                                <label htmlFor="email-address" className="sr-only">Email address</label>
                                <input id="email-address" name="email" type="email" autoComplete="email" required className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6" placeholder="Enter your email" />
                                <Button type="submit" className="flex-none">Subscribe</Button>
                            </div>
                        </form>
                    </div>
                    <p className="mt-8 text-xs leading-5 text-slate-400 text-center">&copy; 2024 {settings.companyName}, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};


export default NewLandingPage;