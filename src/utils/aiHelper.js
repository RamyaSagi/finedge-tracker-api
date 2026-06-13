/**
 * @fileoverview Automated classification and financial intelligence advice generator.
 * @module utils/aiHelper
 */

/**
 * Automatically predicts clean categories based on natural language text keyword strings.
 * @param {string} description - The item description text.
 * @returns {string} Categorization prediction string.
 */
exports.autoCategorize = (description) => {
    if (!description) return 'Miscellaneous';
    const text = description.toLowerCase();
    
    if (text.includes('uber') || text.includes('rapido') || text.includes('petrol') || text.includes('metro') || text.includes('ola')) return 'Transportation';
    if (text.includes('mcdonalds') || text.includes('zomato') || text.includes('restaurant') || text.includes('swiggy')) return 'Dining Out';
    if (text.includes('netflix') || text.includes('spotify') || text.includes('prime') || text.includes('cinema')  || text.includes('movie')) return 'Entertainment';
    if (text.includes('walmart') || text.includes('veggies') || text.includes('groceries') || text.includes('whole foods')) return 'Groceries';
    if (text.includes('salary') || text.includes('freelance') || text.includes('bonus') || text.includes('dividend')) return 'Income Source';
    
    return 'Utilities';
};

/**
 * Runs rule-based analytical checks to generate dynamic cash optimization guidance tips.
 * @param {number} income - Gross earnings.
 * @param {number} expenses - Net costs.
 * @returns {Array<string>} Algorithmic suggestions data array.
 */
exports.generateSavingTips = (income, expenses) => {
    const tips = [];
    if (income === 0) return ["No active revenue data found. Post your primary income source to begin modeling recommendations."];
    
    const burnRate = (expenses / income) * 100;
    
    if (burnRate > 75) {
        tips.push("⚠️ High financial alert: Your spending exceeds 75% of total income. We suggest establishing strict monthly category targets.");
    } else if (burnRate > 50) {
        tips.push("💡 Optimization advisory: You are spending more than half your earnings. Review food and entertainment categories for potential savings.");
    } else {
        tips.push("⭐ Excellent operational discipline: Your spending burn rate is below 50%. Consider shifting remaining funds into your savings target.");
    }
    
    return tips;
};