/**
 * @fileoverview Main production daemon execution runner.
 * @module server
 */
const app = require('./app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n================================================================`);
    console.log(`🚀 FinEdge Production API is live and executing seamlessly!`);
    console.log(`🌐 Routing Endpoint Context: http://localhost:${PORT}`);
    console.log(`================================================================\n`);
});