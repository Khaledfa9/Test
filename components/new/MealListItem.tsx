import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meal } from '../../types';
import Icon from '../common/Icon';

interface MealListItemProps {
    meal: Meal;
    onTrackMeal?: (meal: Meal, weight: number) => void;
    onToggleMainMeal: (id: string) => void;
    onEdit: () => void;
    onDelete: () => void;
}

const MealListItem: React.FC<MealListItemProps> = ({ meal, onTrackMeal, onToggleMainMeal, onEdit, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const menuActions = [
        { label: 'Edit', icon: 'edit' as const, action: onEdit },
        { label: 'Delete', icon: 'delete' as const, action: onDelete, danger: true },
    ];

    return (
        <div className="bg-background p-3 rounded-2xl flex items-center space-x-4">
            <div className="w-16 h-16 bg-border rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {meal.imageUrl ? (
                    <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
                ) : (
                    <Icon name="food" className="w-8 h-8 text-text-secondary/50" />
                )}
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-text-primary truncate">{meal.name}</h3>
                <p className="text-sm text-text-secondary">{meal.caloriesPer100g} kcal / 100g</p>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0" ref={menuRef}>
                <button 
                    onClick={() => onToggleMainMeal(meal.id)} 
                    className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${meal.isMainMeal ? 'text-yellow-400' : 'text-text-secondary hover:text-yellow-400'}`}
                    aria-label={meal.isMainMeal ? "Unmark as main meal" : "Mark as main meal"}
                >
                    <Icon name={meal.isMainMeal ? 'star' : 'star-outline'} className="w-5 h-5" />
                </button>
                {onTrackMeal && (
                     <button 
                        onClick={() => onTrackMeal(meal, meal.defaultWeight)} 
                        className="w-9 h-9 flex items-center justify-center rounded-full text-primary hover:bg-primary/10"
                        aria-label={`Track ${meal.name}`}
                     >
                        <Icon name="add" className="w-6 h-6" />
                    </button>
                )}
                <div className="relative">
                    <button 
                        onClick={() => setMenuOpen(!menuOpen)} 
                        className="w-9 h-9 flex items-center justify-center rounded-full text-text-secondary hover:bg-border"
                        aria-label="More options"
                    >
                        <Icon name="more-horizontal" className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.1 }}
                                className="absolute top-full right-0 mt-2 w-40 bg-card rounded-lg shadow-xl border border-border z-10 overflow-hidden"
                            >
                                {menuActions.map(item => (
                                     <button 
                                        key={item.label} 
                                        onClick={() => { item.action(); setMenuOpen(false); }} 
                                        className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 ${item.danger ? 'text-danger hover:bg-danger/10' : 'text-text-primary hover:bg-background'}`}
                                     >
                                        <Icon name={item.icon} className="w-4 h-4" />
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MealListItem;