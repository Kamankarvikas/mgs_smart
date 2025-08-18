import React, { useState } from 'react';
import { Card, Button } from '../components/ui';
import { 
    TrendingUp, Users, FileText, PlusCircle, DollarSign, 
    UserPlus, FileCheck2, Lightbulb, Mail, Phone, Briefcase 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ComprehensiveClientModal } from './Clients';
import { Client } from '../types';
import { useTheme } from '../App';

const chartData = [
  { name: 'Jan', clients: 4, leads: 12 },
  { name: 'Feb', clients: 3, leads: 19 },
  { name: 'Mar', clients: 5, leads: 15 },
  { name: 'Apr', clients: 8, leads: 25 },
  { name: 'May', clients: 7, leads: 22 },
  { name: 'Jun', clients: 10, leads: 30 },
];

const recentActivities = [
  { icon: <UserPlus size={18} className="text-green-500" />, text: "New client 'John D.' was successfully onboarded.", time: "2m ago" },
  { icon: <FileCheck2 size={18} className="text-blue-500" />, text: "Dispute for 'Capital One' updated to Positive.", time: "1h ago" },
  { icon: <Lightbulb size={18} className="text-yellow-500" />, text: "New lead 'Jane S.' was assigned to you.", time: "4h ago" },
  { icon: <Mail size={18} className="text-purple-500" />, text: "Round 2 letters sent for client 'Mike R.'.", time: "1d ago" },
];

const upcomingTasks = [
  { icon: <Phone size={18} className="text-blue-500" />, text: "Follow up with lead 'Sarah K.' about her documents.", time: "Today" },
  { icon: <Briefcase size={18} className="text-purple-500" />, text: "Prepare Round 3 dispute letters for 'John D.'.", time: "Tomorrow" },
  { icon: <Users size={18} className="text-green-500" />, text: "Client meeting with 'Emily W.' to review progress.", time: "Oct 29" },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change: string; changeType: 'increase' | 'decrease' }> = ({ title, value, icon, change, changeType }) => (
    <Card>
        <div className="flex items-center">
            <div className="p-3 bg-primary-bg-active rounded-lg">
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-semibold text-slate-800">{value}</p>
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className={`flex items-center ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp size={16} className={`mr-1 ${changeType === 'decrease' ? 'transform rotate-180' : ''}`} />
                {change}
            </span>
            <span className="ml-1 text-slate-500">vs last month</span>
        </div>
    </Card>
);

const DashboardPage: React.FC = () => {
    const [isClientModalOpen, setIsClientModalOpen] = useState(false);
    const { theme } = useTheme();

    // This is a placeholder. In a real app, this would be connected to a global state.
    const handleSaveClient = (clientData: Client) => {
        console.log("Saving client from dashboard:", clientData);
        setIsClientModalOpen(false); 
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Welcome Back, Admin!</h1>
                    <p className="text-slate-500">Here's a snapshot of your business today.</p>
                </div>
                <Button onClick={() => setIsClientModalOpen(true)}>
                    <PlusCircle size={18} className="mr-2" />
                    Add Client
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="New Clients" value="32" icon={<Users size={24} className="text-primary" />} change="+12.5%" changeType="increase" />
                <StatCard title="Active Disputes" value="128" icon={<FileText size={24} className="text-primary" />} change="-2.1%" changeType="decrease" />
                <StatCard title="Positive Outcomes" value="89%" icon={<TrendingUp size={24} className="text-primary" />} change="+5.3%" changeType="increase" />
                <StatCard title="Monthly Revenue" value="$4,250" icon={<DollarSign size={24} className="text-primary" />} change="+8.1%" changeType="increase" />
            </div>

            <Card title="Client & Lead Growth">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.75rem',
                                }}
                            />
                            <Legend iconType="circle" />
                            <Bar dataKey="clients" fill={`rgb(${theme.colors.primary})`} name="New Clients" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="leads" fill={`rgb(${theme.colors.primaryLight})`} name="New Leads" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Recent Activity">
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    {activity.icon}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-slate-700">{activity.text}</p>
                                    <p className="text-xs text-slate-400">{activity.time}</p>
                                 </div>
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Upcoming Tasks">
                     <div className="space-y-4">
                        {upcomingTasks.map((task, index) => (
                            <div key={index} className="flex items-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    {task.icon}
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-slate-700">{task.text}</p>
                                    <p className="text-xs text-slate-400 font-medium">{task.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
             <ComprehensiveClientModal 
                isOpen={isClientModalOpen} 
                onClose={() => setIsClientModalOpen(false)} 
                client={null} 
                onSave={handleSaveClient} 
            />
        </div>
    );
};

export default DashboardPage;