import React, { useState, useMemo } from 'react';
import { Customer, Outlet } from '../types';
import CustomerModal from '../components/CustomerModal';
import { SearchIcon, FileUpIcon, FileDownIcon, PlusIcon, PencilIcon, TrashIcon } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';

interface CustomersScreenProps {
    customers: Customer[];
    outlets: Outlet[];
    onSave: (customer: Omit<Customer, 'id'> & { id?: number }) => void;
    onDelete: (customerId: number) => void;
}

const CustomersScreen: React.FC<CustomersScreenProps> = ({ customers, outlets, onSave, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOutletId, setSelectedOutletId] = useState<number | 'all'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch = searchTerm === '' ||
                c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.phone.includes(searchTerm);
            
            const matchesOutlet = selectedOutletId === 'all' || c.outletIds.includes(selectedOutletId);

            return matchesSearch && matchesOutlet;
        });
    }, [customers, searchTerm, selectedOutletId]);

    const handleOpenModal = (customer: Customer | null) => {
        setCustomerToEdit(customer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCustomerToEdit(null);
        setIsModalOpen(false);
    };

    const handleSaveCustomer = (customer: Omit<Customer, 'id'> & { id?: number }) => {
        onSave(customer);
    };
    
    const handleDeleteCustomer = (customerId: number) => {
        onDelete(customerId);
    }

    const getOutletNames = (outletIds: number[]) => {
        return outletIds.map(id => outlets.find(o => o.id === id)?.name).filter(Boolean).join(', ');
    };

    const renderContent = () => {
        if (customers.length === 0) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-semibold">No customers yet</h2>
                    <p className="mt-2">Click "Add Customer" to create your first customer profile.</p>
                </div>
            )
        }
        return (
            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">Customer Name</th>
                            <th scope="col" className="px-6 py-3">Contact</th>
                            <th scope="col" className="px-6 py-3">Outlets</th>
                            <th scope="col" className="px-6 py-3 text-right">Loyalty Points</th>
                            <th scope="col" className="px-6 py-3 text-right">Total Purchases</th>
                            <th scope="col" className="px-6 py-3">Last Purchase</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-semibold text-slate-900">{customer.name}</td>
                                <td className="px-6 py-4">
                                    <div>{customer.email}</div>
                                    <div className="text-xs text-slate-400">{customer.phone}</div>
                                </td>
                                <td className="px-6 py-4 text-xs">{getOutletNames(customer.outletIds)}</td>
                                <td className="px-6 py-4 text-right font-medium text-brand-blue-600">{customer.loyaltyPoints}</td>
                                <td className="px-6 py-4 text-right font-medium">P {customer.totalPurchases.toFixed(2)}</td>
                                <td className="px-6 py-4">{customer.lastPurchaseDate}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                                        {customer.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center space-x-2">
                                        <button onClick={() => handleOpenModal(customer)} className="p-1 text-slate-500 hover:text-brand-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                        <button onClick={() => setCustomerToDelete(customer)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
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
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
                    <div className="flex items-center space-x-2">
                        <button className="flex items-center bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            <FileUpIcon className="h-4 w-4 mr-2"/> Import
                        </button>
                        <button className="flex items-center bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            <FileDownIcon className="h-4 w-4 mr-2"/> Export
                        </button>
                        <button onClick={() => handleOpenModal(null)} className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            <PlusIcon className="h-4 w-4 mr-2"/> Add Customer
                        </button>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex-shrink-0 flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm mb-6 border border-slate-200">
                    <div className="flex-1 relative">
                        <SearchIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 border-transparent rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                        />
                    </div>
                     <select 
                        className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700"
                        value={selectedOutletId}
                        onChange={(e) => setSelectedOutletId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        disabled={outlets.length === 0}
                    >
                        <option value="all">All Outlets</option>
                        {outlets.map(outlet => <option key={outlet.id} value={outlet.id}>{outlet.name}</option>)}
                    </select>
                </div>
                {renderContent()}
            </div>
            {isModalOpen && (
                <CustomerModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveCustomer}
                    customerToEdit={customerToEdit}
                    outlets={outlets}
                />
            )}
            {customerToDelete && (
                <ConfirmationModal
                    isOpen={!!customerToDelete}
                    onClose={() => setCustomerToDelete(null)}
                    onConfirm={() => handleDeleteCustomer(customerToDelete.id)}
                    title="Delete Customer"
                    message={`Are you sure you want to delete "${customerToDelete.name}"? This action cannot be undone.`}
                />
            )}
        </>
    );
};

export default CustomersScreen;
