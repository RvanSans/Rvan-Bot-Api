const axios = require('axios');

async function fetchData(url) {
    try {
        const response = await axios.get(url, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch: ${error.message}`);
    }
}

module.exports = { fetchData };