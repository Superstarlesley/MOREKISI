import React from 'react';
import { PaymentMethod, Outlet } from '../../types';
import { CashIcon, CreditCardIcon, QrCodeIcon, Wallet } from '../Icons';

interface PaymentMethodsSettingsProps {
    paymentMethods: PaymentMethod[];
    outlets: Outlet[];
    onSavePaymentMethod: (method: PaymentMethod) => void;
}

const getIconForMethod = (methodId: string) => {
    switch (methodId) {
        case 'cash': return <CashIcon className="h-6 w-6 text-green-600" />;
        case 'card': return <CreditCardIcon className="h-6 w-6 text-blue-600" />;
        case 'digital': return <QrCodeIcon className="h-6 w-6 text-purple-600" />;
        case 'bank_transfer': return <Wallet className="h-6 w-6 text-gray-600" />;
        default: return <Wallet className="h-6 w-6 text-gray-500" />;
    }
};

const PaymentMethodsSettings: React.FC<PaymentMethodsSettingsProps> = ({ paymentMethods, outlets, onSavePaymentMethod }) => {
    
    const handleStatusChange = (methodId: string, newStatus: 'Active' | 'Inactive') => {
        const method = paymentMethods.find(pm => pm.id === methodId);
        if (method) {
            onSavePaymentMethod({ ...method, status: newStatus });
        }
    };

    const handleOutletToggle = (methodId: string, outletId: number) => {
        const method = paymentMethods.find(pm => pm.id === methodId);
        if (method) {
            const newOutletIds = method.outletIds.includes(outletId)
                ? method.outletIds.filter(id => id !== outletId)
                : [...method.outletIds, outletId];
            onSavePaymentMethod({ ...method, outletIds: newOutletIds });
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Configure Payment Methods</h2>
            <div className="space-y-4">
                {paymentMethods.map(method => (
                    <div key={method.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {getIconForMethod(method.id)}
                                <span className="ml-3 font-bold text-lg text-slate-800">{method.name}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-2 text-sm font-medium text-slate-600">Status:</span>
                                <button
                                    onClick={() => handleStatusChange(method.id, method.status === 'Active' ? 'Inactive' : 'Active')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 ${
                                        method.status === 'Active' ? 'bg-brand-blue-600' : 'bg-gray-200'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            method.status === 'Active' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                        {method.status === 'Active' && (
                            <div className="mt-4 pt-4 border-t">
                                <h4 className="text-sm font-semibold text-slate-600 mb-2">Available in Outlets:</h4>
                                <div className="space-y-2">
                                    {outlets.length > 0 ? outlets.map(outlet => (
                                        <label key={outlet.id} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={method.outletIds.includes(outlet.id)}
                                                onChange={() => handleOutletToggle(method.id, outlet.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-brand-blue-600 focus:ring-brand-blue-500"
                                            />
                                            <span className="text-sm text-slate-800">{outlet.name}</span>
                                        </label>
                                    )) : <p className="text-sm text-slate-500">No outlets created yet. Go to 'Outlets' to add one.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentMethodsSettings;
