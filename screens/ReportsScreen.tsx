import React, { useState } from 'react';
import ReportsDashboard from '../components/reports/ReportsDashboard';
import SalesSummaryReport from '../components/reports/SalesSummaryReport';
import LowStockReport from '../components/reports/LowStockReport';
import ReportToolbar from '../components/reports/ReportToolbar';
import { SalesTransaction, Product, Category, Outlet } from '../types';

export type DateRange = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'all';

interface ReportsScreenProps {
    salesTransactions: SalesTransaction[];
    products: Product[];
    categories: Category[];
    outlets: Outlet[];
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ salesTransactions, products, categories, outlets }) => {
    const [activeReport, setActiveReport] = useState<string | null>(null);

    // Filters
    const [dateRange, setDateRange] = useState<DateRange>('last7days');
    const [selectedOutletId, setSelectedOutletId] = useState<number | 'all'>('all');

    const handleSelectReport = (reportKey: string) => {
        setActiveReport(reportKey);
    };

    const handleBackToDashboard = () => {
        setActiveReport(null);
    };

    const renderActiveReport = () => {
        switch (activeReport) {
            case 'sales_summary':
                return <SalesSummaryReport
                    transactions={salesTransactions}
                    categories={categories}
                    products={products}
                    filters={{ dateRange, outletId: selectedOutletId }}
                />;
            case 'low_stock':
                return <LowStockReport
                    products={products}
                    outlets={outlets}
                    filters={{ outletId: selectedOutletId }}
                />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 p-6 space-y-6">
            <div className="flex-shrink-0 flex justify-between items-center">
                <div className="flex items-center">
                    {activeReport && (
                        <button
                            onClick={handleBackToDashboard}
                            className="mr-4 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
                        >
                            &larr; Back
                        </button>
                    )}
                    <h1 className="text-3xl font-bold text-slate-800">
                        {activeReport ? 'Report Details' : 'Reports'}
                    </h1>
                </div>
                 <div className="flex items-center space-x-2">
                     {activeReport && (
                        <button className="flex items-center bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Export (PDF/CSV)
                        </button>
                     )}
                </div>
            </div>

            {activeReport ? (
                <>
                    <ReportToolbar
                        outlets={outlets}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        selectedOutletId={selectedOutletId}
                        setSelectedOutletId={setSelectedOutletId}
                    />
                    <div className="flex-1 overflow-y-auto">
                        {renderActiveReport()}
                    </div>
                </>
            ) : (
                <ReportsDashboard onSelectReport={handleSelectReport} />
            )}
        </div>
    );
};

export default ReportsScreen;
