import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Meal } from '../types';
import Icon from './common/Icon';

interface MealDetailProps {
    meal: Meal;
    onClose: () => void;
    onTrackMeal?: (weight: number) => void;
}

const StatPill: React.FC<{ icon: React.ComponentProps<typeof Icon>['name'], label: string, value: string | number }> = ({ icon, label, value }) => (
    <div className="flex-1 bg-background p-3 rounded-xl flex items-center space-x-2">
        <Icon name={icon} className="w-5 h-5 text-primary" />
        <div>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className="font-semibold text-sm text-text-primary">{value}</p>
        </div>
    </div>
);

// New function for custom labels on the pie chart
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, payload, percent }: any) => {
    // Don't render a label if the slice is too small to fit it
    if (percent < 0.1) {
        return null;
    }
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="rgba(0,0,0,0.6)" // Using a semi-transparent black for good contrast on light macro colors
            textAnchor="middle"
            dominantBaseline="central"
            className="text-sm font-bold pointer-events-none"
        >
            {`${payload.grams}g`}
        </text>
    );
};


const MealDetail: React.FC<MealDetailProps> = ({ meal, onClose, onTrackMeal }) => {
    const scale = meal.defaultWeight / 100;
    const proteinPerServing = meal.proteinPer100g * scale;
    const carbsPerServing = meal.carbsPer100g * scale;
    const fatPerServing = meal.fatPer100g * scale;
    const caloriesPerServing = meal.caloriesPer100g * scale;

    const proteinCalories = proteinPerServing * 4;
    const carbsCalories = carbsPerServing * 4;
    const fatCalories = fatPerServing * 9;
    const totalMacroCalories = proteinCalories + carbsCalories + fatCalories;

    const chartData = totalMacroCalories > 0 ? [
        { name: 'Carbs', value: carbsCalories, grams: Math.round(carbsPerServing), color: 'rgb(var(--color-carbs))' },
        { name: 'Fats', value: fatCalories, grams: Math.round(fatPerServing), color: 'rgb(var(--color-fat))' },
        { name: 'Proteins', value: proteinCalories, grams: Math.round(proteinPerServing), color: 'rgb(var(--color-protein))' },
    ] : [];

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />
            <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="fixed bottom-0 left-0 right-0 h-[95vh] bg-card z-50 rounded-t-3xl overflow-hidden flex flex-col"
            >
                <div className="h-[40%] w-full relative">
                    {meal.imageUrl ? (
                        <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover"/>
                    ) : (
                        <div className="w-full h-full bg-border flex items-center justify-center">
                            <Icon name="food" className="w-24 h-24 text-text-secondary/20"/>
                        </div>
                    )}
                     <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-black/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
                        <Icon name="close" className="w-5 h-5"/>
                    </button>
                </div>

                <div className="flex-grow p-6 space-y-6 overflow-y-auto">
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">{meal.name}</h1>
                    
                    <div className="flex gap-3">
                        <StatPill icon="calories" label="Calories" value={`${Math.round(caloriesPerServing)} kcal`} />
                        <StatPill icon="food" label="Serving" value={`${meal.defaultWeight} g`} />
                        <StatPill icon={meal.category.toLowerCase() as any} label="Category" value={meal.category} />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-text-primary mb-2">Macro Profile (per serving)</h2>
                        <div className="h-48">
                           <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={chartData} 
                                        dataKey="value" 
                                        nameKey="name" 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius={50} 
                                        outerRadius={80} // Increased radius for more space
                                        paddingAngle={5} 
                                        cornerRadius={8}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                    >
                                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip
                                        cursor={{ fill: 'rgba(var(--color-border), 0.5)' }}
                                        contentStyle={{
                                            background: 'rgb(var(--color-card))',
                                            border: '1px solid rgb(var(--color-border))',
                                            borderRadius: '0.75rem',
                                            color: 'rgb(var(--color-text-primary))'
                                        }}
                                        formatter={(value, name, props) => [`${props.payload.grams}g`, name]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                         <div className="grid grid-cols-3 gap-2 text-center mt-2">
                             {chartData.map(item => (
                                 <div key={item.name}>
                                     <p className="font-semibold text-text-primary">{item.grams}g</p>
                                     <p className="text-sm text-text-secondary">{item.name}</p>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>

                {onTrackMeal && (
                    <div className="p-4 border-t border-border mt-auto">
                        <button onClick={() => onTrackMeal(meal.defaultWeight)} className="w-full py-3.5 text-center text-white font-semibold bg-primary hover:bg-primary-accent rounded-xl transition-colors">
                            Track Serving ({meal.defaultWeight}g)
                        </button>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default MealDetail;