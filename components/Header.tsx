import React from 'react';
import { SearchIcon, BellIcon, UserCircleIcon, LogOut, ClockIcon } from './Icons';
import { Shift } from '../types';

interface HeaderProps {
    onLogout: () => void;
    activeShift: Shift | null;
    onStartShift: () => void;
    onEndShift: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, activeShift, onStartShift, onEndShift }) => {
  return (
    <header className="flex-shrink-0 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between p-4 h-16">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="w-full max-w-sm bg-slate-100 border border-transparent rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-blue-500 transition"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-6">
            {activeShift ? (
                <div className="flex items-center p-2 rounded-lg bg-green-100 text-green-800">
                    <ClockIcon className="h-5 w-5 mr-2"/>
                    <div className="text-sm font-semibold">
                        <span>Shift Active</span>
                        <span className="text-xs text-green-600 ml-2">(Since {new Date(activeShift.startTime).toLocaleTimeString()})</span>
                    </div>
                    <button onClick={onEndShift} className="ml-4 text-sm font-bold text-red-600 hover:underline">End Shift</button>
                </div>
            ) : (
                <button onClick={onStartShift} className="flex items-center p-2 rounded-lg bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200 transition">
                    <ClockIcon className="h-5 w-5 mr-2"/>
                    Start Shift
                </button>
            )}
            
            <div className="h-8 w-px bg-slate-200"></div>

          <button className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition">
            <BellIcon className="h-6 w-6"/>
          </button>
          <div className="flex items-center">
            <UserCircleIcon className="h-8 w-8 text-slate-400"/>
            <div className="ml-2">
                <p className="text-sm font-semibold text-slate-800">Jane Doe</p>
                <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
           <button 
                onClick={onLogout}
                className="flex items-center p-2 rounded-md text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Logout"
            >
                <LogOut className="h-5 w-5"/>
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
