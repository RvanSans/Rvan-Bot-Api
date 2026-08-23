module.exports = (app) => {
    app.get('/api/gempa', async (req, res) => {
        try {
            const axios = require('axios');
            const response = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json');
            const gempa = response.data.Infogempa.gempa;
            
            res.json({
                status: 'success',
                data: {
                    magnitude: gempa.Magnitude || 'Tidak tersedia',
                    kedalaman: gempa.Kedalaman || 'Tidak tersedia',
                    lokasi: gempa.Wilayah || 'Tidak tersedia',
                    waktu: gempa.Tanggal && gempa.Jam ? `${gempa.Tanggal} ${gempa.Jam}` : 'Tidak tersedia',
                    potensi: gempa.Potensi || 'Tidak tersedia'
                }
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: 'Gagal ambil data gempa: ' + error.message
            });
        }
    });
};