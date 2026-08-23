const quotes = require('../data/quotes.json');

module.exports = (app) => {
    app.get('/api/quote', (req, res) => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        res.json({
            status: 'success',
            quote: random
        });
    });
};