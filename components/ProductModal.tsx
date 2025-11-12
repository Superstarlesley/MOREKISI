import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Category, Outlet } from '../types';
import { XIcon } from './Icons';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: Product) => void;
    productToEdit: Product | null;
    existingProducts: Product[];
    categories: Category[];
    outlets: Outlet[];
}

const ProductModal: React.FC<ProductModalProps> = ({
    isOpen, onClose, onSave, productToEdit, existingProducts, categories, outlets
}) => {
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getInitialState = () => {
        if (productToEdit) {
            return productToEdit;
        }
        return {
            id: Date.now(),
            name: '',
            sku: '',
            barcode: '',
            price: 0,
            cost: 0,
            imageUrl: 'https://storage.googleapis.com/aistudio-hosting/media/glob/1716335905187/303433_0.png',
            categoryId: categories[0]?.id || 0,
            stockLevels: outlets.map(o => ({ outletId: o.id, quantity: 0 })),
            lowStockThreshold: 10,
        };
    };
    
    const [product, setProduct] = useState<Product>(getInitialState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setProduct(getInitialState());
        setErrors({});
    }, [isOpen, productToEdit]);

    const validation = useMemo(() => {
        const isSkuUnique = !existingProducts.some(p => p.sku === product.sku && p.id !== product.id);
        const isBarcodeUnique = !product.barcode || !existingProducts.some(p => p.barcode === product.barcode && p.id !== product.id);
        
        const newErrors: Record<string, string> = {};
        if (!product.name) newErrors.name = 'Product name is required.';
        if (!product.sku) newErrors.sku = 'SKU is required.';
        if (!isSkuUnique) newErrors.sku = 'SKU must be unique.';
        if (!isBarcodeUnique) newErrors.barcode = 'Barcode must be unique.';
        if (product.price <= 0) newErrors.price = 'Selling price must be positive.';
        if (product.cost <= 0) newErrors.cost = 'Cost price must be positive.';

        return {
            isValid: Object.keys(newErrors).length === 0,
            errors: newErrors,
        };
    }, [product, existingProducts]);

    useEffect(() => {
        setErrors(validation.errors);
    }, [validation.errors]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProduct(prev => ({ ...prev, [name]: name === 'categoryId' || name === 'lowStockThreshold' || name === 'price' || name === 'cost' ? parseFloat(value) : value }));
    };

    const handleStockChange = (outletId: number, quantity: number) => {
        setProduct(prev => ({
            ...prev,
            stockLevels: prev.stockLevels.map(sl => sl.outletId === outletId ? { ...sl, quantity } : sl),
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please upload a JPEG, PNG, or WEBP image.');
            return;
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File is too large. Maximum size is 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProduct(prev => ({ ...prev, imageUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };
    
    const removeImage = () => {
        setProduct(prev => ({ ...prev, imageUrl: 'https://storage.googleapis.com/aistudio-hosting/media/glob/1716335905187/303433_0.png' }));
    };

    const generateUniqueId = (prefix: string, field: 'sku' | 'barcode') => {
        let id = '';
        let isUnique = false;
        while (!isUnique) {
            id = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
            isUnique = !existingProducts.some(p => p[field] === id);
        }
        return id;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validation.isValid) return;
        onSave(product);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[95vh]">
                <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name*</label>
                                <input type="text" name="name" value={product.name} onChange={handleChange} className="w-full form-input" />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU*</label>
                                    <div className="flex">
                                        <input type="text" name="sku" value={product.sku} onChange={handleChange} className="w-full form-input rounded-r-none"/>
                                        <button type="button" onClick={() => setProduct(p => ({...p, sku: generateUniqueId('SKU-', 'sku')}))} className="form-button rounded-l-none">Gen</button>
                                    </div>
                                    {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Barcode</label>
                                     <div className="flex">
                                        <input type="text" name="barcode" value={product.barcode} onChange={handleChange} className="w-full form-input rounded-r-none"/>
                                        <button type="button" onClick={() => setProduct(p => ({...p, barcode: generateUniqueId('', 'barcode')}))} className="form-button rounded-l-none">Gen</button>
                                     </div>
                                     {errors.barcode && <p className="text-xs text-red-500 mt-1">{errors.barcode}</p>}
                                </div>
                            </div>
                             <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                    <select name="categoryId" value={product.categoryId} onChange={handleChange} className="w-full form-input">
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Cost Price*</label>
                                    <input type="number" step="0.01" name="cost" value={product.cost} onChange={handleChange} className="w-full form-input"/>
                                    {errors.cost && <p className="text-xs text-red-500 mt-1">{errors.cost}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price*</label>
                                    <input type="number" step="0.01" name="price" value={product.price} onChange={handleChange} className="w-full form-input"/>
                                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                                </div>
                                 <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                                    <input type="number" name="lowStockThreshold" value={product.lowStockThreshold} onChange={handleChange} className="w-full form-input"/>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Image & Stock */}
                        <div className="md:col-span-1 space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-2">Product Image</h3>
                                <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border">
                                    <img src={product.imageUrl} alt={product.name || 'Product'} className="w-full h-full object-cover" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                />
                                <div className="flex space-x-2 mt-2">
                                    <button type="button" onClick={triggerFileInput} className="w-full text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-md py-1.5 hover:bg-slate-50 transition">
                                        Upload Image
                                    </button>
                                    <button type="button" onClick={removeImage} className="w-full text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-md py-1.5 hover:bg-red-100 transition">
                                        Remove
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1 text-center" title="Upload image from your device (JPEG, PNG, max 5MB)">JPEG, PNG, WEBP. Max 5MB.</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 mb-2">Initial Stock Levels</h3>
                                <div className="p-3 bg-slate-50 rounded-md border max-h-64 overflow-y-auto space-y-2">
                                    {outlets.map(outlet => {
                                        const stockLevel = product.stockLevels.find(sl => sl.outletId === outlet.id);
                                        return (
                                            <div key={outlet.id} className="grid grid-cols-2 items-center gap-2">
                                                <label className="text-sm text-slate-700 truncate">{outlet.name}</label>
                                                <input
                                                    type="number"
                                                    value={stockLevel?.quantity ?? 0}
                                                    onChange={(e) => handleStockChange(outlet.id, parseInt(e.target.value) || 0)}
                                                    className="w-full text-right form-input"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-4 border-t bg-slate-50 flex justify-end space-x-2 flex-shrink-0">
                        <style>{`
                            .form-input {
                                display: block;
                                width: 100%;
                                border-radius: 0.375rem;
                                border: 1px solid #d1d5db;
                                padding: 0.5rem 0.75rem;
                                font-size: 0.875rem;
                                line-height: 1.25rem;
                                transition: box-shadow 0.15s ease-in-out, border-color 0.15s ease-in-out;
                            }
                            .form-input:focus {
                                outline: none;
                                border-color: #3b82f6;
                                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
                            }
                             .form-button {
                                padding: 0.5rem 0.75rem;
                                background-color: #f3f4f6;
                                border: 1px solid #d1d5db;
                                border-left: 0;
                                color: #4b5563;
                                font-weight: 600;
                            }
                            .form-button:hover {
                                background-color: #e5e7eb;
                            }
                        `}</style>
                        <button type="button" onClick={onClose} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                            Cancel
                        </button>
                        <button type="submit" disabled={!validation.isValid} className="bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow disabled:bg-slate-400 disabled:cursor-not-allowed">
                            {productToEdit ? 'Save Changes' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;