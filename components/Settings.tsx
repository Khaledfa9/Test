import React, { useState } from 'react';
import { DailyGoals } from '../types';
import Icon from './common/Icon';

interface SettingsProps {
    currentGoals: DailyGoals;
    onSaveGoals: (newGoals: DailyGoals) => void;
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    accent: string;
    setAccent: (accent: string) => void;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const accentColors = [
    { id: 'green', name: 'Aqua', color: '#71C9CE' },
    { id: 'blue', name: 'Sky', color: '#A0D2EB' },
    { id: 'rose', name: 'Salmon', color: '#F9B4AB' },
    { id: 'violet', name: 'Lavender', color: '#C3B1E1' },
    { id: 'gold', name: 'Gold', color: '#FDEB9E' },
    { id: 'teal', name: 'Teal', color: '#006A67' },
    { id: 'slate', name: 'Slate', color: '#5D688A' },
    { id: 'ruby', name: 'Ruby', color: '#DA6C6C' },
];

const InputField: React.FC<{ 
    label: string; 
    name: keyof DailyGoals; 
    icon: React.ComponentProps<typeof Icon>['name'];
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, icon, value, onChange }) => (
    <div className="bg-background p-4 rounded-xl">
        <label className="flex items-center space-x-3">
             <Icon name={icon} className="h-6 w-6 text-text-secondary flex-shrink-0" />
            <div className="flex-grow">
                <span className="text-text-secondary font-medium text-sm">{label}</span>
                <input
                    type="number"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="block w-full bg-transparent text-lg font-bold text-text-primary focus:outline-none"
                />
            </div>
        </label>
    </div>
);


const Settings: React.FC<SettingsProps> = ({ currentGoals, onSaveGoals, theme, setTheme, accent, setAccent, showToast }) => {
    const [goals, setGoals] = useState<DailyGoals>(currentGoals);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGoals(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    };

    const handleSave = () => {
        onSaveGoals(goals);
        showToast('Goals updated successfully!', 'success');
    };
    
    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="space-y-6">
            <header className="px-2">
                 <p className="text-text-secondary">App Customization</p>
                <h1 className="text-4xl font-bold text-text-primary tracking-tighter">Settings</h1>
            </header>
            
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-text-primary px-2">Daily Goals</h2>
                <div className="grid grid-cols-2 gap-3">
                    <InputField label="Calories (kcal)" name="calories" icon="calories" value={goals.calories} onChange={handleChange} />
                    <InputField label="Proteins (g)" name="protein" icon="proteins" value={goals.protein} onChange={handleChange} />
                    <InputField label="Carbs (g)" name="carbs" icon="carbs" value={goals.carbs} onChange={handleChange} />
                    <InputField label="Fats (g)" name="fat" icon="fats" value={goals.fat} onChange={handleChange} />
                </div>
                 <div className="pt-2">
                    <button onClick={handleSave} className="w-full bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-accent transition-colors">
                        Save Goals
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                 <h2 className="text-xl font-bold text-text-primary px-2">Appearance</h2>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-background rounded-xl">
                        <span className="text-text-primary font-medium">Theme</span>
                        <div className="flex items-center space-x-2 p-1 bg-border rounded-full">
                            <button
                                onClick={() => setTheme('light')}
                                className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-card shadow' : ''}`}
                            >
                                <Icon name="sun" className="w-5 h-5"/>
                            </button>
                             <button
                                onClick={() => setTheme('dark')}
                                className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-card shadow' : ''}`}
                            >
                                <Icon name="moon" className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                     <div className="p-4 bg-background rounded-xl">
                        <span className="text-text-primary font-medium">Accent Color</span>
                        <div className="mt-3 flex flex-wrap gap-3">
                            {accentColors.map((color) => (
                                <button
                                    key={color.id}
                                    type="button"
                                    onClick={() => setAccent(color.id)}
                                    className={`w-10 h-10 rounded-full transition-all flex items-center justify-center text-white`}
                                    style={{ backgroundColor: color.color }}
                                    aria-label={`Select ${color.name} theme`}
                                >
                                {accent === color.id && <Icon name="check" className="w-5 h-5"/>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;