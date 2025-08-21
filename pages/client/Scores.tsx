import React, { useState } from 'react';
import { Card, Button } from '../../components/ui';

const mockInitialCreditReportData = {
  equifax: { score: 680, accounts: [ { id: 'EQA1', name: 'Capital One Visa', type: 'Credit Card', balance: '$1,200', status: 'OK', opened: '2020-01-15' }, { id: 'EQA3', name: 'LVNV Funding LLC', type: 'Collection', balance: '$540', status: 'Negative', opened: '2022-03-10' } ] },
  transunion: { score: 750, accounts: [ { id: 'TUA2', name: 'Incorrect Account', type: 'Unknown', balance: '$2,150', status: 'Negative', opened: '2022-11-05' }, { id: 'TUA3', name: 'Amex Gold', type: 'Revolving', balance: '$3,400', status: 'OK', opened: '2018-02-11' } ] },
  experian: { score: 520, accounts: [ { id: 'EXA3', name: 'Midland Funding', type: 'Collection', balance: '$880', status: 'Negative', opened: '2021-12-01' } ] },
};

const CreditScoreMeter: React.FC<{ score: number }> = ({ score }) => {
    const getScoreData = (s: number) => {
        if (s >= 800) return { rating: 'Excellent', color: 'text-green-500', stroke: 'stroke-green-500' };
        if (s >= 740) return { rating: 'Very Good', color: 'text-teal-500', stroke: 'stroke-teal-500' };
        if (s >= 670) return { rating: 'Good', color: 'text-primary', stroke: 'stroke-primary' };
        if (s >= 580) return { rating: 'Fair', color: 'text-yellow-500', stroke: 'stroke-yellow-500' };
        return { rating: 'Poor', color: 'text-red-500', stroke: 'stroke-red-500' };
    };

    const scoreData = getScoreData(score);
    const sqSize = 200;
    const strokeWidth = 20;
    const radius = (sqSize - strokeWidth) / 2;
    const viewBox = `0 0 ${sqSize} ${sqSize}`;
    const dashArray = radius * Math.PI * 2;
    
    const scoreRange = 550; // 850 - 300
    const clampedScore = Math.max(300, Math.min(850, score));
    const percentage = (clampedScore - 300) / scoreRange;
    
    const arcLength = dashArray * 0.75;
    const dashOffset = arcLength * (1 - percentage);

    return (
        <div className="relative w-52 h-52 flex items-center justify-center">
            <svg width={sqSize} height={sqSize} viewBox={viewBox} className="transform rotate-[135deg]">
                <circle className="stroke-slate-200" cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`} fill="none" strokeDasharray={arcLength} strokeLinecap="round" />
                <circle className={`${scoreData.stroke} transition-all duration-1000 ease-in-out`} cx={sqSize / 2} cy={sqSize / 2} r={radius} strokeWidth={`${strokeWidth}px`} fill="none" strokeDasharray={arcLength} strokeDashoffset={dashOffset} strokeLinecap="round" />
            </svg>
            <div className="absolute text-center">
                <span className={`text-5xl font-bold ${scoreData.color}`}>{score}</span>
                <p className="text-lg font-semibold text-slate-600">{scoreData.rating}</p>
            </div>
        </div>
    );
};


const ClientScoresPage: React.FC = () => {
    const [reportData] = useState(mockInitialCreditReportData);
    const [activeBureau, setActiveBureau] = useState<keyof typeof mockInitialCreditReportData>('equifax');
    const report = reportData[activeBureau];
    const AccountStatusBadge: React.FC<{ status: 'OK' | 'Negative' | 'Closed' }> = ({ status }) => { const classes = { OK: 'bg-green-100 text-green-800', Negative: 'bg-red-100 text-red-800', Closed: 'bg-slate-100 text-slate-800' }; return <span className={`px-2 py-1 text-xs font-medium rounded-full ${classes[status]}`}>{status}</span>; };
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Credit Scores & Report</h1>
                <p className="text-slate-500">Here is a detailed breakdown of your credit report from each bureau.</p>
            </div>
            <Card noPadding>
                <div className="flex border-b border-slate-200">
                    {(['equifax', 'transunion', 'experian'] as const).map(bureau => (<button key={bureau} onClick={() => setActiveBureau(bureau)} className={`py-3 px-6 font-medium text-sm transition-colors capitalize ${activeBureau === bureau ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:bg-slate-50'}`}>{bureau}</button>))}
                </div>
                <div className="p-6">
                    <div className="mb-8 flex flex-col items-center justify-center"><h3 className="text-lg font-semibold text-slate-700 mb-2 capitalize">{activeBureau} Score</h3><CreditScoreMeter score={report.score} /></div>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-lg font-semibold mb-2">Accounts</h4>
                            <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-slate-50"><tr><th className="p-3 text-left font-medium text-slate-600">Account</th><th className="p-3 text-left font-medium text-slate-600">Balance</th><th className="p-3 text-left font-medium text-slate-600">Status</th><th className="p-3 text-left font-medium text-slate-600">Opened</th></tr></thead>
                                    <tbody>{report.accounts.map(acc => (<tr key={acc.id} className="border-t border-slate-200/80"><td className="p-3 font-medium">{acc.name}</td><td className="p-3 text-slate-600">{acc.balance}</td><td className="p-3"><AccountStatusBadge status={acc.status as any} /></td><td className="p-3 text-slate-600">{acc.opened}</td></tr>))}</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ClientScoresPage;
