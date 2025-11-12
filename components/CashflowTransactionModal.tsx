import React, { useState } from 'react';
import { Outlet, CashflowTransaction } from '../types';
import { XIcon } from './Icons';

interface CashflowTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transaction: Omit<CashflowTransaction, 'id' | 'user'>) => void;
    outlets: Outlet[];
}

const CashflowTransactionModal: React.FC<CashflowTransactionModalProps> = ({
    isOpen, onClose, onSave, outlets
}) => {
    const [outletId, setOutletId] = useState<number | ''>(outlets[0]?.id || '');
    const [type, setType] = useState<'Cash In' | 'Cash Out'>('Cash Out');
    const [amount, setAmount] = useState<number | ''>('');
    const [source, setSource] = useState('');
    const [notes, setNotes] = useState('');
    const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!outletId || !amount || !source) {
            alert('Please fill out all required fields.');
            return;
        }

        onSave({
            outletId,
            type,
            amount: Number(amount),
            source,
            notes,
            dateTime: new Date(dateTime).toISOString(),
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Add Manual Transaction</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Outlet</label>
                                <select value={outletId} onChange={e => setOutletId(Number(e.target.value))} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500">
                                    {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Transaction Type</label>
                                <select value={type} onChange={e => setType(e.target.value as any)} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500">
                                    <option value="Cash Out">Cash Out</option>
                                    <option value="Cash In">Cash In</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount</label>
                                <input type="number" step="0.01" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                                <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Source / Description</label>
                            <input type="text" value={source} onChange={e => setSource(e.target.value)} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" placeholder="e.g., Office Supplies, Petty Cash" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                        </div>

                    </div>
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            Save Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CashflowTransactionModal;
