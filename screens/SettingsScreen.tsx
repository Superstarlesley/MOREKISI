import React, { useState } from 'react';
import SettingsDashboard from '../components/settings/SettingsDashboard';
import UsersSettings from '../components/settings/UsersSettings';
import OutletsSettings from '../components/settings/OutletsSettings';
import TaxSettings from '../components/settings/TaxSettings';
import CategoriesSettings from '../components/settings/CategoriesSettings';
import PaymentMethodsSettings from '../components/settings/PaymentMethodsSettings';
import RolesSettings from '../components/settings/RolesSettings';
import { User, Outlet, Role, Category, PaymentMethod, Tax } from '../types';


export type SettingsPage = 'dashboard' | 'users' | 'outlets' | 'taxes' | 'preferences' | 'logs' | 'categories' | 'paymentMethods' | 'roles';

interface SettingsScreenProps {
    users: User[];
    onSaveUser: (user: Omit<User, 'id'> & { id?: number }) => void;
    onDeleteUser: (userId: number) => void;
    outlets: Outlet[];
    onSaveOutlet: (outlet: Omit<Outlet, 'id'> & { id?: number }) => void;
    onDeleteOutlet: (outletId: number) => void;
    roles: Role[];
    onSaveRole: (role: Role) => void;
    onDeleteRole: (role: Role) => void;
    categories: Category[];
    onSaveCategory: (category: Category) => void;
    onDeleteCategory: (categoryId: number) => void;
    paymentMethods: PaymentMethod[];
    onSavePaymentMethod: (method: PaymentMethod) => void;
    taxes: Tax[];
    onSaveTax: (tax: Omit<Tax, 'id'> & { id?: number }) => void;
    onDeleteTax: (taxId: number) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = (props) => {
  const [activePage, setActivePage] = useState<SettingsPage>('dashboard');

  const pageTitles: Record<SettingsPage, string> = {
    dashboard: 'Settings',
    users: 'Users & Access Control',
    outlets: 'Outlets Configuration',
    taxes: 'Tax Settings',
    categories: 'Product Categories',
    paymentMethods: 'Payment Methods',
    roles: 'User Roles',
    preferences: 'System Preferences',
    logs: 'Audit Logs',
  };

  const renderContent = () => {
    switch (activePage) {
      case 'users':
        return <UsersSettings 
                    users={props.users}
                    outlets={props.outlets}
                    roles={props.roles}
                    onSaveUser={props.onSaveUser}
                    onDeleteUser={props.onDeleteUser}
                />;
      case 'outlets':
        return <OutletsSettings 
                    outlets={props.outlets}
                    onSaveOutlet={props.onSaveOutlet}
                    onDeleteOutlet={props.onDeleteOutlet}
                />;
      case 'taxes':
        return <TaxSettings
                    taxes={props.taxes}
                    categories={props.categories}
                    onSave={props.onSaveTax}
                    onDelete={props.onDeleteTax}
                />;
      case 'categories':
          return <CategoriesSettings
              categories={props.categories}
              onSave={props.onSaveCategory}
              onDelete={props.onDeleteCategory}
          />;
      case 'paymentMethods':
          return <PaymentMethodsSettings
              paymentMethods={props.paymentMethods}
              outlets={props.outlets}
              onSavePaymentMethod={props.onSavePaymentMethod}
          />;
      case 'roles':
          return <RolesSettings
              roles={props.roles}
              onSaveRole={props.onSaveRole}
              onDeleteRole={props.onDeleteRole}
          />;
      case 'preferences':
      case 'logs':
        return <div className="text-center p-8 bg-white rounded-lg shadow-sm border"><h2 className="text-xl font-semibold text-slate-600">{pageTitles[activePage]}</h2><p className="text-slate-500 mt-2">This feature is not yet implemented.</p></div>;
      default:
        return <SettingsDashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 space-y-6">
      <div className="flex-shrink-0 flex items-center">
        {activePage !== 'dashboard' && (
          <button
            onClick={() => setActivePage('dashboard')}
            className="mr-4 px-3 py-1.5 bg-white border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            &larr; Back to Settings
          </button>
        )}
        <h1 className="text-3xl font-bold text-slate-800">
          {pageTitles[activePage]}
        </h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsScreen;
