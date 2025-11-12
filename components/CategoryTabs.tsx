
import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: number;
  onSelectCategory: (id: number) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, activeCategoryId, onSelectCategory }) => {
  return (
    <div className="mb-6 border-b border-slate-200">
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out
              ${
                activeCategoryId === category.id
                  ? 'border-brand-blue-500 text-brand-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default CategoryTabs;
