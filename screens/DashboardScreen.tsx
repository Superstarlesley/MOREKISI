import React, { useState, useMemo } from 'react';
import { SalesTransaction, Product, PurchaseOrder, Category, Outlet } from '../types';
import { ShoppingCart, BarChart, Package, TrendingUp, Archive, Truck, Star } from '../components/Icons';
import DashboardCard from '../components/DashboardCard';

type ScreenName = 'dashboard' | 'sales' | 'inventory' | 'purchases' | 'suppliers' | 'customers' | 'reports' | 'cashflow' | 'settings' | 'expenses';

type DateRangeOption = 'today' | 'week' | 'month';

interface DashboardScreenProps {
    salesTransactions: SalesTransaction[];
    products: Product[];
    purchaseOrders: PurchaseOrder[];
    categories: Category[];
    outlets: Outlet[];
    onNavigate: (screen: ScreenName) => void;
}

const getFilteredSales = (sales: SalesTransaction[], range: DateRangeOption): SalesTransaction[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    let startDate: Date;

    switch (range) {
        case 'week':
            startDate = new Date(today);
            startDate.setDate(today.getDate() - today.getDay()); // Start of the week (Sunday)
            break;
        case 'month':
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            break;
        case 'today':
        default:
            startDate = today;
            break;
    }

    return sales.filter(s => new Date(s.date) >= startDate);
};

// --- Chart Components ---
const SalesBarChart: React.FC<{ sales: SalesTransaction[] }> = ({ sales }) => {
    const salesByDay = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d;
        }).reverse();

        const data = last7Days.map(day => {
            const dayString = day.toISOString().split('T')[0];
            const total = sales
                .filter(s => s.date === dayString)
                .reduce((sum, s) => sum + s.totalAmount, 0);
            return {
                label: day.toLocaleDateString('en-US', { weekday: 'short' }),
                value: total,
            };
        });
        
        const maxValue = Math.max(...data.map(d => d.value));
        return { data, maxValue: maxValue > 0 ? maxValue : 1 }; // Avoid division by zero
    }, [sales]);

    return (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Sales (Last 7 Days)</h3>
            <div className="flex-1 flex items-end justify-around space-x-2">
                {salesByDay.data.map((day, i) => (
                    <div key={i} className="flex flex-col items-center flex-1">
                        <div className="relative group w-full h-full flex items-end">
                             <div 
                                className="w-full bg-brand-blue-200 rounded-t-md hover:bg-brand-blue-400 transition-colors"
                                style={{ height: `${(day.value / salesByDay.maxValue) * 100}%` }}
                            >
                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                    P{day.value.toFixed(0)}
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500 mt-2">{day.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryPerformanceChart: React.FC<{ sales: SalesTransaction[], products: Product[], categories: Category[] }> = ({ sales, products, categories }) => {
    const categorySales = useMemo(() => {
        const salesMap = new Map<number, { name: string; value: number }>();
        categories.forEach(c => salesMap.set(c.id, { name: c.name, value: 0 }));

        sales.forEach(sale => {
            sale.items.forEach(item => {
                const product = products.find(p => p.id === item.productId);
                if (product && salesMap.has(product.categoryId)) {
                    const existing = salesMap.get(product.categoryId)!;
                    existing.value += item.price * item.quantity;
                }
            });
        });
        
        const data = Array.from(salesMap.values()).filter(c => c.value > 0).sort((a,b) => b.value - a.value).slice(0, 5);
        const maxValue = Math.max(...data.map(d => d.value));
        return { data, maxValue: maxValue > 0 ? maxValue : 1 };
    }, [sales, products, categories]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Top Categories</h3>
            <div className="flex-1 space-y-3">
                 {categorySales.data.length > 0 ? categorySales.data.map(cat => (
                    <div key={cat.name} className="flex items-center text-sm">
                        <span className="w-1/3 font-medium text-slate-600 truncate">{cat.name}</span>
                        <div className="w-2/3 flex items-center">
                            <div className="flex-1 bg-slate-200 rounded-full h-2.5 mx-2">
                                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${(cat.value / categorySales.maxValue) * 100}%`}}></div>
                            </div>
                            <span className="w-20 text-right font-semibold text-slate-700">P{cat.value.toFixed(0)}</span>
                        </div>
                    </div>
                 )) : (
                    <div className="h-full flex items-center justify-center text-slate-500">
                        <p>No sales data for categories.</p>
                    </div>
                 )}
            </div>
        </div>
    );
};


// --- Main Dashboard Component ---
const DashboardScreen: React.FC<DashboardScreenProps> = ({ salesTransactions, products, purchaseOrders, categories, onNavigate }) => {
    const [dateRange, setDateRange] = useState<DateRangeOption>('today');
    
    const salesForPeriod = useMemo(() => getFilteredSales(salesTransactions, dateRange), [salesTransactions, dateRange]);

    // --- Metric Calculations ---
    const totalSales = useMemo(() => salesForPeriod.reduce((sum, s) => sum + s.totalAmount, 0), [salesForPeriod]);
    
    const transactionCount = salesForPeriod.length;

    const grossProfit = useMemo(() => {
        const totalCost = salesForPeriod.reduce((costSum, sale) => {
            const saleCost = sale.items.reduce((itemCostSum, item) => {
                const product = products.find(p => p.id === item.productId);
                return itemCostSum + (product ? product.cost * item.quantity : 0);
            }, 0);
            return costSum + saleCost;
        }, 0);
        return totalSales - totalCost;
    }, [salesForPeriod, products, totalSales]);

    const topSellingProduct = useMemo(() => {
        if (salesForPeriod.length === 0) return null;
        const itemQuantities = new Map<number, number>();
        salesForPeriod.forEach(s => {
            s.items.forEach(i => {
                itemQuantities.set(i.productId, (itemQuantities.get(i.productId) || 0) + i.quantity);
            });
        });
        if (itemQuantities.size === 0) return null;
        const topProductId = [...itemQuantities.entries()].sort((a, b) => b[1] - a[1])[0][0];
        const product = products.find(p => p.id === topProductId);
        return product ? `${product.name} (${itemQuantities.get(topProductId)} sold)` : 'N/A';
    }, [salesForPeriod, products]);
    
    // --- Global Metrics (not date-filtered) ---
    const lowStockCount = useMemo(() => {
        const lowStockProducts = new Set<number>();
        products.forEach(p => {
            p.stockLevels.forEach(sl => {
                if (sl.quantity <= p.lowStockThreshold) {
                    lowStockProducts.add(p.id);
                }
            });
        });
        return lowStockProducts.size;
    }, [products]);
    
    const totalStockValue = useMemo(() => products.reduce((sum, p) => {
        const productValue = p.stockLevels.reduce((pSum, sl) => pSum + (p.cost * sl.quantity), 0);
        return sum + productValue;
    }, 0), [products]);

    const pendingPoCount = purchaseOrders.filter(po => po.status === 'Sent' || po.status === 'Partially Received').length;

  return (
    <div className="p-6 bg-slate-50 flex-1 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
            <p className="mt-1 text-slate-600">Overview of your business performance.</p>
        </div>
        <div>
            <div className="flex items-center bg-white p-1 rounded-lg shadow-sm border">
                 {(['today', 'week', 'month'] as DateRangeOption[]).map(range => (
                    <button 
                        key={range}
                        onClick={() => setDateRange(range)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                            dateRange === range 
                            ? 'bg-brand-blue-500 text-white shadow' 
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                       {range.charAt(0).toUpperCase() + range.slice(1)}
                    </button>
                 ))}
            </div>
        </div>
      </div>
      
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <DashboardCard
            icon={<ShoppingCart className="text-green-500"/>}
            title={`Sales (${dateRange})`}
            value={`P ${totalSales.toFixed(2)}`}
            description={`${transactionCount} transactions`}
        />
         <DashboardCard
            icon={<TrendingUp className="text-cyan-500"/>}
            title={`Gross Profit (${dateRange})`}
            value={`P ${grossProfit.toFixed(2)}`}
            description={`${totalSales > 0 ? ((grossProfit / totalSales) * 100).toFixed(1) : 0}% margin`}
        />
        <DashboardCard
            icon={<Star className="text-amber-500"/>}
            title={`Top Product (${dateRange})`}
            value={topSellingProduct || 'No sales'}
            description="Most units sold"
        />
        <DashboardCard
            icon={<Package className="text-red-500"/>}
            title="Low Stock Items"
            value={`${lowStockCount} Products`}
            description="At or below threshold"
            onClick={() => onNavigate('inventory')}
        />
      </div>
      
      {/* Charts & Global Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
             <SalesBarChart sales={salesTransactions} />
             <CategoryPerformanceChart sales={salesForPeriod} products={products} categories={categories} />
          </div>
          <div className="space-y-6">
               <DashboardCard
                    icon={<Archive className="text-indigo-500"/>}
                    title="Total Stock Value"
                    value={`P ${totalStockValue.toFixed(2)}`}
                    description="Based on cost price"
                />
                 <DashboardCard
                    icon={<Truck className="text-orange-500"/>}
                    title="Pending Purchase Orders"
                    value={`${pendingPoCount} Orders`}
                    description="Awaiting delivery"
                    onClick={() => onNavigate('purchases')}
                />
          </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
