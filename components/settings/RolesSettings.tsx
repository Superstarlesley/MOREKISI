import React, { useState } from 'react';
import { Role } from '../../types';
import { PlusIcon, TrashIcon } from '../Icons';
import ConfirmationModal from '../ConfirmationModal';

interface RolesSettingsProps {
    roles: Role[];
    onSaveRole: (roleName: Role) => void;
    onDeleteRole: (roleName: Role) => void;
}

const RolesSettings: React.FC<RolesSettingsProps> = ({ roles, onSaveRole, onDeleteRole }) => {
    const [newRole, setNewRole] = useState('');
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

    const handleAddRole = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRole.trim()) {
            onSaveRole(newRole.trim());
            setNewRole('');
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Manage Roles</h2>
                <form onSubmit={handleAddRole} className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="Enter new role name..."
                        className="flex-grow w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    />
                    <button
                        type="submit"
                        className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" /> Add Role
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-4 py-3">Role Name</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map(role => (
                                <tr key={role} className="border-b hover:bg-slate-50">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{role}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setRoleToDelete(role)}
                                            className="p-1 text-slate-500 hover:text-red-600"
                                            title={`Delete ${role}`}
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {roles.length === 0 && (
                         <div className="text-center p-8 text-slate-500">
                            <p>No roles defined. Add roles like "Administrator" or "Cashier" to assign to users.</p>
                        </div>
                    )}
                </div>
            </div>

            {roleToDelete && (
                <ConfirmationModal
                    isOpen={!!roleToDelete}
                    onClose={() => setRoleToDelete(null)}
                    onConfirm={() => onDeleteRole(roleToDelete)}
                    title="Delete Role"
                    message={`Are you sure you want to delete the role "${roleToDelete}"? This may affect users currently assigned this role.`}
                />
            )}
        </>
    );
};

export default RolesSettings;
