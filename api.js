const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// ─── REGISTER ROUTES ───
require('./routes/quote')(app);
require('./routes/doa')(app);
require('./routes/cuaca')(app);
require('./routes/gempa')(app);
require('./routes/translate')(app);
require('./routes/qrcode')(app);
require('./routes/downloader')(app);  // ← TAMBAH
require('./routes/ai')(app);          // ← TAMBAH
require('./routes/downloader')(app);
require('dotenv').config();

// ─── HOME ───
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Rvan-Bot-API is running!',
        endpoints: [
            '/api/quote',
            '/api/doa',
            '/api/cuaca',
            '/api/gempa',
            '/api/translate',
            '/api/qrcode'
        ]
    });
});

// ─── JALANKAN ───
app.listen(port, () => {
    console.log(`✅ Rvan-Bot-API running on http://localhost:${port}`);
});