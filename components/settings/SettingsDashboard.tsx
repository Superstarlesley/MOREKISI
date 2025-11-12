import React from 'react';
import { SettingsPage } from '../../screens/SettingsScreen';
import { Users, Building, ShieldCheck, CreditCardIcon, ReceiptText, SlidersHorizontal, HistoryIcon, Package, Wallet } from '../Icons';

interface SettingsDashboardProps {
    onNavigate: (page: SettingsPage) => void;
}

const settingsCategories = [
    {
        title: 'Store Setup',
        items: [
            { id: 'outlets', name: 'Outlets', description: 'Manage your physical store locations.', icon: <Building className="h-6 w-6 text-amber-500" /> },
            { id: 'taxes', name: 'Taxes', description: 'Define and manage tax rates.', icon: <ReceiptText className="h-6 w-6 text-cyan-500" /> },
            { id: 'paymentMethods', name: 'Payment Methods', description: 'Enable and configure payment options.', icon: <Wallet className="h-6 w-6 text-lime-500" /> },
        ]
    },
    {
        title: 'Product Management',
        items: [
             { id: 'categories', name: 'Categories', description: 'Group products into categories.', icon: <Package className="h-6 w-6 text-fuchsia-500" /> },
        ]
    },
    {
        title: 'Users & Access',
        items: [
            { id: 'users', name: 'Users', description: 'Add, edit, and manage staff accounts.', icon: <Users className="h-6 w-6 text-indigo-500" /> },
            { id: 'roles', name: 'Roles & Permissions', description: 'Define user roles and access levels.', icon: <ShieldCheck className="h-6 w-6 text-emerald-500" /> },
        ]
    },
    {
        title: 'System',
        items: [
            { id: 'preferences', name: 'System Preferences', description: 'General POS and back-office settings.', icon: <SlidersHorizontal className="h-6 w-6 text-slate-500" /> },
            { id: 'logs', name: 'Audit Logs', description: 'Track important system activities.', icon: <HistoryIcon className="h-6 w-6 text-slate-500" /> },
        ]
    },
];

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({ onNavigate }) => {
    return (
        <div className="space-y-8">
            {settingsCategories.map(category => (
                <div key={category.title}>
                    <h2 className="text-lg font-semibold text-slate-600 mb-3 px-2">{category.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.items.map(item => (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id as SettingsPage)}
                                className="flex items-start p-4 bg-white rounded-lg shadow-sm border text-left hover:border-brand-blue-400 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                            >
                                <div className="mr-4 mt-1">{item.icon}</div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SettingsDashboard;
