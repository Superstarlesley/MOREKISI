import React, { useState } from 'react';
import { Category } from '../../types';
import { PlusIcon, TrashIcon, PencilIcon } from '../Icons';
import ConfirmationModal from '../ConfirmationModal';

interface CategoriesSettingsProps {
    categories: Category[];
    onSave: (category: Category) => void;
    onDelete: (categoryId: number) => void;
}

const CategoriesSettings: React.FC<CategoriesSettingsProps> = ({ categories, onSave, onDelete }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            if (editingCategory.name.trim()) {
                onSave(editingCategory);
                setEditingCategory(null);
            }
        } else {
            if (newCategoryName.trim()) {
                onSave({ id: 0, name: newCategoryName.trim() }); // ID will be set in App.tsx
                setNewCategoryName('');
            }
        }
    };

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold text-slate-700 mb-4">Manage Product Categories</h2>
                <form onSubmit={handleSave} className="flex items-center space-x-2 mb-4">
                    <input
                        type="text"
                        value={editingCategory ? editingCategory.name : newCategoryName}
                        onChange={(e) => {
                            if (editingCategory) {
                                setEditingCategory({ ...editingCategory, name: e.target.value });
                            } else {
                                setNewCategoryName(e.target.value);
                            }
                        }}
                        placeholder="Enter category name..."
                        className="flex-grow w-full bg-white border border-slate-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-brand-blue-500"
                    />
                    <button
                        type="submit"
                        className="flex items-center bg-brand-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-blue-700 transition shadow"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" /> {editingCategory ? 'Save' : 'Add'}
                    </button>
                    {editingCategory && (
                        <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-300 transition"
                        >
                            Cancel
                        </button>
                    )}
                </form>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                            <tr>
                                <th className="px-4 py-3">Category Name</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map(category => (
                                <tr key={category.id} className="border-b hover:bg-slate-50">
                                    <td className="px-4 py-3 font-semibold text-slate-900">{category.name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center items-center space-x-2">
                                            <button onClick={() => setEditingCategory(category)} className="p-1 text-slate-500 hover:text-brand-blue-600"><PencilIcon className="h-5 w-5"/></button>
                                            <button onClick={() => setCategoryToDelete(category)} className="p-1 text-slate-500 hover:text-red-600"><TrashIcon className="h-5 w-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {categories.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p>No categories defined. Add categories to organize your products.</p>
                        </div>
                    )}
                </div>
            </div>
            {categoryToDelete && (
                <ConfirmationModal
                    isOpen={!!categoryToDelete}
                    onClose={() => setCategoryToDelete(null)}
                    onConfirm={() => onDelete(categoryToDelete.id)}
                    title="Delete Category"
                    message={`Are you sure you want to delete the category "${categoryToDelete.name}"? This may affect products currently in this category.`}
                />
            )}
        </>
    );
};

export default CategoriesSettings;
