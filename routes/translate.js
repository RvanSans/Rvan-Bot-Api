const translate = require('translate-google');

module.exports = (app) => {
    app.get('/api/translate', async (req, res) => {
        const text = req.query.text || 'Hello';
        const target = req.query.target || 'id';

        try {
            const result = await translate(text, { to: target });
            res.json({
                status: 'success',
                original: text,
                translated: result,
                target: target
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: 'Gagal translate: ' + error.message
            });
        }
    });
};