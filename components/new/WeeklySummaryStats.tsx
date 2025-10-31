import React from 'react';
import Icon from '../common/Icon';

interface WeeklyStats {
    totals: { calories: number; protein: number; carbs: number; fat: number };
    averages: { calories: number; protein: number; carbs: number; fat: number };
    commitmentScore: number;
    commitmentLabel: string;
    commitmentColor: string;
}

interface WeeklySummaryStatsProps {
    stats: WeeklyStats;
}

const StatCard: React.FC<{ 
    icon: React.ComponentProps<typeof Icon>['name']; 
    label: string; 
    avg: number; 
    total: number; 
    unit: string; 
}> = ({ icon, label, avg, total, unit }) => (
    <div className="bg-card p-3 rounded-xl flex items-start space-x-3">
        <div className="bg-background p-2 rounded-full mt-1 flex-shrink-0">
            <Icon name={icon} className="w-5 h-5 text-text-secondary" />
        </div>
        <div>
            <p className="text-sm font-medium text-text-primary">{label}</p>
            <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">{avg.toLocaleString()}</span> {unit}/day
            </p>
            <p className="text-xs text-text-secondary">
                Total: {total.toLocaleString()} {unit}
            </p>
        </div>
    </div>
);

const WeeklySummaryStats: React.FC<WeeklySummaryStatsProps> = ({ stats }) => {
    const { totals, averages, commitmentScore, commitmentLabel, commitmentColor } = stats;

    return (
        <div className="bg-background p-4 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary">Weekly Report</h3>
                    <p className="text-sm text-text-secondary">Your 7-day summary.</p>
                </div>
                <div className="text-right">
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${commitmentColor.replace('text-', 'bg-')}/10 ${commitmentColor}`}>
                        {commitmentLabel}
                    </span>
                    <p className="font-bold text-2xl text-text-primary mt-1">{commitmentScore}%</p>
                </div>
            </div>
            
             <div className="border-t border-border -mx-4"></div>

            <div className="grid grid-cols-2 gap-3">
                <StatCard icon="calories" label="Calories" avg={averages.calories} total={totals.calories} unit="kcal" />
                <StatCard icon="protein" label="Protein" avg={averages.protein} total={totals.protein} unit="g" />
                <StatCard icon="carbs" label="Carbs" avg={averages.carbs} total={totals.carbs} unit="g" />
                <StatCard icon="fat" label="Fat" avg={averages.fat} total={totals.fat} unit="g" />
            </div>
        </div>
    );
};

export default WeeklySummaryStats;
