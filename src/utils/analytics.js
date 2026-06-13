/**
 * Accumulates and calculates transaction vectors into categorical breakdown summaries.
 * @param {Array} transactions - Plain transaction arrays direct from database.
 */
exports.computeCategoryBreakdown = (transactions) => {
    const breakdown = {};
    transactions.forEach(tx => {
        if (tx.type === 'expense') {
            breakdown[tx.category] = (breakdown[tx.category] || 0) + tx.amount;
        }
    });
    return breakdown;
};

/**
 * Builds standard month-by-month financial transaction metrics.
 * @param {Array} transactions - Active transaction records array.
 */
exports.computeMonthlyTrends = (transactions) => {
    const trends = {};
    transactions.forEach(tx => {
        const dateObj = new Date(tx.date);
        const monthKey = dateObj.toLocaleString('en-US', { month: 'short', year: 'numeric' }); // Format as "Jun 2026"
        
        if (!trends[monthKey]) {
            trends[monthKey] = { income: 0, expenses: 0, savings: 0 };
        }
        
        if (tx.type === 'income') trends[monthKey].income += tx.amount;
        if (tx.type === 'expense') trends[monthKey].expenses += tx.amount;
        
        trends[monthKey].savings = trends[monthKey].income - trends[monthKey].expenses;
    });
    return trends;
};