import React from 'react';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    BarChart,
    Wallet,
    Settings,
    Truck,
    Building,
    ReceiptText,
} from './Icons';

type ScreenName = 'dashboard' | 'sales' | 'inventory' | 'purchases' | 'suppliers' | 'customers' | 'reports' | 'cashflow' | 'settings' | 'expenses';

interface SidebarProps {
    activeScreen: ScreenName;
    onNavigate: (screen: ScreenName) => void;
}

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, screen: 'dashboard' as ScreenName },
    { name: 'Sales', icon: ShoppingCart, screen: 'sales' as ScreenName },
    { name: 'Inventory', icon: Package, screen: 'inventory' as ScreenName },
    { name: 'Purchases', icon: Truck, screen: 'purchases' as ScreenName },
    { name: 'Expenses & Dues', icon: ReceiptText, screen: 'expenses' as ScreenName },
    { name: 'Suppliers', icon: Building, screen: 'suppliers' as ScreenName },
    { name: 'Customers', icon: Users, screen: 'customers' as ScreenName },
    { name: 'Reports', icon: BarChart, screen: 'reports' as ScreenName },
    { name: 'Cash Flow', icon: Wallet, screen: 'cashflow' as ScreenName },
];

const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onNavigate }) => {
    return (
        <aside className="w-64 flex-shrink-0 bg-slate-800 text-slate-300 flex flex-col">
            <div className="h-16 flex items-center justify-center border-b border-slate-700 p-2">
                <img src="https://placehold.co/256x256/3b82f6/ffffff?text=BlueArm" alt="BlueArm Logo" className="h-12 object-contain rounded-md" />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <a
                        key={item.name}
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate(item.screen);
                        }}
                        className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                            activeScreen === item.screen
                                ? 'bg-brand-blue-500 text-white shadow-lg'
                                : 'hover:bg-slate-700 hover:text-white'
                        }`}
                    >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                    </a>
                ))}
            </nav>
            <div className="px-4 py-6 border-t border-slate-700">
                 <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate('settings');
                    }}
                    className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        activeScreen === 'settings'
                            ? 'bg-brand-blue-500 text-white'
                            : 'hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                </a>
            </div>
        </aside>
    );
};

export default Sidebar;