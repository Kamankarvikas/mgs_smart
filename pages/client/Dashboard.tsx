import React from 'react';
import { Card } from '../../components/ui';
import { BarChart2, Briefcase, MessageSquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    Legend,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';
import { useTheme } from '../../App';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; linkTo: string; }> = ({ title, value, icon, linkTo }) => (
    <Card className="hover:shadow-lg transition-shadow">
        <Link to={linkTo} className="flex items-center">
            <div className="p-3 bg-primary-bg-active rounded-lg">{icon}</div>
            <div className="ml-4">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-semibold text-slate-800">{value}</p>
            </div>
        </Link>
    </Card>
);

const scoreTrendData = [
  { name: 'May', score: 620 },
  { name: 'Jun', score: 645 },
  { name: 'Jul', score: 640 },
  { name: 'Aug', score: 665 },
  { name: 'Sep', score: 675 },
  { name: 'Oct', score: 685 },
];

const disputeStatusData = [
  { name: 'Positive', value: 1 },
  { name: 'Investigating', value: 2 },
  { name: 'Submitted', value: 1 },
];

const COLORS = {
  Positive: '#22c55e', // green-500
  Investigating: '#f59e0b', // amber-500
  Submitted: '#3b82f6', // blue-500
};

const recentActivities = [
  { text: "Your dispute for 'Capital One' was updated to Positive.", time: "1 day ago" },
  { text: "You have a new message from your case manager.", time: "2 days ago" },
  { text: "Your credit scores have been updated.", time: "4 days ago" },
  { text: "A new invoice for your subscription has been generated.", time: "5 days ago" },
];

const ClientDashboardPage: React.FC = () => {
    const { theme } = useTheme();
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Client Dashboard</h1>
                <p className="text-slate-500">Welcome! Here's an overview of your credit repair journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Average Score" value="685" icon={<BarChart2 size={24} className="text-primary" />} linkTo="/client/scores" />
                <StatCard title="Active Disputes" value="4" icon={<Briefcase size={24} className="text-primary" />} linkTo="/client/disputes" />
                <StatCard title="Unread Messages" value="1" icon={<MessageSquare size={24} className="text-primary" />} linkTo="/client/messages" />
            </div>

            <Card title="Credit Score Trend">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <LineChart data={scoreTrendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} />
                            <YAxis domain={['dataMin - 20', 'dataMax + 20']} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '0.75rem',
                                }}
                            />
                            <Line type="monotone" dataKey="score" name="Credit Score" stroke={`rgb(${theme.colors.primary})`} strokeWidth={3} dot={{ r: 5, fill: `rgb(${theme.colors.primary})` }} activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card title="Dispute Status Overview">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={disputeStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {disputeStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card title="Recent Activity">
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <div key={index} className="flex items-center p-3 rounded-md hover:bg-slate-50">
                                 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Clock size={16} className="text-slate-500" />
                                </div>
                                <div className="ml-3 flex-1 flex justify-between items-center">
                                    <p className="text-sm text-slate-700">{activity.text}</p>
                                    <p className="text-xs text-slate-400">{activity.time}</p>
                                 </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ClientDashboardPage;