import React, { useState, useEffect } from 'react';
import { User, Outlet, Role } from '../../types';
import { XIcon } from '../Icons';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: Omit<User, 'id'> & { id?: number }) => void;
    userToEdit: User | null;
    outlets: Outlet[];
    roles: Role[];
}

const UserModal: React.FC<UserModalProps> = ({
    isOpen, onClose, onSave, userToEdit, outlets, roles
}) => {
    const getInitialState = () => ({
        name: '',
        email: '',
        role: roles[roles.length - 1], // Default to least privileged
        outletIds: [],
        status: 'Active' as 'Active' | 'Inactive',
        lastLogin: 'Never',
    });
    
    const [formData, setFormData] = useState<Omit<User, 'id'>>(getInitialState());

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData(getInitialState());
        }
    }, [userToEdit, isOpen]);

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
        onSave({ ...formData, id: userToEdit?.id });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{userToEdit ? 'Edit User' : 'Add New User'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full form-input" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full form-input" />
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="w-full form-input">
                                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
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
                            <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Outlets</label>
                            <div className="p-3 bg-slate-50 rounded-md border max-h-32 overflow-y-auto space-y-2">
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
                         <p className="text-xs text-slate-500">A password reset link will be sent to the user's email upon creation.</p>
                    </div>
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                         <style>{`.form-input { display: block; width: 100%; border-radius: 0.375rem; border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; } .form-input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }`}</style>
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            Save User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
