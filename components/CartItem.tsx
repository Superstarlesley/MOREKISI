
import React from 'react';
import { CartItem } from '../types';
// FIX: Corrected import path for Icons to be relative.
import { PlusIcon, MinusIcon, TrashIcon } from './Icons';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemoveItem }) => {
  return (
    <div className="flex items-center p-4 hover:bg-slate-50 transition-colors">
      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
      <div className="flex-1">
        <p className="font-semibold text-sm text-slate-800">{item.name}</p>
        <p className="text-xs text-slate-500">P {item.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
            className="p-1 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
          >
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            className="p-1 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="font-bold text-slate-800">P {(item.price * item.quantity).toFixed(2)}</p>
        <button onClick={() => onRemoveItem(item.id)} className="text-red-500 hover:text-red-700 mt-2">
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItemComponent;