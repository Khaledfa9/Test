import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { TodayLog, HistoryLog, TrackedMeal, MealCategory, Meal } from '../types';
import CircularProgress from './common/CircularProgress';
import Icon from './common/Icon';
import TrackedMealItem from './common/TrackedMealItem';
import SaveDayModal from './SaveDayModal';
import MacroSummary from './new/MacroSummary';
import CollapsibleSection from './new/CollapsibleSection';
import MealDetail from './MealDetail';

interface DashboardProps {
    todaysLog: TodayLog;
    history: HistoryLog[];
    meals: Meal[];
    onRemoveTrackedMeal: (id: string) => void;
    onSaveDay: (date: Date) => void;
    onToggleEaten: (id: string) => void;
    onUpdateWeight: (id: string, newWeight: number) => void;
    onTrackAllMainMeals: () => void;
}

const welcomeMessages = [
    "Welcome back, Khaled!",
    "Hello Khaled, let's track!",
    "Good to see you, Khaled!",
    "Let's make today count, Khaled!",
    "What's on the menu, Khaled?"
];

const Dashboard: React.FC<DashboardProps> = ({ 
    todaysLog, 
    meals,
    onRemoveTrackedMeal, 
    onSaveDay, 
    onToggleEaten, 
    onUpdateWeight, 
    onTrackAllMainMeals,
}) => {
    const [showSaveDayModal, setShowSaveDayModal] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

    const { consumed, goals, meals: trackedMeals } = todaysLog;

    const welcomeMessage = useMemo(() => {
        const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
        return welcomeMessages[randomIndex];
    }, []);

    const calorieProgress = goals.calories > 0 ? (consumed.calories / goals.calories) * 100 : 0;
    
    const groupedMeals = useMemo(() => {
        return trackedMeals.reduce((acc, meal) => {
            const category = meal.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(meal);
            return acc;
        }, {} as Record<MealCategory, TrackedMeal[]>);
    }, [trackedMeals]);

    const handleSelectTrackedMeal = (trackedMeal: TrackedMeal) => {
        if (!trackedMeal.mealId) return; // Don't open for quick-added meals
        const originalMeal = meals.find(m => m.id === trackedMeal.mealId);
        if (originalMeal) {
            setSelectedMeal(originalMeal);
        }
    };

    const categoryOrder: MealCategory[] = [
        MealCategory.Breakfast,
        MealCategory.Lunch,
        MealCategory.Dinner,
        MealCategory.Snacks,
    ];

    return (
        <div className="space-y-6">
            <header className="px-2">
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">{welcomeMessage}</h1>
                <p className="text-text-secondary mt-1">{new Date(todaysLog.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </header>

            <div className="flex justify-center pt-4">
                <CircularProgress 
                    percentage={calorieProgress} 
                    label="Calories"
                    value={consumed.calories}
                    goal={goals.calories}
                    size={180}
                    strokeWidth={14}
                    color="rgb(var(--color-primary))"
                />
            </div>
            
            <MacroSummary consumed={consumed} goals={goals} />
            
            <div className="space-y-4">
                 <div className="flex justify-between items-center px-2">
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">Today's Meals</h2>
                     <div className="flex items-center space-x-2">
                        <button 
                            onClick={onTrackAllMainMeals}
                            className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-full transition-colors hover:bg-primary/20"
                            aria-label="Add all main meals"
                        >
                             <Icon name="star" className="w-5 h-5" />
                        </button>
                     </div>
                 </div>
                 <div className="space-y-2">
                    {categoryOrder.map(category => {
                        const mealsInCategory = groupedMeals[category];
                        if (!mealsInCategory || mealsInCategory.length === 0) {
                            return null;
                        }
                        const totalCalories = mealsInCategory.reduce((sum, meal) => sum + meal.calories, 0);

                        return (
                            <CollapsibleSection 
                                key={category} 
                                title={category}
                                summary={`${totalCalories} kcal`}
                            >
                                <div className="space-y-1 pt-2">
                                    {mealsInCategory.map(meal => (
                                        <TrackedMealItem 
                                            key={meal.id} 
                                            meal={meal} 
                                            onSelect={handleSelectTrackedMeal}
                                            onToggleEaten={onToggleEaten} 
                                            onRemove={onRemoveTrackedMeal}
                                            onUpdateWeight={onUpdateWeight}
                                        />
                                    ))}
                                </div>
                            </CollapsibleSection>
                        );
                    })}
                
                    {trackedMeals.length === 0 && (
                         <div className="text-center py-12 text-text-secondary bg-background rounded-2xl">
                            <p>No meals logged yet.</p>
                            <p className="text-sm">Tap the leaf button to add a meal.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="pt-4">
                 <button onClick={() => setShowSaveDayModal(true)} className="w-full py-3.5 text-center text-white font-semibold bg-primary hover:bg-primary-accent rounded-xl transition-colors shadow-lg shadow-primary/20">
                    Finish & Save Day
                 </button>
            </div>
            <SaveDayModal 
                isOpen={showSaveDayModal}
                onClose={() => setShowSaveDayModal(false)}
                onConfirm={(date) => {
                    onSaveDay(date);
                    setShowSaveDayModal(false);
                }}
            />
            
            <AnimatePresence>
                {selectedMeal && (
                    <MealDetail 
                        meal={selectedMeal}
                        onClose={() => setSelectedMeal(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;