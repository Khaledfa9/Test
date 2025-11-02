import React from 'react';
import { TodayLog } from '../../types';
import Icon from '../common/Icon';

interface MacroSummaryProps {
    consumed: TodayLog['consumed'];
    goals: TodayLog['goals'];
}

const MacroStat: React.FC<{
    label: string;
    value: number;
    goal: number;
    colorClass: string;
    icon: React.ComponentProps<typeof Icon>['name'];
}> = ({ label, value, goal, colorClass, icon }) => {
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    const displayPercentage = Math.min(percentage, 100);
    const remaining = Math.round(goal - value);
    const isOver = remaining < 0;

    const barColor = isOver ? 'bg-danger' : `bg-${colorClass.split('-')[1]}`;
    const textColor = isOver ? 'text-danger' : colorClass;
    
    return (
        <div className="bg-background p-4 rounded-2xl flex flex-col text-center h-36">
            <div className="flex flex-col items-center">
                <Icon name={icon} className={`w-6 h-6 ${textColor}`} />
                <p className="font-semibold text-text-primary text-sm mt-1">{label}</p>
            </div>
            
            <div className="flex-grow flex flex-col items-center justify-center">
                <p className={`font-bold text-3xl tracking-tighter ${textColor}`}>
                    {Math.round(value)}<span className="text-lg font-medium text-text-secondary"> g</span>
                </p>
            </div>

            <div className="w-full">
                <div className="bg-border rounded-full h-1.5 w-full overflow-hidden">
                    <div 
                        className={`${barColor} h-1.5 rounded-full transition-all duration-500`} 
                        style={{ width: `${displayPercentage}%` }}
                    ></div>
                </div>
                <p className="text-xs text-text-secondary mt-1.5">
                    {isOver ? `${Math.abs(remaining)} g over` : `${remaining} g left`}
                </p>
            </div>
        </div>
    );
};


const MacroSummary: React.FC<MacroSummaryProps> = ({ consumed, goals }) => {
    return (
        <div className="grid grid-cols-3 gap-3">
            <MacroStat 
                label="Proteins" 
                value={consumed.protein} 
                goal={goals.protein} 
                colorClass="text-protein" 
                icon="proteins" 
            />
            <MacroStat 
                label="Carbs" 
                value={consumed.carbs} 
                goal={goals.carbs} 
                colorClass="text-carbs" 
                icon="carbs" 
            />
            <MacroStat 
                label="Fats" 
                value={consumed.fat} 
                goal={goals.fat} 
                colorClass="text-fat" 
                icon="fats" 
            />
        </div>
    );
};

export default MacroSummary;