import React from 'react';
import { Outlet } from '../../types';
import { DateRange } from '../../screens/ReportsScreen';

interface ReportToolbarProps {
    outlets: Outlet[];
    dateRange: DateRange;
    setDateRange: (value: DateRange) => void;
    selectedOutletId: number | 'all';
    setSelectedOutletId: (value: number | 'all') => void;
}

const ReportToolbar: React.FC<ReportToolbarProps> = ({
    outlets,
    dateRange,
    setDateRange,
    selectedOutletId,
    setSelectedOutletId,
}) => {
    return (
        <div className="flex-shrink-0 flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            <div>
                <label htmlFor="dateRange" className="text-sm font-medium text-slate-600 mr-2">Date Range:</label>
                <select
                    id="dateRange"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as DateRange)}
                    className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700"
                >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                    <option value="all">All Time</option>
                </select>
            </div>
            <div>
                 <label htmlFor="outlet" className="text-sm font-medium text-slate-600 mr-2">Outlet:</label>
                 <select
                    id="outlet"
                    value={selectedOutletId}
                    onChange={(e) => setSelectedOutletId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700"
                    disabled={outlets.length === 0}
                >
                    <option value="all">All Outlets</option>
                    {outlets.map(outlet => <option key={outlet.id} value={outlet.id}>{outlet.name}</option>)}
                </select>
            </div>
        </div>
    );
};

export default ReportToolbar;
