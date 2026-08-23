module.exports = (app) => {
    app.get('/api/qrcode', (req, res) => {
        const text = req.query.text || 'https://github.com/RvanSans';
        const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
        
        res.json({
            status: 'success',
            qr_url: qr
        });
    });
};