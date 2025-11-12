import React, { useState } from 'react';
import { Supplier } from '../types';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/Icons';
import SupplierModal from '../components/SupplierModal';
import ConfirmationModal from '../components/ConfirmationModal';

interface SuppliersScreenProps {
    suppliers: Supplier[];
    onSave: (supplierData: Omit<Supplier, 'id'> & { id?: number }) => void;
    onDelete: (supplierId: number) => void;
}

const SuppliersScreen: React.FC<SuppliersScreenProps> = ({ suppliers, onSave, onDelete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [supplierToEdit, setSupplierToEdit] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

    const handleOpenModal = (supplier: Supplier | null) => {
        setSupplierToEdit(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSupplierToEdit(null);
        setIsModalOpen(false);
    };

    const handleSaveSupplier = (supplierData: Omit<Supplier, 'id'> & { id?: number }) => {
        onSave(supplierData);
        setIsModalOpen(false);
    };
    
    const handleDeleteSupplier = (supplierId: number) => {
        onDelete(supplierId);
    };

    const renderContent = () => {
        if (suppliers.length === 0) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-semibold">No suppliers found</h2>
                    <p className="mt-2">Click the "Add Supplier" button to add your first supplier.</p>
                </div>
            )
        }
        return (
            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Supplier Name</th>
                            <th scope="col" className="px-6 py-3">Contact Person</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Phone</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(supplier => (
                            <tr key={supplier.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-semibold text-slate-900">{supplier.name}</td>
                                <td className="px-6 py-4">{supplier.contactPerson}</td>
                                <td className="px-6 py-4">{supplier.email}</td>
                                <td className="px-6 py-4">{supplier.phone}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button onClick={() => handleOpenModal(supplier)} className="p-1 text-slate-500 hover:text-brand-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => setSupplierToDelete(supplier)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col h-full bg-slate-50 p-6">
                <div className="flex-shrink-0 flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Suppliers</h1>
                    <button 
                        onClick={() => handleOpenModal(null)}
                        className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                        <PlusIcon className="h-4 w-4 mr-2"/> Add Supplier
                    </button>
                </div>
                {renderContent()}
            </div>
            {isModalOpen && (
                <SupplierModal 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveSupplier}
                    supplierToEdit={supplierToEdit}
                />
            )}
            {supplierToDelete && (
                <ConfirmationModal
                    isOpen={!!supplierToDelete}
                    onClose={() => setSupplierToDelete(null)}
                    onConfirm={() => handleDeleteSupplier(supplierToDelete.id)}
                    title="Delete Supplier"
                    message={`Are you sure you want to delete "${supplierToDelete.name}"? This action cannot be undone.`}
                />
            )}
        </>
    );
};

export default SuppliersScreen;
