export interface Category {
  id: number;
  name: string;
}

export type Role = 'Administrator' | 'Manager' | 'Cashier' | 'Inventory Staff';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  outletIds: number[];
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

export interface Outlet {
  id: number;
  name: string;
  address?: string;
  contactPhone?: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  cost: number;
  imageUrl: string;
  categoryId: number;
  stockLevels: {
    outletId: number;
    quantity: number;
  }[];
  lowStockThreshold: number;
}


export interface CartItem extends Product {
  quantity: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  totalPurchases: number;
  lastPurchaseDate: string;
  status: 'Active' | 'Inactive';
  outletIds: number[];
}

export type StockAdjustmentType = 'Received' | 'Damaged/Loss' | 'Manual Correction' | 'Stock Take' | 'Return';

export interface StockAdjustment {
  productId: number;
  outletId: number;
  change: number;
  type: StockAdjustmentType;
  reason: string;
  user: string;
  date: Date;
}

// Supplier and Purchase Order Types
export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  paymentTerms?: string;
  notes?: string;
}

export type PurchaseOrderStatus = 'Draft' | 'Sent' | 'Partially Received' | 'Received' | 'Cancelled';

export interface PurchaseOrderLine {
  id: number;
  productId: number;
  quantityOrdered: number;
  quantityReceived: number;
  cost: number;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  supplierId: number;
  outletId: number;
  dateCreated: string;
  expectedDelivery: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderLine[];
  notes?: string;
}

// Reports
export interface SalesTransaction {
  id: number;
  outletId: number;
  date: string; // YYYY-MM-DD
  totalAmount: number;
  paymentMethod: string; // Align with PaymentMethod.id
  cashierId: number; // In a real app, this would link to a User/Staff entity
  customerId?: number;
  items: { 
    productId: number; 
    quantity: number; 
    price: number; // price at time of sale
  }[];
}

// Cashflow
export interface CashflowTransaction {
  id: number;
  outletId: number;
  dateTime: string; // ISO 8601 format
  type: 'Cash In' | 'Cash Out';
  source: string; // e.g., 'Sale #TRX1001', 'PO Payment #PO-2024-001', 'Utilities'
  amount: number;
  notes?: string;
  user: string; // User who recorded it
}

// Dues & Expenses
export interface ExpenseDue {
  id: number;
  type: 'Expense' | 'Due';
  name: string;
  amount: number;
  outletId: number;
  date: string; // YYYY-MM-DD
  dueDate?: string; // YYYY-MM-DD, for Dues
  status: 'Paid' | 'Pending'; // Pending only for Dues
  paymentMethod?: 'Cash' | 'Card' | 'Bank Transfer' | 'Mobile Money';
  notes?: string;
}

// Shift Management
export interface Shift {
  id: number;
  cashierId: number;
  outletId: number;
  startTime: string; // ISO
  openingBalance: number;
  endTime: string | null;
  closingBalance: number | null; // Expected closing balance
  actualCash: number | null; // Actual cash counted
  variance: number | null;
  status: 'Active' | 'Closed';
}

// Payment Methods
export interface PaymentMethod {
  id: string; // 'cash', 'card', etc.
  name: string;
  status: 'Active' | 'Inactive';
  outletIds: number[]; // which outlets this method is available in
}

// Tax
export type TaxType = 'inclusive' | 'exclusive';
export type TaxApplyTo = 'all' | 'categories';

export interface Tax {
  id: number;
  name: string;
  rate: number; // e.g., 12 for 12%
  type: TaxType;
  applyTo: TaxApplyTo;
  categoryIds: number[];
  status: 'Active' | 'Inactive';
}
