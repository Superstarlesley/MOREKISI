import React from 'react';
import { BarChart, Package } from '../Icons';

interface ReportsDashboardProps {
  onSelectReport: (reportKey: string) => void;
}

const reportCategories = [
    {
        title: 'Sales Reports',
        icon: <BarChart className="h-8 w-8 text-brand-blue-500" />,
        reports: [
            { id: 'sales_summary', name: 'Sales Summary', description: 'Overall sales performance, revenue, and transaction volume.' },
            { id: 'sales_by_product', name: 'Sales by Product', description: 'Analyze top-selling products and categories.' },
            { id: 'payment_methods', name: 'Payment Methods', description: 'Breakdown of transactions by payment type.' },
        ]
    },
    {
        title: 'Inventory Reports',
        icon: <Package className="h-8 w-8 text-green-500" />,
        reports: [
            { id: 'low_stock', name: 'Low Stock Items', description: 'Identify products that are running low on stock.' },
            { id: 'stock_valuation', name: 'Stock Valuation', description: 'Calculate the total value of your current inventory.' },
            { id: 'stock_history', name: 'Stock Movement History', description: 'Track adjustments and changes for each product.' },
        ]
    }
];

const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ onSelectReport }) => {
  return (
    <div className="flex-1 overflow-y-auto">
        <div className="space-y-8">
            {reportCategories.map((category) => (
                <div key={category.title} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center mb-4">
                        <div className="mr-4 p-2 bg-slate-100 rounded-lg">{category.icon}</div>
                        <h2 className="text-xl font-bold text-slate-800">{category.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.reports.map(report => (
                            <button
                                key={report.id}
                                onClick={() => onSelectReport(report.id)}
                                className="p-4 border rounded-lg text-left hover:bg-slate-50 hover:border-brand-blue-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                            >
                                <h3 className="font-semibold text-slate-700">{report.name}</h3>
                                <p className="text-sm text-slate-500 mt-1">{report.description}</p>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};

export default ReportsDashboard;
