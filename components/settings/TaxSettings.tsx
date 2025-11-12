import React, { useState } from 'react';
import { Tax, Category } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../Icons';
import ConfirmationModal from '../ConfirmationModal';
import TaxModal from './TaxModal';

interface TaxSettingsProps {
    taxes: Tax[];
    categories: Category[];
    onSave: (tax: Omit<Tax, 'id'> & { id?: number }) => void;
    onDelete: (taxId: number) => void;
}

const TaxSettings: React.FC<TaxSettingsProps> = ({ taxes, categories, onSave, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taxToEdit, setTaxToEdit] = useState<Tax | null>(null);
    const [taxToDelete, setTaxToDelete] = useState<Tax | null>(null);

    const handleOpenModal = (tax: Tax | null) => {
        setTaxToEdit(tax);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setTaxToEdit(null);
        setIsModalOpen(false);
    };
    
    const getAppliedToText = (tax: Tax) => {
        if (tax.applyTo === 'all') return 'All Items';
        if (tax.categoryIds.length === 0) return 'Specific Categories (none selected)';
        const categoryNames = tax.categoryIds.map(id => categories.find(c => c.id === id)?.name).filter(Boolean);
        return `Categories: ${categoryNames.join(', ')}`;
    }

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-700">All Tax Rules</h2>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" /> Add New Tax Rule
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-4 py-3">Tax Name</th>
                                <th className="px-4 py-3 text-right">Rate (%)</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Applied To</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {taxes.map(tax => (
                                <tr key={tax.id} className="border-b hover:bg-slate-50">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{tax.name}</td>
                                    <td className="px-4 py-3 text-right font-mono">{tax.rate.toFixed(2)}%</td>
                                    <td className="px-4 py-3 capitalize">{tax.type}</td>
                                    <td className="px-4 py-3 text-xs">{getAppliedToText(tax)}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex px-2 py-1 text-xs font-bold leading-5 rounded-full ${tax.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {tax.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleOpenModal(tax)} className="p-1 text-slate-500 hover:text-brand-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                            <button onClick={() => setTaxToDelete(tax)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {taxes.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p>No tax rules have been created yet. Click "Add New Tax Rule" to begin.</p>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <TaxModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={onSave}
                    taxToEdit={taxToEdit}
                    categories={categories}
                />
            )}
            {taxToDelete && (
                <ConfirmationModal
                    isOpen={!!taxToDelete}
                    onClose={() => setTaxToDelete(null)}
                    onConfirm={() => onDelete(taxToDelete.id)}
                    title="Delete Tax Rule"
                    message={`Are you sure you want to delete the tax rule "${taxToDelete.name}"? This action cannot be undone.`}
                />
            )}
        </>
    );
};

export default TaxSettings;
