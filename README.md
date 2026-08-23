<!-- ─── BADGE ─── -->
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-MIT-yellow)
![Status](https://img.shields.io/badge/status-active-success)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Visitors](https://api.visitorbadge.io/api/visitors?path=RvanSans%2FRvan-Bot-API&label=Visitors&countColor=%23263759)

<!-- ─── HEADER ─── -->
<div align="center">
  <img src="https://cdn.phototourl.com/free/2026-08-23-37b4ca75-6963-4795-a1b2-d076569c7498.png" width="120" height="120" style="border-radius:20px;">
  <h1>🚀 Rvan-Bot-API</h1>
  <p><strong>Modern REST API for WhatsApp Bot</strong></p>
  <p>
    <a href="https://rvan-bot-api.onrender.com">🌐 Live Demo</a>
    <a href="https://github.com/RvanSans/Rvan-Bot-API/issues">🐛 Report Bug</a>
    <a href="https://github.com/RvanSans/Rvan-Bot-API/discussions">💬 Discussions</a>
  </p>
</div>

---

## 📌 Features

| Feature | Endpoint | Status |
|---------|----------|--------|
| 🤖 AI Chat | `/api/ai?text=Halo` | ✅ |
| 🎵 TikTok | `/api/tiktok?url=...` | ✅ |
| 📥 Downloader | `/api/download?url=...` | ✅ |
| 📖 Quote | `/api/quote` | ✅ |
| 📿 Doa | `/api/doa` | ✅ |
| 🌤️ Cuaca | `/api/cuaca?kota=Jakarta` | ✅ |
| 🌋 Gempa | `/api/gempa` | ✅ |
| 🔄 Translate | `/api/translate?text=Hello&target=id` | ✅ |
| 📱 QR Code | `/api/qrcode?text=Halo` | ✅ |
| 🖼️ Search Image | `/api/searchimage?q=kucing` | ✅ |
| 🔐 API Key | `/api/register` (POST) | ✅ |

---

## 🛠️ Tech Stack

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" height="35">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" height="35">
  <img src="https://img.shields.io/badge/Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" height="35">
  <img src="https://img.shields.io/badge/yt--dlp-FF0000?style=for-the-badge&logo=youtube&logoColor=white" height="35">
  <img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" height="35">
</p>

---

## 🚀 Quick Start

```bash
git clone https://github.com/RvanSans/Rvan-Bot-API.git
cd Rvan-Bot-API
npm install
cp .env.example .env
# isi .env dengan API key
node api.js
