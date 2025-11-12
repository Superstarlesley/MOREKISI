import React, { useState, useMemo } from 'react';
import { PurchaseOrder, PurchaseOrderLine, Supplier, Outlet, Product } from '../types';
import { XIcon, PlusIcon, TrashIcon } from './Icons';

interface PurchaseOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (po: PurchaseOrder) => void;
    poToEdit: PurchaseOrder | null;
    suppliers: Supplier[];
    outlets: Outlet[];
    products: Product[];
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({
    isOpen, onClose, onSave, poToEdit, suppliers, outlets, products
}) => {
    const [supplierId, setSupplierId] = useState<number | ''>(poToEdit?.supplierId || '');
    const [outletId, setOutletId] = useState<number | ''>(poToEdit?.outletId || '');
    const [expectedDelivery, setExpectedDelivery] = useState(poToEdit?.expectedDelivery || '');
    const [notes, setNotes] = useState(poToEdit?.notes || '');
    const [items, setItems] = useState<Partial<PurchaseOrderLine>[]>(poToEdit?.items || []);
    
    const [productSearch, setProductSearch] = useState('');

    const filteredProducts = useMemo(() => {
        if (!productSearch) return [];
        return products.filter(p => 
            p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(productSearch.toLowerCase())
        ).slice(0, 5); // Limit results
    }, [productSearch, products]);

    const handleAddItem = (product: Product) => {
        setItems(prev => [...prev, {
            id: Date.now(), // temporary ID for react key
            productId: product.id,
            quantityOrdered: 1,
            cost: product.cost,
            quantityReceived: 0,
        }]);
        setProductSearch('');
    }

    const handleUpdateItem = (itemId: number, field: 'quantityOrdered' | 'cost', value: number) => {
        setItems(prev => prev.map(item => 
            item.id === itemId ? { ...item, [field]: value } : item
        ));
    }
    
    const handleRemoveItem = (itemId: number) => {
        setItems(prev => prev.filter(item => item.id !== itemId));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplierId || !outletId || items.length === 0) {
            alert("Please fill in all required fields and add at least one item.");
            return;
        }

        const finalPO: PurchaseOrder = {
            id: poToEdit?.id || Date.now(),
            poNumber: poToEdit?.poNumber || `PO-${Date.now().toString().slice(-5)}`,
            supplierId,
            outletId,
            dateCreated: poToEdit?.dateCreated || new Date().toISOString().split('T')[0],
            expectedDelivery,
            status: poToEdit?.status || 'Draft',
            items: items.map(item => ({...item, quantityReceived: item.quantityReceived || 0 })) as PurchaseOrderLine[],
            notes,
        };
        onSave(finalPO);
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">{poToEdit ? 'Edit Purchase Order' : 'New Purchase Order'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 flex-1 overflow-y-auto space-y-4">
                        {/* Header Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Supplier</label>
                                <select value={supplierId} onChange={e => setSupplierId(Number(e.target.value))} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition">
                                    <option value="" disabled>Select a supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Outlet</label>
                                <select value={outletId} onChange={e => setOutletId(Number(e.target.value))} required className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition">
                                    <option value="" disabled>Select an outlet</option>
                                    {outlets.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Expected Delivery</label>
                                <input type="date" value={expectedDelivery} onChange={e => setExpectedDelivery(e.target.value)} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition" />
                            </div>
                        </div>
                        
                        {/* Items Section */}
                        <div className="border-t pt-4">
                            <h3 className="font-bold text-lg mb-2">Items</h3>
                            <div className="relative mb-2">
                                <input 
                                    type="text"
                                    placeholder="Search to add products..."
                                    value={productSearch}
                                    onChange={e => setProductSearch(e.target.value)}
                                    className="w-full bg-slate-100 border border-slate-200 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                                />
                                {filteredProducts.length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                                        {filteredProducts.map(p => (
                                            <div key={p.id} onClick={() => handleAddItem(p)} className="p-2 hover:bg-brand-blue-50 cursor-pointer">
                                                {p.name} <span className="text-xs text-slate-500">({p.sku})</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-xs text-slate-600 bg-slate-100">
                                        <tr>
                                            <th className="p-2 text-left">Product</th>
                                            <th className="p-2 text-right w-28">Quantity</th>
                                            <th className="p-2 text-right w-32">Unit Cost</th>
                                            <th className="p-2 text-right w-32">Total</th>
                                            <th className="p-2 w-10"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => {
                                            const product = products.find(p => p.id === item.productId);
                                            return (
                                                <tr key={item.id} className="border-b">
                                                    <td className="p-2 font-medium">{product?.name}</td>
                                                    <td className="p-2"><input type="number" value={item.quantityOrdered} onChange={e => handleUpdateItem(item.id!, 'quantityOrdered', parseInt(e.target.value))} className="w-full text-right p-1 border rounded" /></td>
                                                    <td className="p-2"><input type="number" step="0.01" value={item.cost} onChange={e => handleUpdateItem(item.id!, 'cost', parseFloat(e.target.value))} className="w-full text-right p-1 border rounded" /></td>
                                                    <td className="p-2 text-right font-semibold">P {((item.quantityOrdered || 0) * (item.cost || 0)).toFixed(2)}</td>
                                                    <td className="p-2 text-center"><button type="button" onClick={() => handleRemoveItem(item.id!)} className="text-red-500"><TrashIcon className="h-4 w-4"/></button></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                           <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"></textarea>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                            Save Purchase Order
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchaseOrderModal;
