import React, { useMemo } from 'react';
import { SalesTransaction, Category, Product } from '../../types';
import { DateRange } from '../../screens/ReportsScreen';

interface SalesSummaryReportProps {
    transactions: SalesTransaction[];
    categories: Category[];
    products: Product[];
    filters: {
        dateRange: DateRange;
        outletId: number | 'all';
    };
}

const getDateFilteredTransactions = (transactions: SalesTransaction[], dateRange: DateRange) => {
    const now = new Date();
    let startDate = new Date();

    switch (dateRange) {
        case 'today':
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'yesterday':
            startDate.setDate(now.getDate() - 1);
            startDate.setHours(0, 0, 0, 0);
            now.setDate(now.getDate() - 1);
            now.setHours(23, 59, 59, 999);
            break;
        case 'last7days':
            startDate.setDate(now.getDate() - 7);
            break;
        case 'last30days':
            startDate.setDate(now.getDate() - 30);
            break;
        case 'all':
            return transactions;
        default:
            return transactions;
    }
    
    return transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= now;
    });
};

const SalesSummaryReport: React.FC<SalesSummaryReportProps> = ({ transactions, categories, products, filters }) => {
    
    const filteredTransactions = useMemo(() => {
        let filtered = getDateFilteredTransactions(transactions, filters.dateRange);
        if (filters.outletId !== 'all') {
            filtered = filtered.filter(t => t.outletId === filters.outletId);
        }
        return filtered;
    }, [transactions, filters]);

    const summaryStats = useMemo(() => {
        const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
        const transactionCount = filteredTransactions.length;
        const avgTransactionValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;
        return { totalRevenue, transactionCount, avgTransactionValue };
    }, [filteredTransactions]);
    
    const salesByCategory = useMemo(() => {
        const categoryMap = new Map<number, { name: string, total: number }>();
        categories.forEach(c => categoryMap.set(c.id, { name: c.name, total: 0 }));

        filteredTransactions.forEach(t => {
            t.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product && categoryMap.has(product.categoryId)) {
                    const category = categoryMap.get(product.categoryId)!;
                    category.total += item.price * item.quantity;
                    categoryMap.set(product.categoryId, category);
                }
            });
        });
        return Array.from(categoryMap.values()).filter(c => c.total > 0).sort((a,b) => b.total - a.total);
    }, [filteredTransactions, products, categories]);

    const maxCategorySale = Math.max(...salesByCategory.map(c => c.total), 0);
    
    if (filteredTransactions.length === 0) {
        return (
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                <h2 className="text-xl font-bold text-slate-700 mb-1">Sales Summary</h2>
                <p className="text-slate-500">No sales data found for the selected period.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
             <h2 className="text-xl font-bold text-slate-700">Sales Summary</h2>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-slate-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-slate-800">P {summaryStats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-slate-500">Total Transactions</p>
                    <p className="text-2xl font-bold text-slate-800">{summaryStats.transactionCount}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <p className="text-sm text-slate-500">Avg. Transaction Value</p>
                    <p className="text-2xl font-bold text-slate-800">P {summaryStats.avgTransactionValue.toFixed(2)}</p>
                </div>
            </div>

            {/* Data breakdown */}
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow-sm border">
                    <h3 className="font-semibold text-slate-700 mb-2">Sales by Category</h3>
                     <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-4 py-2">Category</th>
                                <th className="px-4 py-2 text-right">Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salesByCategory.map(cat => (
                                <tr key={cat.name} className="border-b">
                                    <td className="px-4 py-2 font-medium text-slate-800">{cat.name}</td>
                                    <td className="px-4 py-2 text-right font-semibold">P {cat.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm border">
                     <h3 className="font-semibold text-slate-700 mb-4">Category Performance</h3>
                     <div className="space-y-3">
                        {salesByCategory.map(cat => (
                             <div key={cat.name} className="flex items-center">
                                <span className="w-28 text-sm text-slate-600 truncate">{cat.name}</span>
                                <div className="flex-1 bg-slate-200 rounded-full h-4 mx-2">
                                    <div 
                                        className="bg-brand-blue-500 h-4 rounded-full" 
                                        style={{ width: `${maxCategorySale > 0 ? (cat.total / maxCategorySale) * 100 : 0}%`}}
                                    ></div>
                                </div>
                                <span className="w-20 text-sm font-semibold text-right">P {cat.total.toFixed(2)}</span>
                            </div>
                        ))}
                     </div>
                </div>
             </div>
        </div>
    );
};

export default SalesSummaryReport;
