
import React, { useState } from 'react';
import { Customer } from '../types';
// FIX: Corrected import path for Icons to be relative.
import { XIcon, SearchIcon, UserCircleIcon } from './Icons';

interface CustomerSelectModalProps {
  customers: Customer[];
  onSelect: (customer: Customer) => void;
  onClose: () => void;
}

const CustomerSelectModal: React.FC<CustomerSelectModalProps> = ({ customers, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Select Customer</h2>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-4 border-b">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredCustomers.map(customer => (
            <div 
              key={customer.id} 
              onClick={() => onSelect(customer)}
              className="flex items-center p-4 border-b border-slate-100 hover:bg-brand-blue-50 cursor-pointer transition"
            >
              <UserCircleIcon className="h-10 w-10 text-slate-400 mr-4"/>
              <div>
                <p className="font-semibold text-slate-800">{customer.name}</p>
                <p className="text-sm text-slate-500">{customer.phone}</p>
              </div>
              <div className="ml-auto text-right">
                 <p className="text-sm text-slate-500">Loyalty Points</p>
                 <p className="font-bold text-brand-blue-600">{customer.loyaltyPoints}</p>
              </div>
            </div>
          ))}
          {filteredCustomers.length === 0 && (
            <p className="text-center p-8 text-slate-500">No customers found.</p>
          )}
        </div>
        <div className="p-4 border-t bg-slate-50">
             <button className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition">Create New Customer</button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSelectModal;