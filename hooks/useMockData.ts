import { Product, Category, Customer, Outlet, Supplier, PurchaseOrder, SalesTransaction, CashflowTransaction, User, Role, ExpenseDue, Shift, PaymentMethod, Tax } from '../types';

const categories: Category[] = [
  { id: 1, name: 'Beverages' },
  { id: 2, name: 'Snacks' },
  { id: 3, name: 'Electronics' },
  { id: 4, name: 'Bakery' },
  { id: 5, name: 'Dairy' },
];

const outlets: Outlet[] = [
    { id: 1, name: 'Main Branch - Gaborone', address: 'Plot 47, Gaborone CBD', contactPhone: '3900123' },
    { id: 2, name: 'Francistown Branch', address: 'Shop 12, Gallo Mall, Francistown', contactPhone: '2410456' },
];

const roles: Role[] = ['Administrator', 'Manager', 'Cashier', 'Inventory Staff'];

const users: User[] = [
    { id: 1, name: 'Jane Doe', email: 'jane.doe@bluearm.com', role: 'Administrator', outletIds: [1, 2], status: 'Active', lastLogin: '2024-05-21 10:30 AM' },
    { id: 2, name: 'John Smith', email: 'john.smith@bluearm.com', role: 'Manager', outletIds: [1], status: 'Active', lastLogin: '2024-05-21 09:15 AM' },
    { id: 3, name: 'Lerato K.', email: 'lerato.k@bluearm.com', role: 'Cashier', outletIds: [1], status: 'Active', lastLogin: '2024-05-20 05:00 PM' },
    { id: 4, name: 'Mike Johnson', email: 'mike.j@bluearm.com', role: 'Inventory Staff', outletIds: [2], status: 'Inactive', lastLogin: '2024-05-18 11:00 AM' },
];

const products: Product[] = [
  // Beverages
  { id: 1, name: 'Coca-Cola Can', sku: 'BEV001', price: 8.50, cost: 4.50, imageUrl: 'https://picsum.photos/seed/coke/400', categoryId: 1, stockLevels: [{outletId: 1, quantity: 150}, {outletId: 2, quantity: 75}], lowStockThreshold: 20 },
  { id: 2, name: 'Mineral Water 500ml', sku: 'BEV002', price: 5.00, cost: 2.00, imageUrl: 'https://picsum.photos/seed/water/400', categoryId: 1, stockLevels: [{outletId: 1, quantity: 200}, {outletId: 2, quantity: 150}], lowStockThreshold: 50 },
  { id: 3, name: 'Orange Juice 1L', sku: 'BEV003', price: 22.75, cost: 15.50, imageUrl: 'https://picsum.photos/seed/juice/400', categoryId: 1, stockLevels: [{outletId: 1, quantity: 80}, {outletId: 2, quantity: 40}], lowStockThreshold: 15 },
  { id: 4, name: 'Espresso Shot', sku: 'BEV004', price: 15.00, cost: 5.00, imageUrl: 'https://picsum.photos/seed/coffee/400', categoryId: 1, stockLevels: [{outletId: 1, quantity: 500}, {outletId: 2, quantity: 200}], lowStockThreshold: 100 },

  // Snacks
  { id: 5, name: 'Simba Chips - Salt & Vinegar', sku: 'SNA001', price: 12.00, cost: 7.00, imageUrl: 'https://picsum.photos/seed/chips/400', categoryId: 2, stockLevels: [{outletId: 1, quantity: 120}, {outletId: 2, quantity: 88}], lowStockThreshold: 24 },
  { id: 6, name: 'Chocolate Bar 100g', sku: 'SNA002', price: 18.50, cost: 10.00, imageUrl: 'https://picsum.photos/seed/choco/400', categoryId: 2, stockLevels: [{outletId: 1, quantity: 9}, {outletId: 2, quantity: 60}], lowStockThreshold: 10 },
  { id: 7, name: 'Biltong 50g', sku: 'SNA003', price: 35.00, cost: 22.00, imageUrl: 'https://picsum.photos/seed/biltong/400', categoryId: 2, stockLevels: [{outletId: 1, quantity: 60}, {outletId: 2, quantity: 0}], lowStockThreshold: 10 },
  
  // Electronics
  { id: 8, name: 'USB-C Cable 1m', sku: 'ELE001', price: 150.00, cost: 80.00, imageUrl: 'https://picsum.photos/seed/cable/400', categoryId: 3, stockLevels: [{outletId: 1, quantity: 40}, {outletId: 2, quantity: 15}], lowStockThreshold: 5 },
  { id: 9, name: 'AA Batteries (4-pack)', sku: 'ELE002', price: 45.00, cost: 25.00, imageUrl: 'https://picsum.photos/seed/battery/400', categoryId: 3, stockLevels: [{outletId: 1, quantity: 110}, {outletId: 2, quantity: 130}], lowStockThreshold: 20 },
  { id: 10, name: 'Wireless Mouse', sku: 'ELE003', price: 250.00, cost: 160.00, imageUrl: 'https://picsum.photos/seed/mouse/400', categoryId: 3, stockLevels: [{outletId: 1, quantity: 25}, {outletId: 2, quantity: 8}], lowStockThreshold: 5 },
  { id: 11, name: '16GB Flash Drive', sku: 'ELE004', price: 120.00, cost: 70.00, imageUrl: 'https://picsum.photos/seed/usb/400', categoryId: 3, stockLevels: [{outletId: 1, quantity: 5}, {outletId: 2, quantity: 35}], lowStockThreshold: 10 },

  // Bakery
  { id: 12, name: 'Fresh Loaf of Bread', sku: 'BAK001', price: 11.00, cost: 6.00, imageUrl: 'https://picsum.photos/seed/bread/400', categoryId: 4, stockLevels: [{outletId: 1, quantity: 30}, {outletId: 2, quantity: 25}], lowStockThreshold: 5 },
  { id: 13, name: 'Croissant', sku: 'BAK002', price: 15.00, cost: 8.00, imageUrl: 'https://picsum.photos/seed/croissant/400', categoryId: 4, stockLevels: [{outletId: 1, quantity: 50}, {outletId: 2, quantity: 40}], lowStockThreshold: 10 },

  // Dairy
  { id: 14, name: 'Fresh Milk 1L', sku: 'DAI001', price: 16.50, cost: 11.00, imageUrl: 'https://picsum.photos/seed/milk/400', categoryId: 5, stockLevels: [{outletId: 1, quantity: 65}, {outletId: 2, quantity: 50}], lowStockThreshold: 12 },
  { id: 15, name: 'Cheddar Cheese 250g', sku: 'DAI002', price: 42.00, cost: 28.00, imageUrl: 'https://picsum.photos/seed/cheese/400', categoryId: 5, stockLevels: [{outletId: 1, quantity: 40}, {outletId: 2, quantity: 18}], lowStockThreshold: 8 },
];

const customers: Customer[] = [
    { id: 1, name: 'Tshepo Mogale', email: 'tshepo.m@example.com', phone: '71234567', loyaltyPoints: 1450, totalPurchases: 12500.75, lastPurchaseDate: '2024-05-18', status: 'Active', outletIds: [1] },
    { id: 2, name: 'Sarah Chen', email: 'sarah.c@example.com', phone: '72345678', loyaltyPoints: 820, totalPurchases: 8950.00, lastPurchaseDate: '2024-05-20', status: 'Active', outletIds: [1, 2] },
    { id: 3, name: 'David Smith', email: 'd.smith@example.com', phone: '73456789', loyaltyPoints: 2105, totalPurchases: 25300.50, lastPurchaseDate: '2024-05-15', status: 'Active', outletIds: [2] },
    { id: 4, name: 'Fatima Al-Fassi', email: 'fatima.af@example.com', phone: '74567890', loyaltyPoints: 350, totalPurchases: 4200.00, lastPurchaseDate: '2024-04-28', status: 'Inactive', outletIds: [1] },
];

const suppliers: Supplier[] = [
    { id: 1, name: 'Global Foods Inc.', contactPerson: 'John Phiri', email: 'john@globalfoods.com', phone: '71112233', address: 'Plot 123, Gaborone West', city: 'Gaborone', country: 'Botswana', paymentTerms: 'Net 30' },
    { id: 2, name: 'Tech Distributors BW', contactPerson: 'Priya Singh', email: 'priya@techdist.co.bw', phone: '72223344', address: 'Unit 5, Kgale Siding', city: 'Gaborone', country: 'Botswana', notes: 'Primary supplier for electronics.' },
    { id: 3, name: 'Daily Fresh Bakery', contactPerson: 'Maria Gomes', email: 'maria@dailyfresh.com', phone: '73334455', city: 'Francistown', country: 'Botswana', paymentTerms: 'COD' },
];

const purchaseOrders: PurchaseOrder[] = [
    {
        id: 1, poNumber: 'PO-2024-001', supplierId: 1, outletId: 1, dateCreated: '2024-05-10', expectedDelivery: '2024-05-20', status: 'Received',
        items: [
            { id: 1, productId: 1, quantityOrdered: 200, quantityReceived: 200, cost: 4.50 },
            { id: 2, productId: 2, quantityOrdered: 300, quantityReceived: 300, cost: 2.00 },
        ]
    },
    {
        id: 2, poNumber: 'PO-2024-002', supplierId: 2, outletId: 1, dateCreated: '2024-05-12', expectedDelivery: '2024-05-25', status: 'Partially Received',
        items: [
            { id: 3, productId: 8, quantityOrdered: 50, quantityReceived: 25, cost: 80.00 },
            { id: 4, productId: 9, quantityOrdered: 100, quantityReceived: 100, cost: 25.00 },
        ]
    },
    {
        id: 3, poNumber: 'PO-2024-003', supplierId: 2, outletId: 2, dateCreated: '2024-05-15', expectedDelivery: '2024-05-18', status: 'Sent',
        items: [
            { id: 5, productId: 12, quantityOrdered: 50, quantityReceived: 0, cost: 6.00 },
            { id: 6, productId: 13, quantityOrdered: 100, quantityReceived: 0, cost: 8.00 },
        ]
    },
    {
        id: 4, poNumber: 'PO-2024-004', supplierId: 1, outletId: 2, dateCreated: '2024-05-16', expectedDelivery: '2024-05-28', status: 'Draft',
        items: [
            { id: 7, productId: 5, quantityOrdered: 150, quantityReceived: 0, cost: 7.00 },
        ]
    }
];

const generateSalesTransactions = (
  days: number,
  transactionsPerDay: number,
  allProducts: Product[],
  allCustomers: Customer[],
  allOutlets: Outlet[]
): SalesTransaction[] => {
  const transactions: SalesTransaction[] = [];
  const paymentMethods: ('cash' | 'card' | 'digital')[] = ['cash', 'card', 'digital'];
  let transactionId = 1;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];

    for (let j = 0; j < transactionsPerDay; j++) {
      const outlet = allOutlets[Math.floor(Math.random() * allOutlets.length)];
      const customer = Math.random() > 0.3 ? allCustomers[Math.floor(Math.random() * allCustomers.length)] : undefined;
      const numItems = Math.floor(Math.random() * 5) + 1;
      const items: { productId: number; quantity: number; price: number }[] = [];
      
      for (let k = 0; k < numItems; k++) {
        const product = allProducts[Math.floor(Math.random() * allProducts.length)];
        if (!items.some(item => item.productId === product.id)) {
           items.push({
             productId: product.id,
             quantity: Math.floor(Math.random() * 3) + 1,
             price: product.price,
           });
        }
      }
      
      if (items.length === 0) continue;

      const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      const tax = subtotal * 0.12;
      const totalAmount = subtotal + tax;

      transactions.push({
        id: transactionId++,
        outletId: outlet.id,
        date: dateString,
        totalAmount: parseFloat(totalAmount.toFixed(2)),
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        cashierId: 3, // Lerato K.
        customerId: customer?.id,
        items,
      });
    }
  }

  return transactions;
};

const salesTransactions = generateSalesTransactions(30, Math.floor(Math.random() * 10) + 5, products, customers, outlets);

const generateCashflowTransactions = (
  sales: SalesTransaction[],
  purchases: PurchaseOrder[]
): CashflowTransaction[] => {
  let transactions: CashflowTransaction[] = [];
  let idCounter = 1;

  // Cash In from Sales
  sales.forEach(sale => {
    transactions.push({
      id: idCounter++,
      outletId: sale.outletId,
      dateTime: `${sale.date}T${Math.floor(Math.random() * 12 + 8).toString().padStart(2, '0')}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}:00`,
      type: 'Cash In',
      source: `Sale #${sale.id}`,
      amount: sale.totalAmount,
      user: 'System',
    });
  });

  // Cash Out from Purchases
  purchases.filter(p => p.status === 'Received' || p.status === 'Partially Received').forEach(po => {
    const totalCost = po.items.reduce((sum, item) => sum + item.cost * item.quantityOrdered, 0);
    transactions.push({
      id: idCounter++,
      outletId: po.outletId,
      dateTime: `${po.dateCreated}T10:00:00`,
      type: 'Cash Out',
      source: `PO Payment #${po.poNumber}`,
      amount: totalCost,
      user: 'System',
    });
  });

  // Manual Expenses & Inflows
  const manualEntries = [
    { outletId: 1, date: -2, type: 'Cash Out', source: 'Rent Payment', amount: 15000 },
    { outletId: 2, date: -2, type: 'Cash Out', source: 'Rent Payment', amount: 12000 },
    { outletId: 1, date: -5, type: 'Cash Out', source: 'Utilities Bill', amount: 3500 },
    { outletId: 1, date: -15, type: 'Cash In', source: "Owner's Deposit", amount: 20000 },
    { outletId: 2, date: -10, type: 'Cash Out', source: 'Cleaning Services', amount: 1200 },
  ];

  manualEntries.forEach(entry => {
    const date = new Date();
    date.setDate(date.getDate() + entry.date);
    transactions.push({
      id: idCounter++,
      outletId: entry.outletId,
      dateTime: `${date.toISOString().split('T')[0]}T14:00:00`,
      type: entry.type as 'Cash In' | 'Cash Out',
      source: entry.source,
      amount: entry.amount,
      user: 'Jane Doe',
    });
  });
  
  return transactions.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
};

const cashflowTransactions = generateCashflowTransactions(salesTransactions, purchaseOrders);

const expensesDues: ExpenseDue[] = [
    { id: 1, type: 'Expense', name: 'Office Supplies', amount: 550.00, outletId: 1, date: '2024-05-20', status: 'Paid', paymentMethod: 'Cash' },
    { id: 2, type: 'Due', name: 'Rent - May 2024', amount: 15000.00, outletId: 1, date: '2024-05-01', dueDate: '2024-05-31', status: 'Pending', notes: 'Monthly rent for Main Branch' },
    { id: 3, type: 'Expense', name: 'Internet Bill', amount: 850.00, outletId: 2, date: '2024-05-18', status: 'Paid', paymentMethod: 'Bank Transfer' },
    { id: 4, type: 'Due', name: 'Catering for Event', amount: 2500.00, outletId: 1, date: '2024-05-15', dueDate: '2024-05-25', status: 'Pending' },
    { id: 5, type: 'Expense', name: 'Fuel for Delivery Van', amount: 400.00, outletId: 2, date: '2024-05-21', status: 'Paid', paymentMethod: 'Card' },
];

const shifts: Shift[] = [];

const paymentMethods: PaymentMethod[] = [
    { id: 'cash', name: 'Cash', status: 'Active', outletIds: [1, 2] },
    { id: 'card', name: 'Card', status: 'Active', outletIds: [1, 2] },
    { id: 'digital', name: 'Digital Wallet', status: 'Active', outletIds: [1] },
    { id: 'bank_transfer', name: 'Bank Transfer', status: 'Inactive', outletIds: [1, 2] },
];

const taxes: Tax[] = [
    { id: 1, name: 'VAT', rate: 12, type: 'inclusive', applyTo: 'all', categoryIds: [], status: 'Active' },
    { id: 2, name: 'Service Fee', rate: 5, type: 'exclusive', applyTo: 'categories', categoryIds: [4], status: 'Active' }, // Applied to Bakery
];


export const useMockData = () => {
  // In a real app, this would be a fetch call, e.g., using useEffect
  return { products, categories, customers, outlets, suppliers, purchaseOrders, salesTransactions, cashflowTransactions, users, roles, expensesDues, shifts, paymentMethods, taxes };
};
