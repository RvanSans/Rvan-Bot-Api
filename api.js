const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/quote')(app);
require('./routes/doa')(app);
require('./routes/cuaca')(app);
require('./routes/gempa')(app);
require('./routes/qrcode')(app);
require('./routes/downloader')(app);
require('./routes/ai')(app);
require('./routes/apiKey')(app);

app.get('/api', (req, res) => {
    res.json({
        status: 'success',
        message: 'Rvan-Bot-API is running!',
        endpoints: [
            '/api/quote',
            '/api/doa',
            '/api/cuaca',
            '/api/gempa',
            '/api/translate',
            '/api/qrcode',
            '/api/tiktok?url=...',
            '/api/download?url=...',
            '/api/ai?text=Halo',
            '/api/searchimage?q=kucing',
            '/api/register (POST)',
            '/api/login (POST)',
            '/api/cekkey?apikey=...'
        ]
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`✅ Rvan-Bot-API running on http://localhost:${port}`);
});
