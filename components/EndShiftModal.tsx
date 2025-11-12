import React, { useState, useMemo } from 'react';
import { XIcon } from './Icons';
import { Shift, SalesTransaction, CashflowTransaction } from '../types';

interface EndShiftModalProps {
  onClose: () => void;
  onEndShift: (actualCash: number, expectedCash: number, variance: number) => void;
  activeShift: Shift;
  salesTransactions: SalesTransaction[];
  cashflowTransactions: CashflowTransaction[];
}

const EndShiftModal: React.FC<EndShiftModalProps> = ({ onClose, onEndShift, activeShift, salesTransactions, cashflowTransactions }) => {
  const [actualCash, setActualCash] = useState<string>('');

  const shiftSummary = useMemo(() => {
    const shiftStart = new Date(activeShift.startTime);
    
    // NOTE: salesTransactions only has date, not time. For this demo, we'll assume all sales for the start day belong to the shift.
    // A real app would have timestamps on sales.
    const shiftSales = salesTransactions.filter(t => {
        const saleDate = new Date(t.date);
        return saleDate.toDateString() === shiftStart.toDateString() && t.outletId === activeShift.outletId && t.cashierId === activeShift.cashierId;
    });

    const shiftCashflow = cashflowTransactions.filter(t => {
        const transDate = new Date(t.dateTime);
        return transDate >= shiftStart && t.outletId === activeShift.outletId;
    });
    
    const totalSales = shiftSales.reduce((sum, t) => sum + t.totalAmount, 0);
    const cashSales = shiftSales.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + t.totalAmount, 0);
    const cardSales = shiftSales.filter(t => t.paymentMethod === 'card').reduce((sum, t) => sum + t.totalAmount, 0);
    const digitalSales = shiftSales.filter(t => t.paymentMethod === 'digital').reduce((sum, t) => sum + t.totalAmount, 0);
    
    const manualCashIn = shiftCashflow.filter(t => t.type === 'Cash In' && !t.source.startsWith('Sale')).reduce((sum, t) => sum + t.amount, 0);
    const manualCashOut = shiftCashflow.filter(t => t.type === 'Cash Out').reduce((sum, t) => sum + t.amount, 0);

    const expectedCash = activeShift.openingBalance + cashSales + manualCashIn - manualCashOut;
    
    return { totalSales, cashSales, cardSales, digitalSales, manualCashIn, manualCashOut, expectedCash };
  }, [activeShift, salesTransactions, cashflowTransactions]);
  
  const variance = useMemo(() => {
      const actual = parseFloat(actualCash);
      if(isNaN(actual)) return 0;
      return actual - shiftSummary.expectedCash;
  }, [actualCash, shiftSummary.expectedCash]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const actual = parseFloat(actualCash);
    if (isNaN(actual) || actual < 0) {
      alert("Please enter a valid cash amount.");
      return;
    }
    onEndShift(actual, shiftSummary.expectedCash, variance);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">End Shift Summary</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="p-6 flex-1 overflow-y-auto space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div><span className="font-semibold text-slate-600">Shift Started:</span> {new Date(activeShift.startTime).toLocaleString()}</div>
                    <div><span className="font-semibold text-slate-600">Cashier:</span> Lerato K.</div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold text-base mb-2">Sales Summary</h3>
                    <div className="space-y-1">
                        <div className="flex justify-between"><span className="text-slate-500">Total Sales:</span> <span className="font-semibold">P {shiftSummary.totalSales.toFixed(2)}</span></div>
                        <div className="flex justify-between pl-4"><span className="text-slate-500">Cash Sales:</span> <span className="font-semibold">P {shiftSummary.cashSales.toFixed(2)}</span></div>
                        <div className="flex justify-between pl-4"><span className="text-slate-500">Card Sales:</span> <span className="font-semibold">P {shiftSummary.cardSales.toFixed(2)}</span></div>
                        <div className="flex justify-between pl-4"><span className="text-slate-500">Digital Sales:</span> <span className="font-semibold">P {shiftSummary.digitalSales.toFixed(2)}</span></div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-bold text-base mb-2">Cash Drawer Summary</h3>
                    <div className="space-y-1">
                        <div className="flex justify-between"><span className="text-slate-500">Opening Balance:</span> <span className="font-semibold">P {activeShift.openingBalance.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">(+) Cash from Sales:</span> <span className="font-semibold text-green-600">+ P {shiftSummary.cashSales.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">(+) Manual Cash In:</span> <span className="font-semibold text-green-600">+ P {shiftSummary.manualCashIn.toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">(-) Manual Cash Out:</span> <span className="font-semibold text-red-600">- P {shiftSummary.manualCashOut.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold border-t pt-1 mt-1"><span className="text-slate-700">Expected Closing Cash:</span> <span>P {shiftSummary.expectedCash.toFixed(2)}</span></div>
                    </div>
                </div>

                <div className="border-t pt-4">
                    <label htmlFor="actualCash" className="block text-base font-bold text-slate-700 mb-1">Actual Closing Cash Count<span className="text-red-500">*</span></label>
                    <input
                        id="actualCash"
                        type="number"
                        step="0.01"
                        value={actualCash}
                        onChange={(e) => setActualCash(e.target.value)}
                        className="w-full text-lg font-bold bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                        placeholder="Enter final cash amount"
                        required
                    />
                     <div className={`flex justify-between font-bold text-lg mt-2 p-2 rounded-md ${variance === 0 ? 'bg-slate-100' : variance > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        <span>Variance:</span> 
                        <span>{variance >= 0 ? '+' : '-'} P {Math.abs(variance).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                    Cancel
                </button>
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition shadow">
                    End Shift & Logout
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EndShiftModal;