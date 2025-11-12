import React, { useState, useMemo } from 'react';
import CategoryTabs from '../components/CategoryTabs';
import ProductGrid from '../components/ProductGrid';
import Cart from '../components/Cart';
import CustomerSelectModal from '../components/CustomerSelectModal';
import PaymentModal from '../components/PaymentModal';
import { Product, CartItem, Customer, Shift, Category, PaymentMethod, Tax } from '../types';

interface SalesScreenProps {
  activeShift: Shift | null;
  products: Product[];
  categories: Category[];
  customers: Customer[];
  paymentMethods: PaymentMethod[];
  taxes: Tax[];
  onCompleteSale: (cart: CartItem[], customer: Customer | null, paymentMethod: string, total: number) => void;
}

const SalesScreen: React.FC<SalesScreenProps> = ({ activeShift, products, categories, customers, paymentMethods, taxes, onCompleteSale }) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number>(categories[0]?.id || 0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // If a new category is added, make it the active one
  React.useEffect(() => {
    if (categories.length > 0 && !categories.some(c => c.id === activeCategoryId)) {
      setActiveCategoryId(categories[0].id);
    } else if (categories.length === 0) {
      setActiveCategoryId(0);
    }
  }, [categories, activeCategoryId]);


  const filteredProducts = useMemo(
    () => products.filter((p) => p.categoryId === activeCategoryId),
    [products, activeCategoryId]
  );

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };
  
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(false);
  }

  const triggerSaleCompletion = (paymentMethod: string, total: number) => {
      onCompleteSale(cart, selectedCustomer, paymentMethod, total);
      setCart([]);
      setSelectedCustomer(null);
      setIsPaymentModalOpen(false);
  }

  return (
    <div className="flex h-full bg-slate-50">
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {categories.length > 0 ? (
          <CategoryTabs
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelectCategory={setActiveCategoryId}
          />
        ) : (
          <div className="mb-6 py-4 text-center text-sm text-slate-500 bg-slate-100 rounded-lg">
            Create product categories in Settings to begin.
          </div>
        )}
        <div className="flex-1 overflow-y-auto pb-4">
            {products.length > 0 ? (
                <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <p className="text-lg font-semibold">No Products Yet</p>
                    <p>Go to the 'Inventory' screen to add your first product.</p>
                </div>
            )}
        </div>
      </main>
      <Cart
        cart={cart}
        customer={selectedCustomer}
        activeShift={activeShift}
        taxes={taxes}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onSelectCustomer={() => setIsCustomerModalOpen(true)}
        onRemoveCustomer={() => setSelectedCustomer(null)}
        onCheckout={() => setIsPaymentModalOpen(true)}
      />
      {isCustomerModalOpen && (
        <CustomerSelectModal 
            customers={customers}
            onClose={() => setIsCustomerModalOpen(false)}
            onSelect={handleSelectCustomer}
        />
      )}
      {isPaymentModalOpen && activeShift && (
          <PaymentModal 
            cart={cart}
            customer={selectedCustomer}
            onClose={() => setIsPaymentModalOpen(false)}
            onCompleteSale={triggerSaleCompletion}
            paymentMethods={paymentMethods}
            outletId={activeShift.outletId}
            taxes={taxes}
          />
      )}
    </div>
  );
};

export default SalesScreen;
