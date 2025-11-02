import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { View } from '../../types';
import Icon from './Icon';

interface BottomNavProps {
    currentView: View;
    onChangeView: (view: View) => void;
    onQuickAddClick: () => void;
}

const navItems: { view: View; icon: React.ComponentProps<typeof Icon>['name'] }[] = [
    // FIX: Changed view from 'list' to 'history' to match the View type.
    { view: 'history', icon: 'list' },
    { view: 'dashboard', icon: 'dashboard' },
    { view: 'meals', icon: 'food' },
    { view: 'settings', icon: 'wrench' },
];

const NavItem: React.FC<{
    item: { view: View; icon: React.ComponentProps<typeof Icon>['name'] };
    isActive: boolean;
    onClick: () => void;
}> = ({ item, isActive, onClick }) => (
    <button
        onClick={onClick}
        className="relative flex flex-col items-center justify-center w-16 h-16 transition-colors duration-300 outline-none"
        aria-label={item.view}
    >
        <Icon
            name={item.icon}
            className={`w-7 h-7 z-10 transition-colors ${isActive ? 'text-primary' : 'text-text-secondary/60 hover:text-text-primary'}`}
        />
        <AnimatePresence>
            {isActive && (
                <motion.div
                    layoutId="active-nav-dot"
                    className="absolute bottom-2 h-1.5 w-1.5 bg-primary rounded-full"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            )}
        </AnimatePresence>
    </button>
);


const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView, onQuickAddClick }) => {
    return (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 h-24 w-full max-w-lg flex justify-center z-50">
            <div className="relative flex items-center">
                 <div className="flex items-center justify-around bg-card/50 backdrop-blur-lg border border-border/10 shadow-2xl shadow-black/10 dark:shadow-black/20 rounded-full h-16 px-4 space-x-4">
                    <NavItem item={{ view: 'history', icon: 'list' }} isActive={currentView === 'history'} onClick={() => onChangeView('history')} />
                    <NavItem item={{ view: 'dashboard', icon: 'dashboard' }} isActive={currentView === 'dashboard'} onClick={() => onChangeView('dashboard')} />
                    <div className="w-12 h-12" />
                    <NavItem item={{ view: 'meals', icon: 'food' }} isActive={currentView === 'meals'} onClick={() => onChangeView('meals')} />
                    <NavItem item={{ view: 'settings', icon: 'wrench' }} isActive={currentView === 'settings'} onClick={() => onChangeView('settings')} />
                </div>

                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[calc(50%+10px)]">
                     <button
                        onClick={onQuickAddClick}
                        className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/40 transform transition-transform hover:scale-105"
                        aria-label="Quick Add Meal"
                    >
                        <Icon name="leaf" className="w-10 h-10" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;