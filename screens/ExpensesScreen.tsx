import React, { useState, useMemo } from 'react';
import { ExpenseDue, Outlet } from '../types';
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon, CheckCircleIcon } from '../components/Icons'; 
import ExpenseDueModal from '../components/ExpenseDueModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface ExpensesScreenProps {
    expensesDues: ExpenseDue[];
    outlets: Outlet[];
    onSave: (item: Omit<ExpenseDue, 'id'> & { id?: number }) => void;
    onDelete: (itemId: number) => void;
}

const ExpensesScreen: React.FC<ExpensesScreenProps> = ({ expensesDues, outlets, onSave, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOutletId, setSelectedOutletId] = useState<number | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<'all' | 'Expense' | 'Due'>('all');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<ExpenseDue | null>(null);
    const [itemToDelete, setItemToDelete] = useState<ExpenseDue | null>(null);

    const filteredItems = useMemo(() => {
        return expensesDues.filter(item => {
            const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesOutlet = selectedOutletId === 'all' || item.outletId === selectedOutletId;
            const matchesType = typeFilter === 'all' || item.type === typeFilter;
            return matchesSearch && matchesOutlet && matchesType;
        });
    }, [expensesDues, searchTerm, selectedOutletId, typeFilter]);

    const handleOpenModal = (item: ExpenseDue | null) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setItemToEdit(null);
        setIsModalOpen(false);
    };

    const handleSaveItem = (item: Omit<ExpenseDue, 'id'> & { id?: number }) => {
        onSave(item);
    };
    
    const handleDeleteItem = (itemId: number) => {
        onDelete(itemId);
    };

    const handleMarkAsPaid = (item: ExpenseDue) => {
        if(item.type === 'Due' && item.status === 'Pending') {
            const paidItem = { ...item, status: 'Paid' as 'Paid', paymentMethod: 'Cash' as const };
            onSave(paidItem);
            // Here you would also create a Cashflow transaction
            console.log(`Marked as paid, created cashflow out for ${item.amount}`);
        }
    }

    const renderContent = () => {
        if (expensesDues.length === 0) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-semibold">No Expenses or Dues</h2>
                    <p className="mt-2">Click "Add Entry" to record your first expense or upcoming due payment.</p>
                </div>
            )
        }
        return (
            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Name / Description</th>
                            <th scope="col" className="px-6 py-3">Outlet</th>
                            <th scope="col" className="px-6 py-3 text-right">Amount</th>
                            <th scope="col" className="px-6 py-3">Due Date</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">{item.date}</td>
                                <td className="px-6 py-4">
                                    <span className={`font-semibold ${item.type === 'Expense' ? 'text-orange-600' : 'text-purple-600'}`}>
                                        {item.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-semibold text-slate-900">{item.name}</td>
                                <td className="px-6 py-4">{outlets.find(o => o.id === item.outletId)?.name}</td>
                                <td className="px-6 py-4 text-right font-medium text-red-600">P {item.amount.toFixed(2)}</td>
                                <td className="px-6 py-4">{item.dueDate || 'N/A'}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center space-x-2">
                                        {item.type === 'Due' && item.status === 'Pending' && (
                                            <button onClick={() => handleMarkAsPaid(item)} className="p-1 text-slate-500 hover:text-green-600" title="Mark as Paid"><CheckCircleIcon className="h-5 w-5"/></button>
                                        )}
                                        <button onClick={() => handleOpenModal(item)} className="p-1 text-slate-500 hover:text-brand-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => setItemToDelete(item)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col h-full bg-slate-50 p-6">
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Expenses & Dues</h1>
                    <button onClick={() => handleOpenModal(null)} className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                        <PlusIcon className="h-4 w-4 mr-2"/> Add Entry
                    </button>
                </div>

                {/* Toolbar */}
                <div className="flex-shrink-0 flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm mb-6 border border-slate-200">
                    <div className="flex-1 relative">
                        <SearchIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name/description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 border-transparent rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                        />
                    </div>
                     <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700">
                        <option value="all">All Types</option>
                        <option value="Expense">Expense</option>
                        <option value="Due">Due</option>
                     </select>
                     <select value={selectedOutletId} onChange={(e) => setSelectedOutletId(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700" disabled={outlets.length === 0}>
                        <option value="all">All Outlets</option>
                        {outlets.map(outlet => <option key={outlet.id} value={outlet.id}>{outlet.name}</option>)}
                    </select>
                </div>
                {renderContent()}
            </div>
            {isModalOpen && (
                <ExpenseDueModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveItem}
                    itemToEdit={itemToEdit}
                    outlets={outlets}
                />
            )}
            {itemToDelete && (
                <ConfirmationModal
                    isOpen={!!itemToDelete}
                    onClose={() => setItemToDelete(null)}
                    onConfirm={() => handleDeleteItem(itemToDelete.id)}
                    title={`Delete ${itemToDelete.type}`}
                    message={`Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`}
                />
            )}
        </>
    );
};

export default ExpensesScreen;
