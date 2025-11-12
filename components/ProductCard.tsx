import React from 'react';
import { Product } from '../types';
import { PlusIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group relative flex flex-col rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">SKU: {product.sku}</p>
        </div>
        <div className="flex justify-between items-center mt-2">
            <p className="text-base font-bold text-slate-900">P {product.price.toFixed(2)}</p>
            <button
                onClick={() => onAddToCart(product)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-blue-500 text-white hover:bg-brand-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 z-10"
                aria-label={`Add ${product.name} to cart`}
            >
                <PlusIcon className="h-5 w-5" />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
