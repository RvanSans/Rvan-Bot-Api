const doa = require('../data/doa.json');

module.exports = (app) => {
    app.get('/api/doa', (req, res) => {
        const random = doa[Math.floor(Math.random() * doa.length)];
        res.json({
            status: 'success',
            doa: random
        });
    });
};