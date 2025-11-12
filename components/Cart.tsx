import React, { useMemo } from 'react';
import { CartItem, Customer, Shift, Tax } from '../types';
import CartItemComponent from './CartItem';
import { UserCircleIcon, TrashIcon } from './Icons';

interface CartProps {
  cart: CartItem[];
  customer: Customer | null;
  activeShift: Shift | null;
  taxes: Tax[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onSelectCustomer: () => void;
  onRemoveCustomer: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cart,
  customer,
  activeShift,
  taxes,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onSelectCustomer,
  onRemoveCustomer,
  onCheckout,
}) => {
  // FIX: Added explicit type for useMemo to resolve type inference issue.
  const { subtotal, taxBreakdown, total } = useMemo<{
    subtotal: number;
    taxBreakdown: Record<string, number>;
    total: number;
  }>(() => {
    let calculatedSubtotal = 0;
    const calculatedTaxBreakdown: Record<string, number> = {};
    const activeTaxes = taxes.filter(t => t.status === 'Active');

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      let itemSubtotal = itemTotal;

      // Find applicable tax
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
    const calculatedTotal = calculatedSubtotal + totalTax;

    return { subtotal: calculatedSubtotal, taxBreakdown: calculatedTaxBreakdown, total: calculatedTotal };
  }, [cart, taxes]);

  const canCheckout = activeShift !== null && cart.length > 0;

  const handleCheckoutClick = () => {
    if (!activeShift) {
        alert("You must start a shift to make sales.");
        return;
    }
    if (cart.length === 0) {
        alert("Cannot checkout with an empty cart.");
        return;
    }
    onCheckout();
  }

  return (
    <aside className="w-[380px] flex flex-col bg-white border-l border-slate-200">
      <div className="p-4 border-b">
        {customer ? (
          <div className="flex items-center justify-between p-2 bg-brand-blue-50 rounded-lg">
            <div className="flex items-center">
              <UserCircleIcon className="h-8 w-8 text-brand-blue-500 mr-3" />
              <div>
                <p className="font-semibold text-sm text-slate-800">{customer.name}</p>
                <p className="text-xs text-slate-500">{customer.phone}</p>
              </div>
            </div>
            <button onClick={onRemoveCustomer} className="text-red-500 hover:text-red-700 p-1">
                <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSelectCustomer}
            className="w-full flex items-center justify-center p-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-brand-blue-500 hover:text-brand-blue-600 transition"
          >
            <UserCircleIcon className="h-6 w-6 mr-2" />
            <span className="font-semibold">Select Customer</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {cart.length > 0 ? (
          cart.map((item) => (
            <CartItemComponent
              key={item.id}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <p>Cart is empty</p>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 bg-slate-50 border-t">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-medium">P {subtotal.toFixed(2)}</span>
            </div>
            {/* FIX: Use Object.keys to iterate over taxBreakdown to avoid type inference issues with Object.entries. */}
            {Object.keys(taxBreakdown).map((taxName) => (
                 <div className="flex justify-between" key={taxName}>
                    <span className="text-slate-600">{taxName}</span>
                    <span className="font-medium">P {taxBreakdown[taxName].toFixed(2)}</span>
                </div>
            ))}
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span className="text-slate-800">Total</span>
              <span className="text-brand-blue-600">P {total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClearCart}
              className="w-1/2 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition"
            >
              Clear
            </button>
            <button
              onClick={handleCheckoutClick}
              disabled={!canCheckout}
              title={!activeShift ? 'You must start a shift to make sales.' : cart.length === 0 ? 'Cart is empty.' : ''}
              className="w-full bg-brand-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-brand-blue-600 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Cart;
