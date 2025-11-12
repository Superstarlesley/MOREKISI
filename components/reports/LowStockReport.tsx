import React, { useMemo } from 'react';
import { Product, Outlet } from '../../types';

interface LowStockReportProps {
    products: Product[];
    outlets: Outlet[];
    filters: {
        outletId: number | 'all';
    };
}

const LowStockReport: React.FC<LowStockReportProps> = ({ products, outlets, filters }) => {
    const selectedOutletName = useMemo(() => {
        if (filters.outletId === 'all') return 'All Outlets';
        return outlets.find(o => o.id === filters.outletId)?.name || '';
    }, [filters.outletId, outlets]);
    
    const lowStockItems = useMemo(() => {
        if (filters.outletId === 'all') {
            // Logic for all outlets: find products low in *any* outlet
            const allLowStock = new Map<string, { product: Product, stockInfo: string }>();
            products.forEach(p => {
                p.stockLevels.forEach(sl => {
                    if (sl.quantity <= p.lowStockThreshold) {
                        const outletName = outlets.find(o => o.id === sl.outletId)?.name || `Outlet ${sl.outletId}`;
                        const key = `${p.id}-${sl.outletId}`;
                        allLowStock.set(key, { 
                            product: p, 
                            stockInfo: `${sl.quantity} in ${outletName} (Threshold: ${p.lowStockThreshold})`
                        });
                    }
                });
            });
            return Array.from(allLowStock.values());

        } else {
             // Logic for a single selected outlet
            return products
                .map(p => {
                    const stockLevel = p.stockLevels.find(sl => sl.outletId === filters.outletId);
                    return {
                        product: p,
                        stock: stockLevel ? stockLevel.quantity : 0,
                        threshold: p.lowStockThreshold
                    };
                })
                .filter(item => item.stock <= item.threshold);
        }
    }, [products, filters.outletId, outlets]);


    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-700 mb-1">Low Stock Report</h2>
            <p className="text-sm text-slate-500 mb-4">Showing items at or below threshold for: <span className="font-semibold">{selectedOutletName}</span></p>

            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                        <tr>
                            <th className="px-4 py-2">Product</th>
                            <th className="px-4 py-2">SKU</th>
                            {filters.outletId === 'all' ? (
                                <th className="px-4 py-2">Stock Details</th>
                            ) : (
                                <>
                                <th className="px-4 py-2 text-center">Current Stock</th>
                                <th className="px-4 py-2 text-center">Threshold</th>
                                <th className="px-4 py-2 text-center">Difference</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {filters.outletId !== 'all' ? (
                            (lowStockItems as {product: Product, stock: number, threshold: number}[]).map(({ product, stock, threshold }) => (
                                <tr key={product.id} className="border-b">
                                    <td className="px-4 py-2 font-medium text-slate-800">{product.name}</td>
                                    <td className="px-4 py-2 font-mono">{product.sku}</td>
                                    <td className="px-4 py-2 text-center font-bold text-amber-600">{stock}</td>
                                    <td className="px-4 py-2 text-center">{threshold}</td>
                                    <td className="px-4 py-2 text-center font-bold text-red-600">{stock - threshold}</td>
                                </tr>
                            ))
                        ) : (
                             (lowStockItems as {product: Product, stockInfo: string}[]).map(({ product, stockInfo }, index) => (
                                <tr key={`${product.id}-${index}`} className="border-b">
                                    <td className="px-4 py-2 font-medium text-slate-800">{product.name}</td>
                                    <td className="px-4 py-2 font-mono">{product.sku}</td>
                                    <td className="px-4 py-2 font-semibold text-amber-700">{stockInfo}</td>
                                </tr>
                             ))
                        )}
                        {lowStockItems.length === 0 && (
                            <tr>
                                <td colSpan={filters.outletId === 'all' ? 3 : 5} className="text-center p-8 text-slate-500">
                                    No low stock items for the selected outlet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LowStockReport;
