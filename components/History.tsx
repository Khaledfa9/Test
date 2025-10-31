import React, { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DailyGoals, HistoryLog } from '../types';
import Icon from './common/Icon';
import Modal from './common/Modal';
import WeeklyBalanceChart from './common/WeeklyBalanceChart';
import HistoryDetail from './new/HistoryDetail';
import WeeklySummaryStats from './new/WeeklySummaryStats';

interface HistoryProps {
    history: HistoryLog[];
    onDeleteLog: (id: string) => void;
    goals: DailyGoals;
    onResetWeek: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onDeleteLog, goals, onResetWeek }) => {
    const [selectedLog, setSelectedLog] = useState<HistoryLog | null>(null);
    const [logToDelete, setLogToDelete] = useState<HistoryLog | null>(null);

    const handleConfirmDelete = () => {
        if (logToDelete) {
            onDeleteLog(logToDelete.id);
            setLogToDelete(null);
        }
    };

    const weeklyStats = useMemo(() => {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const last7DaysHistory = history.filter(log => {
            const logDate = new Date(log.isoDate);
            return logDate >= sevenDaysAgo && logDate <= today;
        });

        const totals = last7DaysHistory.reduce((acc, log) => {
            acc.calories += log.consumed.calories;
            acc.protein += log.consumed.protein;
            acc.carbs += log.consumed.carbs;
            acc.fat += log.consumed.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        const averages = {
            calories: Math.round(totals.calories / 7),
            protein: Math.round(totals.protein / 7),
            carbs: Math.round(totals.carbs / 7),
            fat: Math.round(totals.fat / 7),
        };

        const commitmentScore = goals.calories > 0 ? (averages.calories / goals.calories) * 100 : 0;
        let commitmentLabel = 'On Track';
        let commitmentColor = 'text-success';
        if (commitmentScore < 85) {
            commitmentLabel = 'Below Goal';
            commitmentColor = 'text-warning';
        } else if (commitmentScore > 100) {
            commitmentLabel = 'Over Limit';
            commitmentColor = 'text-danger';
        }

        return { totals, averages, commitmentScore: Math.round(commitmentScore), commitmentLabel, commitmentColor };
    }, [history, goals.calories]);

    return (
        <div className="space-y-6">
            <header className="px-2 flex justify-between items-start">
                 <div>
                    <p className="text-text-secondary">Your Progress</p>
                    <h1 className="text-4xl font-bold text-text-primary tracking-tighter">History</h1>
                </div>
                 <button onClick={onResetWeek} className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-text-secondary bg-background rounded-lg hover:bg-border transition-colors">
                    <Icon name="reset" className="w-4 h-4" />
                    <span>Reset Week</span>
                </button>
            </header>
            
            <WeeklySummaryStats stats={weeklyStats} />

            <WeeklyBalanceChart history={history} />

            {history.length > 0 ? (
                <div className="space-y-3">
                    {history.map(log => (
                        <div key={log.id} className="bg-background p-4 rounded-2xl transition-all cursor-pointer hover:ring-2 hover:ring-primary" onClick={() => setSelectedLog(log)}>
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-text-primary">{log.date}</h3>
                                    <p className="text-sm text-text-secondary">{new Date(log.isoDate).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                                </div>
                                <div className="text-right">
                                     <p className="font-bold text-lg text-text-primary">{log.consumed.calories} <span className="text-sm font-normal text-text-secondary">kcal</span></p>
                                     <p className="text-sm text-text-secondary">{log.meals.length} items</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-text-secondary bg-background rounded-2xl">
                    <p>No saved logs yet.</p>
                    <p className="text-sm">Your history will appear here after you save a day's log.</p>
                </div>
            )}
            
            <AnimatePresence>
                {selectedLog && (
                    <HistoryDetail 
                        log={selectedLog} 
                        onClose={() => setSelectedLog(null)}
                        onDelete={(id) => {
                            setSelectedLog(null);
                            // a small delay to allow the panel to close before showing the modal
                            setTimeout(() => setLogToDelete(history.find(h => h.id === id) || null), 300);
                        }}
                    />
                )}
            </AnimatePresence>


            <Modal isOpen={!!logToDelete} onClose={() => setLogToDelete(null)} title="Confirm Deletion">
                <p className="text-text-secondary mb-6">Are you sure you want to delete the log for {logToDelete?.date}? This action cannot be undone.</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={() => setLogToDelete(null)} className="px-4 py-2 rounded-lg bg-border text-text-primary font-semibold">Cancel</button>
                    <button onClick={handleConfirmDelete} className="px-4 py-2 rounded-lg bg-danger text-white font-semibold">Delete</button>
                </div>
            </Modal>
        </div>
    );
};

export default History;