import React, { useState, useMemo, useCallback } from 'react';
import { PurchaseOrder, PurchaseOrderStatus, Supplier, Outlet, Product } from '../types';
import { SearchIcon, PlusIcon, PackageCheck, PencilIcon, TrashIcon, ChevronDown } from '../components/Icons';
import PurchaseOrderModal from '../components/PurchaseOrderModal';
import ReceivePoModal from '../components/ReceivePoModal';
import ConfirmationModal from '../components/ConfirmationModal';

const statusColors: { [key in PurchaseOrderStatus]: string } = {
    Draft: 'bg-slate-200 text-slate-800',
    Sent: 'bg-blue-100 text-blue-800',
    'Partially Received': 'bg-yellow-100 text-yellow-800',
    Received: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
};

interface PurchasesScreenProps {
    products: Product[];
    purchaseOrders: PurchaseOrder[];
    suppliers: Supplier[];
    outlets: Outlet[];
    onSavePo: (po: PurchaseOrder) => void;
    onDeletePo: (poId: number) => void;
    onReceiveStock: (poId: number, receivedItems: { productId: number, quantity: number }[]) => void;
}

const PurchasesScreen: React.FC<PurchasesScreenProps> = ({
    products, purchaseOrders, suppliers, outlets, onSavePo, onDeletePo, onReceiveStock
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOutletId, setSelectedOutletId] = useState<number | 'all'>('all');
    const [selectedStatus, setSelectedStatus] = useState<PurchaseOrderStatus | 'all'>('all');
    
    const [isPoModalOpen, setIsPoModalOpen] = useState(false);
    const [poToEdit, setPoToEdit] = useState<PurchaseOrder | null>(null);

    const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
    const [poToReceive, setPoToReceive] = useState<PurchaseOrder | null>(null);
    const [poToDelete, setPoToDelete] = useState<PurchaseOrder | null>(null);

    const filteredPOs = useMemo(() => {
        return purchaseOrders.filter(po => {
            const supplier = suppliers.find(s => s.id === po.supplierId);
            const matchesSearch = searchTerm === '' ||
                po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                supplier?.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesOutlet = selectedOutletId === 'all' || po.outletId === selectedOutletId;
            const matchesStatus = selectedStatus === 'all' || po.status === selectedStatus;

            return matchesSearch && matchesOutlet && matchesStatus;
        });
    }, [purchaseOrders, searchTerm, selectedOutletId, selectedStatus, suppliers]);
    
    const calculatePoTotal = useCallback((po: PurchaseOrder) => {
        return po.items.reduce((acc, item) => acc + item.cost * item.quantityOrdered, 0);
    }, []);

    const handleSavePoInternal = (po: PurchaseOrder) => {
        onSavePo(po);
        setIsPoModalOpen(false);
        setPoToEdit(null);
    };
    
    const handleReceiveStockInternal = (poId: number, receivedItems: { productId: number, quantity: number }[]) => {
        onReceiveStock(poId, receivedItems);
        setIsReceiveModalOpen(false);
        setPoToReceive(null);
    };

    const handleOpenPoModal = () => {
        if (suppliers.length === 0 || outlets.length === 0 || products.length === 0) {
            alert("Please create at least one Supplier, Outlet, and Product before creating a Purchase Order.");
            return;
        }
        setPoToEdit(null);
        setIsPoModalOpen(true);
    }
    
    const renderContent = () => {
        if (purchaseOrders.length === 0) {
            return (
                 <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-semibold">No Purchase Orders</h2>
                    <p className="mt-2">Click "New Purchase Order" to create your first one.</p>
                </div>
            )
        }
        return (
            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                        <tr>
                            <th scope="col" className="px-6 py-3">PO Number</th>
                            <th scope="col" className="px-6 py-3">Supplier</th>
                            <th scope="col" className="px-6 py-3">Outlet</th>
                            <th scope="col" className="px-6 py-3">Date Created</th>
                            <th scope="col" className="px-6 py-3 text-right">Total Amount</th>
                            <th scope="col" className="px-6 py-3 text-center">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPOs.map(po => {
                            const supplier = suppliers.find(s => s.id === po.supplierId);
                            const outlet = outlets.find(o => o.id === po.outletId);
                            return (
                            <tr key={po.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-bold text-brand-blue-600">{po.poNumber}</td>
                                <td className="px-6 py-4 font-semibold text-slate-800">{supplier?.name}</td>
                                <td className="px-6 py-4">{outlet?.name}</td>
                                <td className="px-6 py-4">{po.dateCreated}</td>
                                <td className="px-6 py-4 font-medium text-right">P {calculatePoTotal(po).toFixed(2)}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${statusColors[po.status]}`}>
                                        {po.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center items-center space-x-2">
                                        {(po.status === 'Sent' || po.status === 'Partially Received') && (
                                            <button 
                                                onClick={() => { setPoToReceive(po); setIsReceiveModalOpen(true); }}
                                                className="p-1.5 text-slate-500 hover:text-green-600 rounded-md hover:bg-green-100 transition" title="Receive Stock">
                                                <PackageCheck className="h-5 w-5"/>
                                            </button>
                                        )}
                                        {po.status === 'Draft' && (
                                            <button 
                                                onClick={() => { setPoToEdit(po); setIsPoModalOpen(true); }}
                                                className="p-1.5 text-slate-500 hover:text-brand-blue-600 rounded-md hover:bg-blue-100 transition" title="Edit PO">
                                                <PencilIcon className="h-5 w-5"/>
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => { if (po.status === 'Draft') setPoToDelete(po); }}
                                            className={`p-1.5 rounded-md transition ${po.status === 'Draft' ? 'text-slate-500 hover:text-red-600 hover:bg-red-100' : 'text-slate-300 cursor-not-allowed'}`} 
                                            title={po.status === 'Draft' ? 'Delete PO' : 'Only draft POs can be deleted'}
                                            disabled={po.status !== 'Draft'}>
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <>
            <div className="flex flex-col h-full bg-slate-50 p-6">
                <div className="flex-shrink-0 flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">Purchase Orders</h1>
                    <button 
                        onClick={handleOpenPoModal}
                        className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow"
                    >
                        <PlusIcon className="h-4 w-4 mr-2"/> New Purchase Order
                    </button>
                </div>

                <div className="flex-shrink-0 flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm mb-6 border border-slate-200">
                    <div className="flex-1 relative">
                        <SearchIcon className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by PO# or Supplier..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 border-transparent rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                        />
                    </div>
                    <select value={selectedOutletId} onChange={e => setSelectedOutletId(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700" disabled={outlets.length === 0}>
                        <option value="all">All Outlets</option>
                        {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                    <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as any)} className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700">
                        <option value="all">All Statuses</option>
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                {renderContent()}
            </div>

            {isPoModalOpen && (
                <PurchaseOrderModal
                    isOpen={isPoModalOpen}
                    onClose={() => { setIsPoModalOpen(false); setPoToEdit(null); }}
                    onSave={handleSavePoInternal}
                    products={products}
                    suppliers={suppliers}
                    outlets={outlets}
                    poToEdit={poToEdit}
                />
            )}

            {isReceiveModalOpen && poToReceive && (
                <ReceivePoModal
                    isOpen={isReceiveModalOpen}
                    onClose={() => { setIsReceiveModalOpen(false); setPoToReceive(null); }}
                    onReceive={handleReceiveStockInternal}
                    purchaseOrder={poToReceive}
                    products={products}
                />
            )}
            {poToDelete && (
                <ConfirmationModal
                    isOpen={!!poToDelete}
                    onClose={() => setPoToDelete(null)}
                    onConfirm={() => onDeletePo(poToDelete.id)}
                    title="Delete Purchase Order"
                    message={`Are you sure you want to delete PO "${poToDelete.poNumber}"? This action cannot be undone.`}
                />
            )}
        </>
    );
};

export default PurchasesScreen;
