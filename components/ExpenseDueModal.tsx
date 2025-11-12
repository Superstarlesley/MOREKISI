import React, { useState, useEffect } from 'react';
import { Outlet, ExpenseDue } from '../types';
import { XIcon } from './Icons';

interface ExpenseDueModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: Omit<ExpenseDue, 'id'> & { id?: number }) => void;
    itemToEdit: ExpenseDue | null;
    outlets: Outlet[];
}

const ExpenseDueModal: React.FC<ExpenseDueModalProps> = ({ isOpen, onClose, onSave, itemToEdit, outlets }) => {
    
    const getInitialState = () => ({
        type: 'Expense' as 'Expense' | 'Due',
        name: '',
        amount: 0,
        outletId: outlets[0]?.id || 0,
        date: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'Paid' as 'Paid' | 'Pending',
        paymentMethod: 'Cash' as const,
        notes: '',
    });

    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        const initialState = itemToEdit || getInitialState();
        if(initialState.type === 'Expense') {
            initialState.status = 'Paid';
            initialState.dueDate = '';
        } else { // Due
            initialState.status = itemToEdit?.status || 'Pending';
        }
        setFormData(initialState);
    }, [itemToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'type') {
                newState.status = value === 'Expense' ? 'Paid' : 'Pending';
                if (value === 'Expense') newState.dueDate = '';
            }
            return newState;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: itemToEdit?.id });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{itemToEdit ? 'Edit Entry' : 'Add New Entry'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full form-input">
                                    <option value="Expense">Expense</option>
                                    <option value="Due">Due</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Outlet</label>
                                <select name="outletId" value={formData.outletId} onChange={e => setFormData(f => ({...f, outletId: Number(e.target.value)}))} className="w-full form-input">
                                    {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Name / Description</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full form-input" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <input type="number" step="0.01" name="amount" value={formData.amount} onChange={e => setFormData(f => ({...f, amount: parseFloat(e.target.value)}))} required className="w-full form-input" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full form-input" />
                            </div>
                        </div>
                        {formData.type === 'Due' && (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                    <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full form-input" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full form-input">
                                        <option value="Pending">Pending</option>
                                        <option value="Paid">Paid</option>
                                    </select>
                                </div>
                            </div>
                        )}
                         {formData.status === 'Paid' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="w-full form-input">
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Mobile Money">Mobile Money</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={2} className="w-full form-input"></textarea>
                        </div>

                    </div>
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <style>{`.form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseDueModal;
