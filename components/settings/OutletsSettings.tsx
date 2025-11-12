import React, { useState } from 'react';
import { Outlet } from '../../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../Icons';
import OutletModal from './OutletModal';
import ConfirmationModal from '../ConfirmationModal';

interface OutletsSettingsProps {
    outlets: Outlet[];
    onSaveOutlet: (outlet: Omit<Outlet, 'id'> & { id?: number }) => void;
    onDeleteOutlet: (outletId: number) => void;
}

const OutletsSettings: React.FC<OutletsSettingsProps> = ({ outlets, onSaveOutlet, onDeleteOutlet }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [outletToEdit, setOutletToEdit] = useState<Outlet | null>(null);
    const [outletToDelete, setOutletToDelete] = useState<Outlet | null>(null);

    const handleOpenModal = (outlet: Outlet | null) => {
        setOutletToEdit(outlet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setOutletToEdit(null);
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-slate-700">All Outlets</h2>
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" /> Add Outlet
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-4 py-3">Outlet Name</th>
                                <th className="px-4 py-3">Address</th>
                                <th className="px-4 py-3">Contact Phone</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {outlets.map(outlet => (
                                <tr key={outlet.id} className="border-b hover:bg-slate-50">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{outlet.name}</td>
                                    <td className="px-4 py-3">{outlet.address}</td>
                                    <td className="px-4 py-3">{outlet.contactPhone}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => handleOpenModal(outlet)} className="p-1 text-slate-500 hover:text-brand-blue-600">
                                                <PencilIcon className="h-5 w-5" />
                                            </button>
                                            <button onClick={() => setOutletToDelete(outlet)} className="p-1 text-slate-500 hover:text-red-600">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {outlets.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p>No outlets configured. Click "Add Outlet" to set up your first store location.</p>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <OutletModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={onSaveOutlet}
                    outletToEdit={outletToEdit}
                />
            )}
            {outletToDelete && (
                <ConfirmationModal
                    isOpen={!!outletToDelete}
                    onClose={() => setOutletToDelete(null)}
                    onConfirm={() => onDeleteOutlet(outletToDelete.id)}
                    title="Delete Outlet"
                    message={`Are you sure you want to delete the outlet "${outletToDelete.name}"? This action cannot be undone and may affect many associated records.`}
                />
            )}
        </>
    );
};

export default OutletsSettings;
