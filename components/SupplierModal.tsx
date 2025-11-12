import React, { useState, useEffect } from 'react';
import { Supplier } from '../types';
import { XIcon } from './Icons';

interface SupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (supplier: Omit<Supplier, 'id'> & { id?: number }) => void;
    supplierToEdit: Supplier | null;
}

const SupplierModal: React.FC<SupplierModalProps> = ({
    isOpen, onClose, onSave, supplierToEdit
}) => {
    const getInitialState = (): Omit<Supplier, 'id'> => ({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        paymentTerms: '',
        notes: '',
    });

    const [formData, setFormData] = useState<Omit<Supplier, 'id'>>(getInitialState());
    const [errors, setErrors] = useState<{ name?: string }>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(supplierToEdit || getInitialState());
            setErrors({});
        }
    }, [isOpen, supplierToEdit]);

    const validate = () => {
        const newErrors: { name?: string } = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Supplier Name is required.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSave({ ...formData, id: supplierToEdit?.id });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{supplierToEdit ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name*</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                                <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Terms</label>
                                <input type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address / Physical Location</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange}
                                className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
                                <input type="text" name="country" value={formData.country} onChange={handleChange}
                                    className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Additional Information</label>
                            <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3}
                                className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"></textarea>
                        </div>
                    </div>
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow disabled:bg-slate-400">
                            Save Supplier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SupplierModal;
