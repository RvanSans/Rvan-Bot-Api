const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DB_PATH = path.join(__dirname, '..', 'database', 'users.json');

function readDB() {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({}));
        return {};
    }
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

module.exports = (app) => {
    app.post('/api/register', async (req, res) => {
        const { username, password, wa } = req.body;

        if (!username || !password || !wa) {
            return res.json({ status: 'error', message: 'Semua field wajib diisi!' });
        }

        if (username.length < 3) {
            return res.json({ status: 'error', message: 'Username minimal 3 karakter!' });
        }

        if (password.length < 6) {
            return res.json({ status: 'error', message: 'Password minimal 6 karakter!' });
        }

        const cleanWa = wa.replace(/[^0-9]/g, '');
        if (!/^[0-9]{10,15}$/.test(cleanWa)) {
            return res.json({ 
                status: 'error', 
                message: '❌ Nomor HP tidak valid! Masukkan 10-15 digit angka saja' 
            });
        }

        const db = readDB();
        
        if (db[username]) {
            return res.json({ status: 'error', message: 'Username sudah terdaftar!' });
        }

        for (const key in db) {
            if (db[key].wa === cleanWa) {
                return res.json({ status: 'error', message: 'Nomor HP sudah terdaftar!' });
            }
        }

        const apiKey = uuidv4().replace(/-/g, '').slice(0, 16);
        const hashedPassword = bcrypt.hashSync(password, 10);

        db[username] = {
            username,
            password: hashedPassword,
            wa: cleanWa,
            apiKey,
            plan: 'free',
            createdAt: new Date().toISOString(),
            requests: 0,
            lastRequest: null
        };

        writeDB(db);

        res.json({
            status: 'success',
            message: '✅ Registrasi berhasil!',
            apiKey: apiKey,
            wa: cleanWa
        });
    });

    app.post('/api/login', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ status: 'error', message: 'Username dan password wajib diisi!' });
        }

        const db = readDB();
        const user = db[username];

        if (!user) {
            return res.json({ status: 'error', message: 'Username tidak ditemukan!' });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.json({ status: 'error', message: 'Password salah!' });
        }

        user.lastLogin = new Date().toISOString();
        writeDB(db);

        res.json({
            status: 'success',
            message: '✅ Login berhasil!',
            apiKey: user.apiKey,
            username: user.username,
            plan: user.plan,
            wa: user.wa
        });
    });

    app.get('/api/cekkey', (req, res) => {
        const apiKey = req.query.apikey;

        if (!apiKey) {
            return res.json({ status: 'error', message: 'Parameter apikey wajib diisi!' });
        }

        const db = readDB();
        let found = null;
        let username = '';

        for (const key in db) {
            if (db[key].apiKey === apiKey) {
                found = db[key];
                username = key;
                break;
            }
        }

        if (!found) {
            return res.json({ status: 'error', message: 'API Key tidak valid!' });
        }

        found.requests = (found.requests || 0) + 1;
        found.lastRequest = new Date().toISOString();
        writeDB(db);

        res.json({
            status: 'success',
            message: 'API Key valid!',
            username: username,
            wa: found.wa,
            plan: found.plan || 'free',
            requests: found.requests || 0
        });
    });

    app.post('/api/regenerate', async (req, res) => {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.json({ status: 'error', message: 'Username dan password wajib diisi!' });
        }

        const db = readDB();
        const user = db[username];

        if (!user) {
            return res.json({ status: 'error', message: 'Username tidak ditemukan!' });
        }

        const isValid = bcrypt.compareSync(password, user.password);
        if (!isValid) {
            return res.json({ status: 'error', message: 'Password salah!' });
        }

        const newApiKey = uuidv4().replace(/-/g, '').slice(0, 16);
        user.apiKey = newApiKey;
        user.regeneratedAt = new Date().toISOString();
        writeDB(db);

        res.json({
            status: 'success',
            message: '✅ API Key berhasil digenerate ulang!',
            apiKey: newApiKey
        });
    });

    app.get('/api/stats', (req, res) => {
        const apiKey = req.query.apikey;

        if (!apiKey) {
            return res.json({ status: 'error', message: 'Parameter apikey wajib diisi!' });
        }

        const db = readDB();
        let found = null;

        for (const key in db) {
            if (db[key].apiKey === apiKey) {
                found = db[key];
                break;
            }
        }

        if (!found) {
            return res.json({ status: 'error', message: 'API Key tidak valid!' });
        }

        res.json({
            status: 'success',
            data: {
                username: found.username,
                wa: found.wa,
                plan: found.plan || 'free',
                requests: found.requests || 0,
                createdAt: found.createdAt,
                lastRequest: found.lastRequest || null
            }
        });
    });

    app.get('/api/ping', (req, res) => {
        res.json({
            status: 'success',
            message: 'pong',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    });
};