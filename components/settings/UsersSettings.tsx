import React, { useState } from 'react';
import { User, Outlet, Role } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../Icons';
import UserModal from './UserModal';
import ConfirmationModal from '../ConfirmationModal';

interface UsersSettingsProps {
    users: User[];
    outlets: Outlet[];
    roles: Role[];
    onSaveUser: (user: Omit<User, 'id'> & { id?: number }) => void;
    onDeleteUser: (userId: number) => void;
}

const UsersSettings: React.FC<UsersSettingsProps> = ({ users, outlets, roles, onSaveUser, onDeleteUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const handleOpenModal = (user: User | null) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setUserToEdit(null);
        setIsModalOpen(false);
    };

    const getOutletNames = (outletIds: number[]) => {
        if (outletIds.length === outlets.length && outlets.length > 0) return 'All Outlets';
        if (outletIds.length === 0) return 'No outlets assigned';
        return outletIds.map(id => outlets.find(o => o.id === id)?.name).filter(Boolean).join(', ') || 'N/A';
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-700">All Users</h2>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" /> Add User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Assigned Outlets</th>
                                <th className="px-4 py-3">Last Login</th>
                                <th className="px-4 py-3 text-center">Status</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-slate-900">{user.name}</div>
                                        <div className="text-xs">{user.email}</div>
                                    </td>
                                    <td className="px-4 py-3">{user.role}</td>
                                    <td className="px-4 py-3 text-xs">{getOutletNames(user.outletIds)}</td>
                                    <td className="px-4 py-3 text-xs">{user.lastLogin}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex px-2 py-1 text-xs font-bold leading-5 rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleOpenModal(user)} className="p-1 text-slate-500 hover:text-brand-blue-600">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => setUserToDelete(user)} className="p-1 text-slate-500 hover:text-red-600">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {users.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p>No users have been created yet. Click "Add User" to begin.</p>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <UserModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={onSaveUser}
                    userToEdit={userToEdit}
                    outlets={outlets}
                    roles={roles}
                />
            )}
            {userToDelete && (
                <ConfirmationModal
                    isOpen={!!userToDelete}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={() => onDeleteUser(userToDelete.id)}
                    title="Deactivate User"
                    message={`Are you sure you want to deactivate the user "${userToDelete.name}"? They will no longer be able to log in.`}
                    confirmText="Deactivate"
                />
            )}
        </>
    );
};

export default UsersSettings;
