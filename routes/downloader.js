const ytdlp = require('yt-dlp-exec');

module.exports = (app) => {
    // ─── DOWNLOADER UNIVERSAL (YT-DLP) ───
    app.get('/api/download', async (req, res) => {
        const url = req.query.url;
        if (!url) {
            return res.json({ 
                status: 'error', 
                message: 'Parameter url wajib diisi!' 
            });
        }

        try {
            const result = await ytdlp(url, {
                dumpSingleJson: true,
                noWarnings: true,
                noCheckCertificate: true,
                preferFreeFormats: true,
                addHeader: ['referer:youtube.com', 'origin:youtube.com']
            });

            const formats = result.formats || [];
            const video = formats.find(f => f.vcodec !== 'none' && f.acodec === 'none') || formats[0];
            const audio = formats.find(f => f.vcodec === 'none' && f.acodec !== 'none');

            res.json({
                status: 'success',
                data: {
                    title: result.title || 'Unknown',
                    video: video?.url || null,
                    audio: audio?.url || null,
                    thumbnail: result.thumbnail || null,
                    source: 'yt-dlp'
                }
            });
        } catch (error) {
            res.json({
                status: 'error',
                message: 'Gagal download: ' + error.message
            });
        }
    });
};