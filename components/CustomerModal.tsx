import React, { useState, useEffect } from 'react';
import { Customer, Outlet } from '../types';
import { XIcon } from './Icons';

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Omit<Customer, 'id'> & { id?: number }) => void;
    customerToEdit: Customer | null;
    outlets: Outlet[];
}

const CustomerModal: React.FC<CustomerModalProps> = ({
    isOpen, onClose, onSave, customerToEdit, outlets
}) => {
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
        name: '',
        email: '',
        phone: '',
        loyaltyPoints: 0,
        totalPurchases: 0,
        lastPurchaseDate: '',
        status: 'Active',
        outletIds: [],
    });

    useEffect(() => {
        if (customerToEdit) {
            setFormData(customerToEdit);
        } else {
            setFormData({
                name: '', email: '', phone: '', loyaltyPoints: 0, totalPurchases: 0,
                lastPurchaseDate: new Date().toISOString().split('T')[0], status: 'Active', outletIds: [],
            });
        }
    }, [customerToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOutletChange = (outletId: number) => {
        setFormData(prev => {
            const newOutletIds = prev.outletIds.includes(outletId)
                ? prev.outletIds.filter(id => id !== outletId)
                : [...prev.outletIds, outletId];
            return { ...prev, outletIds: newOutletIds };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: customerToEdit?.id });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{customerToEdit ? 'Edit Customer' : 'Add New Customer'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name<span className="text-red-500">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address<span className="text-red-500">*</span></label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number<span className="text-red-500">*</span></label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status<span className="text-red-500">*</span></label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Associated Outlets<span className="text-red-500">*</span></label>
                            <div className="p-3 bg-slate-50 rounded-md border max-h-32 overflow-y-auto">
                                <div className="space-y-2">
                                    {outlets.map(outlet => (
                                        <label key={outlet.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={formData.outletIds.includes(outlet.id)}
                                                onChange={() => handleOutletChange(outlet.id)}
                                                className="h-4 w-4 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-500"
                                            />
                                            <span className="text-sm text-slate-800">{outlet.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            Save Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomerModal;