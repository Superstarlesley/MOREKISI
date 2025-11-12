import React, { useState, useEffect } from 'react';
import { Tax, Category, TaxApplyTo, TaxType } from '../../types';
import { XIcon } from '../Icons';

interface TaxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tax: Omit<Tax, 'id'> & { id?: number }) => void;
    taxToEdit: Tax | null;
    categories: Category[];
}

const TaxModal: React.FC<TaxModalProps> = ({ isOpen, onClose, onSave, taxToEdit, categories }) => {
    
    const getInitialState = () => ({
        name: '',
        rate: 0,
        type: 'inclusive' as TaxType,
        applyTo: 'all' as TaxApplyTo,
        categoryIds: [],
        status: 'Active' as 'Active' | 'Inactive',
    });
    
    const [formData, setFormData] = useState<Omit<Tax, 'id'>>(getInitialState());

    useEffect(() => {
        if (taxToEdit) {
            setFormData(taxToEdit);
        } else {
            setFormData(getInitialState());
        }
    }, [taxToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumeric = ['rate'].includes(name);
        setFormData(prev => ({ ...prev, [name]: isNumeric ? parseFloat(value) : value }));
    };

    const handleCategoryChange = (categoryId: number) => {
        setFormData(prev => {
            const newCategoryIds = prev.categoryIds.includes(categoryId)
                ? prev.categoryIds.filter(id => id !== categoryId)
                : [...prev.categoryIds, categoryId];
            return { ...prev, categoryIds: newCategoryIds };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: taxToEdit?.id });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{taxToEdit ? 'Edit Tax Rule' : 'Add New Tax Rule'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tax Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full form-input" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate (%)</label>
                                <input type="number" step="0.01" name="rate" value={formData.rate} onChange={handleChange} required className="w-full form-input" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tax Type</label>
                                <select name="type" value={formData.type} onChange={handleChange} className="w-full form-input">
                                    <option value="inclusive">Inclusive</option>
                                    <option value="exclusive">Exclusive</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full form-input">
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Apply To</label>
                            <select name="applyTo" value={formData.applyTo} onChange={handleChange} className="w-full form-input">
                                <option value="all">All Items</option>
                                <option value="categories">Selected Categories</option>
                            </select>
                        </div>
                        {formData.applyTo === 'categories' && (
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Select Categories</label>
                                <div className="p-3 bg-slate-50 rounded-md border max-h-32 overflow-y-auto">
                                    <div className="space-y-2">
                                        {categories.map(cat => (
                                            <label key={cat.id} className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.categoryIds.includes(cat.id)}
                                                    onChange={() => handleCategoryChange(cat.id)}
                                                    className="h-4 w-4 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-500"
                                                />
                                                <span className="text-sm text-slate-800">{cat.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <style>{`.form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            Save Tax Rule
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaxModal;
