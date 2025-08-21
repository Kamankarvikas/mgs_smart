import React from 'react';
import { Card } from '../../components/ui';
import { Building, Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../App';

const chartData = [
  { name: 'Jan', signups: 2 },
  { name: 'Feb', signups: 5 },
  { name: 'Mar', signups: 8 },
  { name: 'Apr', signups: 12 },
  { name: 'May', signups: 15 },
  { name: 'Jun', signups: 20 },
];

const recentActivities = [
  { text: "New business 'Credit Pros' subscribed to the Pro plan.", time: "2m ago" },
  { text: "'FixItCredit' upgraded their plan from Basic to Pro.", time: "1h ago" },
  { text: "New business 'Score Boosters' started a 14-day trial.", time: "4h ago" },
  { text: "Monthly revenue report for October has been generated.", time: "1d ago" },
];

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change?: string }> = ({ title, value, icon, change }) => (
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
        {change && (
            <div className="mt-4 flex items-center text-sm">
                <span className="flex items-center text-green-600">
                    <TrendingUp size={16} className="mr-1" />
                    {change}
                </span>
                <span className="ml-1 text-slate-500">vs last month</span>
            </div>
        )}
    </Card>
);

const SuperAdminDashboard: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
                <p className="text-slate-500">Platform-wide overview and metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Businesses" value="78" icon={<Building size={24} className="text-primary" />} change="+5" />
                <StatCard title="Active Subscriptions" value="65" icon={<Users size={24} className="text-primary" />} change="+3" />
                <StatCard title="Monthly Recurring Revenue" value="$12,850" icon={<DollarSign size={24} className="text-primary" />} change="+$1,200" />
                <StatCard title="Businesses on Trial" value="13" icon={<Clock size={24} className="text-primary" />} />
            </div>

            <Card title="New Business Sign-ups">
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
                            <Bar dataKey="signups" fill={`rgb(${theme.colors.primary})`} name="New Sign-ups" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card title="Recent Platform Activity">
                <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-start">
                             <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <Building size={18} className="text-slate-500" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-slate-700">{activity.text}</p>
                                <p className="text-xs text-slate-400">{activity.time}</p>
                             </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default SuperAdminDashboard;
