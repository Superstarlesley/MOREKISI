import React, { useMemo, useState } from 'react';
import { CartItem, Customer, PaymentMethod, Tax } from '../types';
import { XIcon, CashIcon, CreditCardIcon, QrCodeIcon, ReceiptIcon, Wallet } from './Icons';

interface PaymentModalProps {
  cart: CartItem[];
  customer: Customer | null;
  onClose: () => void;
  onCompleteSale: (paymentMethodId: string, total: number) => void;
  paymentMethods: PaymentMethod[];
  outletId: number;
  taxes: Tax[];
}

const PaymentModal: React.FC<PaymentModalProps> = ({ cart, customer, onClose, onCompleteSale, paymentMethods, outletId, taxes }) => {
  const [paymentType, setPaymentType] = useState<string | null>(null);

  const { total } = useMemo(() => {
    let calculatedSubtotal = 0;
    const calculatedTaxBreakdown: Record<string, number> = {};
    const activeTaxes = taxes.filter(t => t.status === 'Active');

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      let itemSubtotal = itemTotal;
      
      const applicableTax = activeTaxes.find(tax => 
        tax.applyTo === 'all' || 
        (tax.applyTo === 'categories' && tax.categoryIds.includes(item.categoryId))
      );

      if (applicableTax) {
        const taxKey = `${applicableTax.name} (${applicableTax.rate}%)`;
        if (!calculatedTaxBreakdown[taxKey]) {
          calculatedTaxBreakdown[taxKey] = 0;
        }

        if (applicableTax.type === 'inclusive') {
          const taxRate = applicableTax.rate / 100;
          const basePrice = itemTotal / (1 + taxRate);
          const taxAmount = itemTotal - basePrice;
          itemSubtotal = basePrice;
          calculatedTaxBreakdown[taxKey] += taxAmount;
        } else { // exclusive
          const taxRate = applicableTax.rate / 100;
          const taxAmount = itemSubtotal * taxRate;
          calculatedTaxBreakdown[taxKey] += taxAmount;
        }
      }
      calculatedSubtotal += itemSubtotal;
    });

    const totalTax = Object.values(calculatedTaxBreakdown).reduce((sum, amount) => sum + amount, 0);
    return { total: calculatedSubtotal + totalTax };
  }, [cart, taxes]);

  const availablePaymentMethods = useMemo(() => {
    if (!paymentMethods) return [];
    return paymentMethods
        .filter(pm => pm.status === 'Active' && pm.outletIds.includes(outletId))
        .map(pm => {
            let icon;
            switch(pm.id) {
                case 'cash': icon = <CashIcon className="h-8 w-8" />; break;
                case 'card': icon = <CreditCardIcon className="h-8 w-8" />; break;
                case 'digital': icon = <QrCodeIcon className="h-8 w-8" />; break;
                default: icon = <Wallet className="h-8 w-8" />;
            }
            return { ...pm, icon };
        });
  }, [paymentMethods, outletId]);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div className="p-5 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-2xl font-bold text-slate-800">Checkout</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition">
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex">
          {/* Left Panel: Total & Payment Methods */}
          <div className="w-1/2 p-6 border-r">
            <div className="text-center mb-6">
              <p className="text-lg text-slate-600">Amount Due</p>
              <p className="text-5xl font-extrabold text-brand-blue-700 tracking-tight">P {total.toFixed(2)}</p>
            </div>
            
            <div className="space-y-3">
                {availablePaymentMethods.length > 0 ? availablePaymentMethods.map(method => (
                    <button
                        key={method.id}
                        onClick={() => setPaymentType(method.id as any)}
                        className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                            paymentType === method.id 
                            ? 'bg-brand-blue-50 border-brand-blue-500 ring-2 ring-brand-blue-200' 
                            : 'border-slate-200 hover:border-brand-blue-300'
                        }`}
                    >
                        {method.icon}
                        <span className="ml-4 font-semibold text-lg">{method.name}</span>
                    </button>
                )) : <p className="text-center text-sm text-slate-500">No payment methods configured for this outlet.</p>}
            </div>
          </div>

          {/* Right Panel: Action */}
          <div className="w-1/2 p-6 flex flex-col items-center justify-center bg-slate-50">
            {paymentType ? (
                 <div className="text-center w-full">
                    <h3 className="text-xl font-bold mb-4">Finalize Sale</h3>
                     <p className="text-slate-600 mb-6">Confirm payment of <span className="font-bold">P {total.toFixed(2)}</span> via <span className="font-bold capitalize">{paymentMethods.find(p=>p.id === paymentType)?.name}</span>.</p>
                     
                     <div className="mb-6 space-y-2">
                         <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                             <label htmlFor="printReceipt" className="font-medium flex items-center space-x-2">
                                <ReceiptIcon className="h-5 w-5 text-slate-500"/>
                                <span>Print Receipt</span>
                            </label>
                             <input type="checkbox" id="printReceipt" defaultChecked className="h-5 w-5 rounded text-brand-blue-600 focus:ring-brand-blue-500 border-slate-300"/>
                         </div>
                          <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
                             <label htmlFor="emailReceipt" className="font-medium flex items-center space-x-2">
                                <span>📧</span>
                                <span>Email Receipt</span>
                            </label>
                             <input type="checkbox" id="emailReceipt" className="h-5 w-5 rounded text-brand-blue-600 focus:ring-brand-blue-500 border-slate-300"/>
                         </div>
                     </div>

                     <button 
                        onClick={() => onCompleteSale(paymentType, total)}
                        className="w-full bg-green-500 text-white rounded-lg py-4 text-xl font-bold hover:bg-green-600 transition shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105"
                     >
                        Complete Sale
                     </button>
                 </div>
            ) : (
                <div className="text-center text-slate-500">
                    <p className="font-semibold">Select a payment method to continue.</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
