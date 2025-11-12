import React, { useState, useMemo } from 'react';
import { CashflowTransaction, Outlet } from '../types';
import { DateRange } from './ReportsScreen'; // Re-using type from reports
import { PlusIcon } from '../components/Icons';
import CashflowTransactionModal from '../components/CashflowTransactionModal';

const getDateFilteredTransactions = (transactions: CashflowTransaction[], dateRange: DateRange) => {
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
            startDate.setDate(now.getDate() - 6);
            startDate.setHours(0,0,0,0);
            break;
        case 'last30days':
            startDate.setDate(now.getDate() - 29);
             startDate.setHours(0,0,0,0);
            break;
        case 'all':
            return { inPeriod: transactions, beforePeriod: [] };
    }
    
    const inPeriod: CashflowTransaction[] = [];
    const beforePeriod: CashflowTransaction[] = [];

    transactions.forEach(t => {
        const transactionDate = new Date(t.dateTime);
        if (transactionDate >= startDate && transactionDate <= now) {
            inPeriod.push(t);
        } else if (transactionDate < startDate) {
            beforePeriod.push(t);
        }
    });

    return { inPeriod, beforePeriod };
};

interface CashFlowScreenProps {
    cashflowTransactions: CashflowTransaction[];
    setCashflowTransactions: React.Dispatch<React.SetStateAction<CashflowTransaction[]>>;
    outlets: Outlet[];
}

const CashFlowScreen: React.FC<CashFlowScreenProps> = ({ cashflowTransactions, setCashflowTransactions, outlets }) => {
    // Filters
    const [dateRange, setDateRange] = useState<DateRange>('last7days');
    const [selectedOutletId, setSelectedOutletId] = useState<number | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | 'Cash In' | 'Cash Out'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);

    const summaryData = useMemo(() => {
        const outletFiltered = selectedOutletId === 'all'
            ? cashflowTransactions
            : cashflowTransactions.filter(t => t.outletId === selectedOutletId);

        const { inPeriod, beforePeriod } = getDateFilteredTransactions(outletFiltered, dateRange);

        const openingBalance = beforePeriod.reduce((acc, t) => {
            return acc + (t.type === 'Cash In' ? t.amount : -t.amount);
        }, 0);
        
        const transactionsToDisplay = inPeriod.filter(t => typeFilter === 'all' || t.type === typeFilter);

        const totalIn = transactionsToDisplay.reduce((acc, t) => (t.type === 'Cash In' ? acc + t.amount : acc), 0);
        const totalOut = transactionsToDisplay.reduce((acc, t) => (t.type === 'Cash Out' ? acc + t.amount : acc), 0);
        const netFlow = totalIn - totalOut;
        const closingBalance = openingBalance + netFlow;
        
        // Sort for ledger view
        transactionsToDisplay.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

        return { openingBalance, totalIn, totalOut, netFlow, closingBalance, transactionsToDisplay };

    }, [cashflowTransactions, dateRange, selectedOutletId, typeFilter]);

    const transactionsWithRunningBalance = useMemo(() => {
        let runningBalance = summaryData.openingBalance;
        // The transactions are sorted descending, so we need to reverse for calculation and then reverse back
        const reversed = [...summaryData.transactionsToDisplay].reverse();
        const withBalance = reversed.map(t => {
             runningBalance += (t.type === 'Cash In' ? t.amount : -t.amount);
             return { ...t, runningBalance };
        });
        return withBalance.reverse();
    }, [summaryData.transactionsToDisplay, summaryData.openingBalance]);
    
    const handleSaveTransaction = (transaction: Omit<CashflowTransaction, 'id' | 'user'>) => {
        const newTransaction: CashflowTransaction = {
            ...transaction,
            id: Date.now(),
            user: 'Jane Doe' // Hardcoded user
        };
        setCashflowTransactions(prev => [newTransaction, ...prev]);
    };

    const renderContent = () => {
        if (cashflowTransactions.length === 0) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-semibold">No cashflow transactions yet</h2>
                    <p className="mt-2">Sales and expenses will automatically appear here. You can also add manual transactions.</p>
                </div>
            )
        }
        return (
            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date & Time</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Source / Description</th>
                            <th scope="col" className="px-6 py-3">Outlet</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            <th scope="col" className="px-6 py-3 text-right">Running Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionsWithRunningBalance.map(t => (
                            <tr key={t.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">{new Date(t.dateTime).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-semibold ${t.type === 'Cash In' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-800">{t.source}</td>
                                <td className="px-6 py-4">{outlets.find(o => o.id === t.outletId)?.name}</td>
                                <td className={`px-6 py-4 text-right font-medium ${t.type === 'Cash In' ? 'text-green-600' : 'text-red-600'}`}>
                                    {t.type === 'Cash In' ? '+' : '-'} P {t.amount.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800">P {t.runningBalance.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col h-full bg-slate-50 p-6 space-y-6">
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Cashflow</h1>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                        <PlusIcon className="h-4 w-4 mr-2"/> Add Transaction
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex-shrink-0 flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center space-x-2">
                         <label className="text-sm font-medium text-slate-600">Date Range:</label>
                         <select value={dateRange} onChange={e => setDateRange(e.target.value as DateRange)} className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium">
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="last7days">Last 7 Days</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="all">All Time</option>
                         </select>
                    </div>
                     <div className="flex items-center space-x-2">
                         <label className="text-sm font-medium text-slate-600">Outlet:</label>
                         <select value={selectedOutletId} onChange={e => setSelectedOutletId(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium" disabled={outlets.length === 0}>
                             <option value="all">All Outlets</option>
                             {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                         </select>
                    </div>
                     <div className="flex items-center space-x-2">
                         <label className="text-sm font-medium text-slate-600">Type:</label>
                         <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium">
                             <option value="all">All Types</option>
                             <option value="Cash In">Cash In</option>
                             <option value="Cash Out">Cash Out</option>
                         </select>
                    </div>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-slate-500">Opening Balance</p><p className="text-2xl font-bold text-slate-800">P {summaryData.openingBalance.toFixed(2)}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-slate-500">Total Cash In</p><p className="text-2xl font-bold text-green-600">P {summaryData.totalIn.toFixed(2)}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-slate-500">Total Cash Out</p><p className="text-2xl font-bold text-red-600">P {summaryData.totalOut.toFixed(2)}</p></div>
                    <div className="bg-white p-4 rounded-lg shadow-sm border"><p className="text-sm text-slate-500">Closing Balance</p><p className="text-2xl font-bold text-slate-800">P {summaryData.closingBalance.toFixed(2)}</p></div>
                </div>

                {/* Ledger Table */}
                {renderContent()}
            </div>
            <CashflowTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTransaction}
                outlets={outlets}
            />
        </>
    );
};

export default CashFlowScreen;
