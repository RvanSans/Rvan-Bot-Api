module.exports = (app) => {
    app.get('/api/cuaca', (req, res) => {
        const kota = req.query.kota || 'Jakarta';
        res.json({
            status: 'success',
            kota: kota,
            cuaca: 'Cerah',
            suhu: '32°C',
            kelembaban: '65%'
        });
    });
};