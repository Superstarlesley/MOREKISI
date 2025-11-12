import React, { useState } from 'react';
import { Product, Outlet, StockAdjustment, StockAdjustmentType } from '../types';
import { XIcon } from './Icons';

interface StockAdjustmentModalProps {
  product: Product;
  outlet: Outlet;
  onClose: () => void;
  onAdjust: (adjustment: StockAdjustment) => void;
}

const adjustmentTypes: StockAdjustmentType[] = ['Received', 'Damaged/Loss', 'Manual Correction', 'Stock Take', 'Return'];

const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ product, outlet, onClose, onAdjust }) => {
  const [type, setType] = useState<StockAdjustmentType>('Manual Correction');
  const [quantityChange, setQuantityChange] = useState<number>(0);
  const [reason, setReason] = useState('');

  const currentStock = product.stockLevels.find(sl => sl.outletId === outlet.id)?.quantity ?? 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityChange === 0) return;
    
    onAdjust({
        productId: product.id,
        outletId: outlet.id,
        change: quantityChange,
        type,
        reason,
        user: 'Jane Doe', // Hardcoded for now
        date: new Date(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Stock Adjustment</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <p className="text-sm text-slate-500">SKU: {product.sku} at <span className="font-medium">{outlet.name}</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="text-center bg-slate-100 p-3 rounded-lg">
                        <p className="text-sm text-slate-500">Current Stock</p>
                        <p className="text-2xl font-bold">{currentStock}</p>
                    </div>
                    <div className="text-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600">New Stock</p>
                        <p className="text-2xl font-bold text-blue-800">{currentStock + quantityChange}</p>
                    </div>
                </div>

                <div>
                    <label htmlFor="adjustmentType" className="block text-sm font-medium text-slate-700 mb-1">Adjustment Type</label>
                    <select
                        id="adjustmentType"
                        value={type}
                        onChange={(e) => setType(e.target.value as StockAdjustmentType)}
                        className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                    >
                        {adjustmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>

                <div>
                    <label htmlFor="quantityChange" className="block text-sm font-medium text-slate-700 mb-1">Quantity Change (+/-)</label>
                    <input
                        id="quantityChange"
                        type="number"
                        value={quantityChange}
                        onChange={(e) => setQuantityChange(parseInt(e.target.value, 10) || 0)}
                        className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                        placeholder="e.g. 10 or -5"
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">Reason / Note (Optional)</label>
                    <textarea
                        id="reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                        placeholder="e.g., Found extra stock during count"
                    />
                </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                    Cancel
                </button>
                <button type="submit" className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                    Adjust Stock
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;