import React, { useState } from 'react';
import { PurchaseOrder, Product } from '../types';
import { XIcon } from './Icons';

interface ReceivePoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onReceive: (poId: number, receivedItems: { productId: number, quantity: number }[]) => void;
    purchaseOrder: PurchaseOrder;
    products: Product[];
}

interface ReceivedItem {
    productId: number;
    quantity: number;
}

const ReceivePoModal: React.FC<ReceivePoModalProps> = ({
    isOpen, onClose, onReceive, purchaseOrder, products
}) => {
    const [receivedQuantities, setReceivedQuantities] = useState<ReceivedItem[]>(
        purchaseOrder.items.map(item => ({ productId: item.productId, quantity: 0 }))
    );

    const handleQuantityChange = (productId: number, quantity: number) => {
        setReceivedQuantities(prev =>
            prev.map(item => (item.productId === productId ? { ...item, quantity } : item))
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const itemsToReceive = receivedQuantities.filter(item => item.quantity > 0);
        if (itemsToReceive.length === 0) {
            alert("Please enter a quantity for at least one item.");
            return;
        }
        onReceive(purchaseOrder.id, itemsToReceive);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Receive Stock for {purchaseOrder.poNumber}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 flex-1 overflow-y-auto">
                        <table className="w-full text-sm">
                            <thead className="text-xs text-slate-600 bg-slate-100">
                                <tr>
                                    <th className="p-2 text-left">Product</th>
                                    <th className="p-2 text-center">Ordered</th>
                                    <th className="p-2 text-center">Received</th>
                                    <th className="p-2 text-center">Balance</th>
                                    <th className="p-2 text-center w-36">Receive Now</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseOrder.items.map(item => {
                                    const product = products.find(p => p.id === item.productId);
                                    const balance = item.quantityOrdered - item.quantityReceived;
                                    const currentInput = receivedQuantities.find(rq => rq.productId === item.productId)?.quantity || 0;
                                    return (
                                        <tr key={item.id} className="border-b">
                                            <td className="p-2 font-medium">{product?.name}</td>
                                            <td className="p-2 text-center">{item.quantityOrdered}</td>
                                            <td className="p-2 text-center">{item.quantityReceived}</td>
                                            <td className="p-2 text-center font-semibold">{balance}</td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max={balance}
                                                    value={currentInput}
                                                    onChange={e => handleQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                                                    className="w-full text-center p-1 border rounded"
                                                    disabled={balance <= 0}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-green-700 transition shadow">
                            Receive Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReceivePoModal;
