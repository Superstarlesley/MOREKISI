import React, { useState, useMemo, useCallback } from 'react';
import { Product, StockAdjustment, Category, Outlet } from '../types';
import StockAdjustmentModal from '../components/StockAdjustmentModal';
import ProductModal from '../components/ProductModal';
import { SearchIcon, FilterIcon, FileUpIcon, FileDownIcon, PlusIcon, PencilIcon, TrashIcon, HistoryIcon } from '../components/Icons';
import ConfirmationModal from '../components/ConfirmationModal';

interface ProductsScreenProps {
  products: Product[];
  categories: Category[];
  outlets: Outlet[];
  onStockAdjustment: (adjustment: StockAdjustment) => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

const ProductsScreen: React.FC<ProductsScreenProps> = ({ products, categories, outlets, onStockAdjustment, onSaveProduct, onDeleteProduct }) => {
  const [selectedOutletId, setSelectedOutletId] = useState<number>(outlets[0]?.id || 0);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  React.useEffect(() => {
    if (outlets.length > 0 && !outlets.some(o => o.id === selectedOutletId)) {
        setSelectedOutletId(outlets[0].id);
    } else if (outlets.length === 0) {
        setSelectedOutletId(0);
    }
  }, [outlets, selectedOutletId]);


  const handleOpenAdjustmentModal = useCallback((product: Product) => {
    setProductToAdjust(product);
    setIsAdjustmentModalOpen(true);
  }, []);

  const handleCloseAdjustmentModal = () => {
    setProductToAdjust(null);
    setIsAdjustmentModalOpen(false);
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const getStockForOutlet = (product: Product, outletId: number) => {
    return product.stockLevels.find(s => s.outletId === outletId)?.quantity ?? 0;
  };

  const getStockStatus = (product: Product, outletId: number) => {
    const quantity = getStockForOutlet(product, outletId);
    if (quantity <= 0) return { label: 'Out', color: 'bg-red-500', textColor: 'text-red-800', bgColor: 'bg-red-100' };
    if (quantity <= product.lowStockThreshold) return { label: 'Low', color: 'bg-amber-500', textColor: 'text-amber-800', bgColor: 'bg-amber-100' };
    return { label: 'In Stock', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100' };
  };

  const handleOpenProductModal = (product: Product | null) => {
    if (categories.length === 0 || outlets.length === 0) {
        alert("Please create at least one Category and one Outlet in Settings before adding a product.");
        return;
    }
    setProductToEdit(product);
    setIsProductModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setProductToEdit(null);
    setIsProductModalOpen(false);
  };

  const renderContent = () => {
    if (products.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-2xl font-semibold">Your inventory is empty</h2>
                <p className="mt-2">Click the "Add Product" button to start building your catalog.</p>
            </div>
        )
    }
    return (
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-100 sticky top-0">
                <tr>
                    <th scope="col" className="p-4 w-16"></th>
                    <th scope="col" className="px-6 py-3">Product Name</th>
                    <th scope="col" className="px-6 py-3">SKU</th>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3 text-right">Price</th>
                    <th scope="col" className="px-6 py-3 text-right">Cost</th>
                    <th scope="col" className="px-6 py-3 text-center">Stock Level</th>
                    <th scope="col" className="px-6 py-3 text-center">Threshold</th>
                    <th scope="col" className="px-6 py-3 text-center">Status</th>
                    <th scope="col" className="px-6 py-3 text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.map(product => {
                    const stock = getStockForOutlet(product, selectedOutletId);
                    const status = getStockStatus(product, selectedOutletId);
                    const category = categories.find(c => c.id === product.categoryId)?.name;
                    return (
                        <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                            <td className="p-2">
                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-md object-cover" />
                            </td>
                            <td className="px-6 py-4 font-semibold text-slate-900">{product.name}</td>
                            <td className="px-6 py-4 font-mono">{product.sku}</td>
                            <td className="px-6 py-4">{category}</td>
                            <td className="px-6 py-4 font-medium text-right">P {product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 font-medium text-right">P {product.cost.toFixed(2)}</td>
                            <td 
                                className="px-6 py-4 font-bold text-lg text-slate-800 text-center cursor-pointer hover:text-brand-blue-600"
                                onClick={() => handleOpenAdjustmentModal(product)}
                            >
                                {stock}
                            </td>
                            <td className="px-6 py-4 text-center">{product.lowStockThreshold}</td>
                            <td className="px-6 py-4 text-center">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${status.bgColor} ${status.textColor}`}>
                                    <span className={`w-2 h-2 mr-1.5 rounded-full ${status.color}`}></span>
                                    {status.label}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                                <div className="flex justify-center items-center space-x-2">
                                    <button onClick={() => handleOpenProductModal(product)} className="p-1 text-slate-500 hover:text-brand-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                    <button className="p-1 text-slate-500 hover:text-slate-800"><HistoryIcon className="h-5 w-5"/></button>
                                    <button onClick={() => setProductToDelete(product)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
    <div className="flex flex-col h-full bg-slate-50 p-6">
      {/* Header */}
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Products & Inventory</h1>
        <div className="flex items-center space-x-2">
            <button className="flex items-center bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                <FileUpIcon className="h-4 w-4 mr-2"/> Import
            </button>
            <button className="flex items-center bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-100 transition">
                <FileDownIcon className="h-4 w-4 mr-2"/> Export
            </button>
            <button 
              onClick={() => handleOpenProductModal(null)}
              className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow">
                <PlusIcon className="h-4 w-4 mr-2"/> Add Product
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm mb-6 border border-slate-200">
        <div className="flex-1">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    placeholder="Search by product name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-100 border border-transparent rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
                />
            </div>
        </div>
        <select 
            className="bg-slate-100 border-transparent rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition font-medium text-slate-700"
            value={selectedOutletId}
            onChange={(e) => setSelectedOutletId(Number(e.target.value))}
            disabled={outlets.length === 0}
        >
          {outlets.length > 0 ? outlets.map(outlet => <option key={outlet.id} value={outlet.id}>{outlet.name}</option>) : <option>No outlets</option>}
        </select>
        <button className="flex items-center text-slate-600 font-medium p-2 rounded-lg hover:bg-slate-100 transition">
            <FilterIcon className="h-5 w-5 mr-2" />
            Filters
        </button>
      </div>
        {renderContent()}
    </div>
    {isAdjustmentModalOpen && productToAdjust && selectedOutletId > 0 && (
        <StockAdjustmentModal
            product={productToAdjust}
            outlet={outlets.find(o => o.id === selectedOutletId)!}
            onClose={handleCloseAdjustmentModal}
            onAdjust={onStockAdjustment}
        />
    )}
     {isProductModalOpen && (
        <ProductModal
            isOpen={isProductModalOpen}
            onClose={handleCloseProductModal}
            onSave={onSaveProduct}
            productToEdit={productToEdit}
            existingProducts={products}
            categories={categories}
            outlets={outlets}
        />
    )}
    {productToDelete && (
        <ConfirmationModal
            isOpen={!!productToDelete}
            onClose={() => setProductToDelete(null)}
            onConfirm={() => onDeleteProduct(productToDelete.id)}
            title="Delete Product"
            message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
        />
    )}
    </>
  );
};

export default ProductsScreen;
