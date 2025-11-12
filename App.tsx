import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SalesScreen from './screens/SalesScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProductsScreen from './screens/ProductsScreen';
import CustomersScreen from './screens/CustomersScreen';
import ReportsScreen from './screens/ReportsScreen';
import CashFlowScreen from './screens/CashFlowScreen';
import SettingsScreen from './screens/SettingsScreen';
import PurchasesScreen from './screens/PurchasesScreen';
import SuppliersScreen from './screens/SuppliersScreen';
import ExpensesScreen from './screens/ExpensesScreen';
import StartShiftModal from './components/StartShiftModal';
import EndShiftModal from './components/EndShiftModal';
import { useMockData } from './hooks/useMockData';
import { Shift, Product, SalesTransaction, CashflowTransaction, PurchaseOrder, StockAdjustment, CartItem, Customer, Category, Outlet, Supplier, User, Role, ExpenseDue, PaymentMethod, Tax } from './types';

export type ScreenName = 'dashboard' | 'sales' | 'inventory' | 'purchases' | 'suppliers' | 'customers' | 'reports' | 'cashflow' | 'settings' | 'expenses';

interface AppProps {
  onLogout: () => void;
}

const App: React.FC<AppProps> = ({ onLogout }) => {
  const mockData = useMockData();
  const [activeScreen, setActiveScreen] = useState<ScreenName>('dashboard');
  const [activeShift, setActiveShift] = useState<Shift | null>(null);
  const [isStartShiftModalOpen, setStartShiftModalOpen] = useState(false);
  const [isEndShiftModalOpen, setEndShiftModalOpen] = useState(false);
  
  // Centralized application state, initialized with mock data
  const [products, setProducts] = useState<Product[]>(mockData.products);
  const [categories, setCategories] = useState<Category[]>(mockData.categories);
  const [customers, setCustomers] = useState<Customer[]>(mockData.customers);
  const [outlets, setOutlets] = useState<Outlet[]>(mockData.outlets);
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockData.suppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockData.purchaseOrders);
  const [salesTransactions, setSalesTransactions] = useState<SalesTransaction[]>(mockData.salesTransactions);
  const [cashflowTransactions, setCashflowTransactions] = useState<CashflowTransaction[]>(mockData.cashflowTransactions);
  const [users, setUsers] = useState<User[]>(mockData.users);
  const [roles, setRoles] = useState<Role[]>(mockData.roles);
  const [expensesDues, setExpensesDues] = useState<ExpenseDue[]>(mockData.expensesDues);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockData.paymentMethods);
  const [taxes, setTaxes] = useState<Tax[]>(mockData.taxes);

  // --- CRUD Handlers ---

  const handleSaveProduct = (productData: Product) => {
      setProducts(prev => {
          const exists = prev.some(p => p.id === productData.id);
          if (exists) {
              return prev.map(p => p.id === productData.id ? productData : p);
          }
          return [productData, ...prev];
      });
  };
  
  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const handleStockAdjustment = (adjustment: StockAdjustment) => {
    setProducts(prevProducts => {
        return prevProducts.map(p => {
            if (p.id === adjustment.productId) {
                const newStockLevels = p.stockLevels.map(sl => {
                    if (sl.outletId === adjustment.outletId) {
                        return { ...sl, quantity: sl.quantity + adjustment.change };
                    }
                    return sl;
                });
                return { ...p, stockLevels: newStockLevels };
            }
            return p;
        });
    });
  };

  const handleSavePo = (po: PurchaseOrder) => {
    setPurchaseOrders(prevPOs => {
        const existing = prevPOs.find(p => p.id === po.id);
        if(existing) {
            return prevPOs.map(p => p.id === po.id ? po : p);
        }
        return [...prevPOs, po];
    });
  };

  const handleDeletePo = (poId: number) => {
      setPurchaseOrders(prev => prev.filter(p => p.id !== poId));
  };

  const handleReceiveStock = (poId: number, receivedItems: { productId: number, quantity: number }[]) => {
      const targetPo = purchaseOrders.find(p => p.id === poId);
      if (!targetPo) return;
      
      handleSavePo({ ...targetPo, status: 'Received' }); // Simplified status update

      setProducts(prevProducts => {
          const newProducts = [...prevProducts];
          receivedItems.forEach(received => {
              const productIndex = newProducts.findIndex(p => p.id === received.productId);
              if (productIndex !== -1) {
                  const stockLevelIndex = newProducts[productIndex].stockLevels.findIndex(sl => sl.outletId === targetPo.outletId);
                  if(stockLevelIndex !== -1) {
                      newProducts[productIndex].stockLevels[stockLevelIndex].quantity += received.quantity;
                  } else { // if stock level doesn't exist for this outlet, create it
                      newProducts[productIndex].stockLevels.push({ outletId: targetPo.outletId, quantity: received.quantity });
                  }
              }
          });
          return newProducts;
      });
  };
  
  const handleSaveCustomer = (customer: Omit<Customer, 'id'> & { id?: number }) => {
    setCustomers(prev => {
        if (customer.id) {
            return prev.map(c => c.id === customer.id ? customer as Customer : c);
        }
        const newCustomer: Customer = {
            ...customer,
            id: Date.now() + Math.random(),
        };
        return [...prev, newCustomer];
    });
  };
  
  const handleDeleteCustomer = (customerId: number) => {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
  }

  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id'> & { id?: number }) => {
    setSuppliers(prev => {
        if (supplierData.id) {
            return prev.map(s => s.id === supplierData.id ? supplierData as Supplier : s);
        }
        const newSupplier: Supplier = {
            ...supplierData,
            id: Date.now(),
        };
        return [newSupplier, ...prev];
    });
  };

  const handleDeleteSupplier = (supplierId: number) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  };

  const handleSaveExpenseDue = (item: Omit<ExpenseDue, 'id'> & { id?: number }) => {
    setExpensesDues(prev => {
      if (item.id) {
          return prev.map(i => i.id === item.id ? item as ExpenseDue : i);
      }
      const newItem: ExpenseDue = { ...item, id: Date.now() };
      return [newItem, ...prev];
    });
  };

  const handleDeleteExpenseDue = (itemId: number) => {
    setExpensesDues(prev => prev.filter(i => i.id !== itemId));
  };
  
  // --- SETTINGS HANDLERS ---
  const handleSaveOutlet = (outletData: Omit<Outlet, 'id'> & { id?: number }) => {
    setOutlets(prev => {
        if (outletData.id) {
            return prev.map(o => o.id === outletData.id ? outletData as Outlet : o);
        }
        const newOutlet: Outlet = { ...outletData, id: Date.now() };
        return [newOutlet, ...prev];
    });
  };

  const handleDeleteOutlet = (outletId: number) => {
    setOutlets(prev => prev.filter(o => o.id !== outletId));
  };

  const handleSaveUser = (userData: Omit<User, 'id'> & { id?: number }) => {
    setUsers(prev => {
        if (userData.id) {
            return prev.map(u => u.id === userData.id ? userData as User : u);
        }
        const newUser: User = {
            ...userData,
            id: Date.now(),
            lastLogin: 'Never',
        };
        return [newUser, ...prev];
    });
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'Inactive' } : u));
  };

  const handleSaveTax = (taxData: Omit<Tax, 'id'> & { id?: number }) => {
    setTaxes(prev => {
        if (taxData.id) {
            return prev.map(t => t.id === taxData.id ? taxData as Tax : t);
        }
        const newTax: Tax = { ...taxData, id: Date.now() };
        return [newTax, ...prev];
    });
  };

  const handleDeleteTax = (taxId: number) => {
    setTaxes(prev => prev.filter(t => t.id !== taxId));
  };

  const handleSaveCategory = (categoryData: Category) => {
    setCategories(prev => {
        if (categoryData.id) {
            return prev.map(c => c.id === categoryData.id ? categoryData : c);
        }
        const newCategory: Category = { ...categoryData, id: Date.now() };
        return [newCategory, ...prev];
    });
  };

  const handleDeleteCategory = (categoryId: number) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const handleSavePaymentMethod = (methodData: PaymentMethod) => {
    setPaymentMethods(prev => prev.map(pm => pm.id === methodData.id ? methodData : pm));
  };

  const handleSaveRole = (roleName: Role) => {
    setRoles(prev => {
        if (!prev.includes(roleName)) {
            return [...prev, roleName];
        }
        return prev;
    });
  };

  const handleDeleteRole = (roleName: Role) => {
    setRoles(prev => prev.filter(r => r !== roleName));
  };
  
  // --- SHIFT & SALES ---
  const handleStartShift = (openingBalance: number) => {
    if (outlets.length === 0) {
        alert("Please create an outlet in Settings before starting a shift.");
        return;
    }
    const newShift: Shift = {
        id: Date.now(),
        cashierId: 3, // hardcode user Lerato K.
        outletId: outlets[0].id, // Use first available outlet
        startTime: new Date().toISOString(),
        openingBalance,
        endTime: null,
        closingBalance: null,
        actualCash: null,
        variance: null,
        status: 'Active',
    };
    setActiveShift(newShift);
    setStartShiftModalOpen(false);
  };
  
  const handleEndShift = (actualCash: number, expectedCash: number, variance: number) => {
     if (!activeShift) return;
     const endedShift: Shift = {
         ...activeShift,
         endTime: new Date().toISOString(),
         closingBalance: expectedCash,
         actualCash,
         variance,
         status: 'Closed',
     };
     setActiveShift(null);
     setEndShiftModalOpen(false);
  };

  const handleCompleteSale = (cart: CartItem[], customer: Customer | null, paymentMethod: string, total: number) => {
    if (!activeShift) return;
    const newSale: SalesTransaction = {
      id: Date.now(),
      outletId: activeShift.outletId,
      date: new Date().toISOString().split('T')[0],
      totalAmount: total,
      paymentMethod,
      cashierId: activeShift.cashierId,
      customerId: customer?.id,
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
    };
    setSalesTransactions(prev => [newSale, ...prev]);

    if (paymentMethod === 'cash') {
      const newCashflow: CashflowTransaction = {
        id: Date.now() + 1,
        outletId: activeShift.outletId,
        dateTime: new Date().toISOString(),
        type: 'Cash In',
        source: `Sale #${newSale.id}`,
        amount: total,
        user: 'System',
      };
      setCashflowTransactions(prev => [newCashflow, ...prev]);
    }

    setProducts(prevProducts => {
      const updatedProducts = [...prevProducts];
      cart.forEach(cartItem => {
        const productIndex = updatedProducts.findIndex(p => p.id === cartItem.id);
        if (productIndex > -1) {
          const stockLevelIndex = updatedProducts[productIndex].stockLevels.findIndex(sl => sl.outletId === activeShift.outletId);
          if (stockLevelIndex > -1) {
            updatedProducts[productIndex].stockLevels[stockLevelIndex].quantity -= cartItem.quantity;
          }
        }
      });
      return updatedProducts;
    });

    alert('Transaction completed successfully!');
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <DashboardScreen 
                    salesTransactions={salesTransactions}
                    products={products}
                    purchaseOrders={purchaseOrders}
                    categories={categories}
                    outlets={outlets}
                    onNavigate={setActiveScreen}
                />;
      case 'sales':
        return <SalesScreen 
                    activeShift={activeShift} 
                    products={products}
                    categories={categories}
                    customers={customers}
                    paymentMethods={paymentMethods}
                    taxes={taxes}
                    onCompleteSale={handleCompleteSale}
                />;
      case 'inventory':
        return <ProductsScreen 
                    products={products}
                    categories={categories}
                    outlets={outlets}
                    onStockAdjustment={handleStockAdjustment}
                    onSaveProduct={handleSaveProduct}
                    onDeleteProduct={handleDeleteProduct}
                />;
      case 'purchases':
        return <PurchasesScreen 
                    products={products}
                    purchaseOrders={purchaseOrders}
                    suppliers={suppliers}
                    outlets={outlets}
                    onSavePo={handleSavePo}
                    onDeletePo={handleDeletePo}
                    onReceiveStock={handleReceiveStock}
                />;
      case 'expenses':
        return <ExpensesScreen 
                  expensesDues={expensesDues}
                  onSave={handleSaveExpenseDue}
                  onDelete={handleDeleteExpenseDue}
                  outlets={outlets}
                />;
      case 'suppliers':
        return <SuppliersScreen
                  suppliers={suppliers}
                  onSave={handleSaveSupplier}
                  onDelete={handleDeleteSupplier}
                />;
      case 'customers':
        return <CustomersScreen 
                  customers={customers}
                  outlets={outlets}
                  onSave={handleSaveCustomer}
                  onDelete={handleDeleteCustomer}
                />;
      case 'reports':
        return <ReportsScreen 
                  salesTransactions={salesTransactions}
                  products={products}
                  categories={categories}
                  outlets={outlets}
                />;
       case 'cashflow':
        return <CashFlowScreen 
                    cashflowTransactions={cashflowTransactions}
                    setCashflowTransactions={setCashflowTransactions}
                    outlets={outlets}
                />;
      case 'settings':
        return <SettingsScreen 
                  users={users}
                  onSaveUser={handleSaveUser}
                  onDeleteUser={handleDeleteUser}
                  outlets={outlets}
                  onSaveOutlet={handleSaveOutlet}
                  onDeleteOutlet={handleDeleteOutlet}
                  roles={roles}
                  onSaveRole={handleSaveRole}
                  onDeleteRole={handleDeleteRole}
                  categories={categories}
                  onSaveCategory={handleSaveCategory}
                  onDeleteCategory={handleDeleteCategory}
                  paymentMethods={paymentMethods}
                  onSavePaymentMethod={handleSavePaymentMethod}
                  taxes={taxes}
                  onSaveTax={handleSaveTax}
                  onDeleteTax={handleDeleteTax}
                />;
      default:
        return <DashboardScreen 
                    salesTransactions={salesTransactions}
                    products={products}
                    purchaseOrders={purchaseOrders}
                    categories={categories}
                    outlets={outlets}
                    onNavigate={setActiveScreen}
                />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar activeScreen={activeScreen} onNavigate={setActiveScreen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
            onLogout={onLogout}
            activeShift={activeShift}
            onStartShift={() => setStartShiftModalOpen(true)}
            onEndShift={() => setEndShiftModalOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
       {isStartShiftModalOpen && (
        <StartShiftModal
            onClose={() => setStartShiftModalOpen(false)}
            onStartShift={handleStartShift}
            hasOutlets={outlets.length > 0}
            firstOutletName={outlets.length > 0 ? outlets[0].name : ''}
        />
      )}
      {isEndShiftModalOpen && activeShift && (
          <EndShiftModal
            onClose={() => setEndShiftModalOpen(false)}
            onEndShift={handleEndShift}
            activeShift={activeShift}
            salesTransactions={salesTransactions}
            cashflowTransactions={cashflowTransactions}
          />
      )}
    </div>
  );
};

export default App;
