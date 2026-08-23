let currentApiKey = '';
let currentUser = '';

// ─── NAVIGASI ───
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));

    if (page === 'home') {
        document.getElementById('pageHome').classList.add('active');
        document.getElementById('navHome').classList.add('active');
    } else if (page === 'docs') {
        document.getElementById('pageDocs').classList.add('active');
        document.getElementById('navDocs').classList.add('active');
    } else if (page === 'pricing') {
        document.getElementById('pagePricing').classList.add('active');
        document.getElementById('navPricing').classList.add('active');
    } else if (page === 'auth') {
        document.getElementById('pageAuth').classList.add('active');
        document.getElementById('navAuth').classList.add('active');
        document.getElementById('navAuth').textContent = '🔐 Account';
    }

    document.querySelector('.nav-menu').classList.remove('open');
    document.getElementById('navToggle').classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ─── MOBILE MENU ───
document.getElementById('navToggle').addEventListener('click', function() {
    document.querySelector('.nav-menu').classList.toggle('open');
    this.classList.toggle('open');
});

// ─── SCROLL NAVBAR ───
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ─── TABS ───
function switchTab(tab) {
    const regForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const tabReg = document.getElementById('tabRegister');
    const tabLog = document.getElementById('tabLogin');

    if (tab === 'register') {
        regForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        tabReg.classList.add('active');
        tabLog.classList.remove('active');
    } else {
        regForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        tabReg.classList.remove('active');
        tabLog.classList.add('active');
    }
}

// ─── TOAST ───
function showToast(message, type = '') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast ' + type;
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.add('hidden');
    }, 4000);
}

// ─── LOADING ───
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('hidden');
    } else {
        spinner.classList.add('hidden');
    }
}

// ─── REGISTER ───
async function register() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    const wa = document.getElementById('regWa').value.trim();

    if (!username || !password || !wa) {
        return showToast('Semua field wajib diisi!', 'error');
    }

    showLoading(true);
    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, wa })
        });
        const data = await res.json();
        showLoading(false);

        if (data.status === 'success') {
            showToast('✅ Registrasi berhasil! Silakan login.', 'success');
            document.getElementById('loginUsername').value = username;
            document.getElementById('loginPassword').value = password;
            localStorage.setItem('rvan_username', username);
            localStorage.setItem('rvan_password', password);
            switchTab('login');
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (e) {
        showLoading(false);
        showToast('❌ Gagal: ' + e.message, 'error');
    }
}

// ─── LOGIN ───
async function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        return showToast('Username dan password wajib diisi!', 'error');
    }

    showLoading(true);
    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        showLoading(false);

        if (data.status === 'success') {
            currentApiKey = data.apiKey;
            currentUser = username;
            localStorage.setItem('rvan_username', username);
            localStorage.setItem('rvan_password', password);
            localStorage.setItem('rvan_apikey', currentApiKey);

            document.getElementById('apiKeyDisplay').textContent = currentApiKey;
            document.getElementById('userName').textContent = username;
            document.getElementById('authPage').classList.add('hidden');
            document.getElementById('dashboardPage').classList.remove('hidden');
            document.getElementById('navAuth').textContent = '👤 ' + username;

            await refreshStats();
            showToast('✅ Login berhasil!', 'success');
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (e) {
        showLoading(false);
        showToast('❌ Gagal: ' + e.message, 'error');
    }
}

// ─── LOGOUT ───
function logout() {
    currentApiKey = '';
    currentUser = '';
    localStorage.removeItem('rvan_username');
    localStorage.removeItem('rvan_password');
    localStorage.removeItem('rvan_apikey');

    document.getElementById('dashboardPage').classList.add('hidden');
    document.getElementById('authPage').classList.remove('hidden');
    document.getElementById('navAuth').textContent = '🔐 Account';
    document.getElementById('resultText').textContent = '💡 Tap a card to test the endpoint';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';

    document.getElementById('statPlan').textContent = '-';
    document.getElementById('statRequests').textContent = '0';
    document.getElementById('statSince').textContent = '-';

    showToast('🔓 Logout berhasil', '');
}

// ─── COPY API KEY ───
function copyApiKey() {
    const key = document.getElementById('apiKeyDisplay').textContent;
    if (key && key !== '••••••••') {
        navigator.clipboard.writeText(key).then(() => {
            showToast('📋 API Key copied!', 'success');
        }).catch(() => {
            showToast('❌ Gagal copy', 'error');
        });
    } else {
        showToast('❌ Tidak ada API Key', 'error');
    }
}

// ─── REGENERATE API KEY ───
async function regenerateKey() {
    if (!currentUser) return showToast('❌ Silakan login dulu!', 'error');

    const password = prompt('🔒 Masukkan password untuk konfirmasi:');
    if (!password) return;

    showLoading(true);
    try {
        const res = await fetch('/api/regenerate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser, password })
        });
        const data = await res.json();
        showLoading(false);

        if (data.status === 'success') {
            currentApiKey = data.apiKey;
            localStorage.setItem('rvan_apikey', currentApiKey);
            document.getElementById('apiKeyDisplay').textContent = currentApiKey;
            showToast('✅ API Key berhasil digenerate ulang!', 'success');
        } else {
            showToast('❌ ' + data.message, 'error');
        }
    } catch (e) {
        showLoading(false);
        showToast('❌ Gagal: ' + e.message, 'error');
    }
}

// ─── REFRESH STATS ───
async function refreshStats() {
    if (!currentApiKey) return showToast('❌ Silakan login dulu!', 'error');

    try {
        const res = await fetch(`/api/stats?apikey=${currentApiKey}`);
        const data = await res.json();

        if (data.status === 'success') {
            document.getElementById('statPlan').textContent = data.data.plan || 'Free';
            document.getElementById('statRequests').textContent = data.data.requests || 0;
            if (data.data.createdAt) {
                const date = new Date(data.data.createdAt);
                document.getElementById('statSince').textContent = date.toLocaleDateString('id-ID');
            }
        }
    } catch (e) {
        // Silent fail
    }
}

// ─── TEST API ───
async function testAPI(endpoint) {
    if (!currentApiKey) {
        return showToast('❌ Silakan login dulu!', 'error');
    }

    const resultText = document.getElementById('resultText');
    resultText.textContent = '⏳ Loading...';

    try {
        const url = endpoint + (endpoint.includes('?') ? '&' : '?') + 'apikey=' + currentApiKey;
        const res = await fetch(url);
        const data = await res.json();
        resultText.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        resultText.textContent = '❌ Error: ' + e.message;
    }
}

// ─── CUSTOM TEST ───
async function testCustom() {
    const endpoint = document.getElementById('customEndpoint').value.trim();
    if (!endpoint) return showToast('Masukkan endpoint!', 'error');
    if (!currentApiKey) return showToast('Silakan login dulu!', 'error');

    const resultText = document.getElementById('resultText');
    resultText.textContent = '⏳ Loading...';

    try {
        const url = endpoint + (endpoint.includes('?') ? '&' : '?') + 'apikey=' + currentApiKey;
        const res = await fetch(url);
        const data = await res.json();
        resultText.textContent = JSON.stringify(data, null, 2);
    } catch (e) {
        resultText.textContent = '❌ Error: ' + e.message;
    }
}

// ─── BACKSOUND (LEMBUT) ───
const audio = document.getElementById('bgMusic');
if (audio) {
    audio.volume = 0.08;
    audio.play().catch(() => {});
}

// ─── AUTO LOGIN ───
document.addEventListener('DOMContentLoaded', () => {
    const savedUsername = localStorage.getItem('rvan_username');
    const savedPassword = localStorage.getItem('rvan_password');
    const savedApiKey = localStorage.getItem('rvan_apikey');

    if (savedUsername) document.getElementById('loginUsername').value = savedUsername;
    if (savedPassword) document.getElementById('loginPassword').value = savedPassword;

    if (savedApiKey && savedUsername) {
        currentApiKey = savedApiKey;
        currentUser = savedUsername;
        document.getElementById('apiKeyDisplay').textContent = savedApiKey;
        document.getElementById('userName').textContent = savedUsername;
        document.getElementById('authPage').classList.add('hidden');
        document.getElementById('dashboardPage').classList.remove('hidden');
        document.getElementById('navAuth').textContent = '👤 ' + savedUsername;
        refreshStats();
    }

    document.querySelectorAll('#registerForm input, #loginForm input').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const isRegister = input.closest('#registerForm');
                isRegister ? register() : login();
            }
        });
    });
});