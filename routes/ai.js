const { GoogleGenAI } = require("@google/genai");

module.exports = (app) => {
    app.get('/api/ai', async (req, res) => {
        const text = req.query.text || 'Halo';
        
        try {
            const ai = new GoogleGenAI({ 
                apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY 
            });

            const interaction = await ai.interactions.create({
                model: "gemini-3.6-flash", // ← GANTI KE YANG INI
                input: text,
            });

            res.json({ 
                status: 'success', 
                response: interaction.output_text 
            });
        } catch (error) {
            res.json({ 
                status: 'error', 
                message: 'AI error: ' + error.message 
            });
        }
    });
};