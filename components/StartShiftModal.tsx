import React, { useState } from 'react';
import { XIcon } from './Icons';

interface StartShiftModalProps {
  onClose: () => void;
  onStartShift: (openingBalance: number) => void;
  hasOutlets: boolean;
  firstOutletName: string;
}

const StartShiftModal: React.FC<StartShiftModalProps> = ({ onClose, onStartShift, hasOutlets, firstOutletName }) => {
  const [openingBalance, setOpeningBalance] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasOutlets) {
        alert("Please create an outlet in Settings before starting a shift.");
        return;
    }
    const balance = parseFloat(openingBalance);
    if (!isNaN(balance) && balance >= 0) {
      onStartShift(balance);
    } else {
        alert("Please enter a valid opening cash balance.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Start New Shift</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                 <div>
                    <p className="text-sm text-slate-600">Cashier: <span className="font-semibold">Jane Doe</span></p>
                    <p className="text-sm text-slate-600">Outlet: <span className="font-semibold">{hasOutlets ? firstOutletName : 'N/A'}</span></p>
                </div>
                {hasOutlets ? (
                <div>
                    <label htmlFor="openingBalance" className="block text-sm font-medium text-slate-700 mb-1">Opening Cash Balance<span className="text-red-500">*</span></label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">P</span>
                        </div>
                        <input
                            id="openingBalance"
                            type="number"
                            step="0.01"
                            value={openingBalance}
                            onChange={(e) => setOpeningBalance(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-md py-2 pl-7 pr-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                            placeholder="0.00"
                            required
                            autoFocus
                        />
                    </div>
                </div>
                ) : (
                    <div className="p-4 text-center bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm font-medium text-yellow-800">You must create an outlet in the settings menu before you can start a shift.</p>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                    Cancel
                </button>
                <button type="submit" disabled={!hasOutlets} className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow disabled:bg-slate-400 disabled:cursor-not-allowed">
                    Start Shift
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default StartShiftModal;
