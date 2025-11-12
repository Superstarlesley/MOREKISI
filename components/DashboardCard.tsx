import React from 'react';

interface DashboardCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    description?: string;
    onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, value, description, onClick }) => {
    const cardClasses = `
        bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between
        ${onClick ? 'cursor-pointer hover:border-brand-blue-400 hover:shadow-md transition-all' : ''}
    `;

    return (
        <div className={cardClasses} onClick={onClick}>
            <div>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-500">{title}</p>
                    <div className="p-2 bg-slate-100 rounded-lg">
                        {icon}
                    </div>
                </div>
                <p className="text-3xl font-bold text-slate-800 mt-2 truncate" title={value}>
                    {value}
                </p>
            </div>
            {description && (
                 <p className="text-xs text-slate-500 mt-2">{description}</p>
            )}
        </div>
    );
};

export default DashboardCard;
