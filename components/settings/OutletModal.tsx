import React, { useState, useEffect } from 'react';
import { Outlet } from '../../types';
import { XIcon } from '../Icons';

interface OutletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (outlet: Omit<Outlet, 'id'> & { id?: number }) => void;
    outletToEdit: Outlet | null;
}

const OutletModal: React.FC<OutletModalProps> = ({
    isOpen, onClose, onSave, outletToEdit
}) => {
    const getInitialState = () => ({
        name: '',
        address: '',
        contactPhone: '',
    });
    
    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        if (outletToEdit) {
            setFormData(outletToEdit);
        } else {
            setFormData(getInitialState());
        }
    }, [outletToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: outletToEdit?.id });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{outletToEdit ? 'Edit Outlet' : 'Add New Outlet'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Outlet Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                            <input type="tel" name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="w-full form-input" />
                        </div>
                    </div>
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <style>{`.form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            Save Outlet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OutletModal;
