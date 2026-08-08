const { translateTexts, BASE_URL } = require('../services/libreTranslateService');

const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de', 'ja'];

async function translate(req, res) {
    const { texts, target, source = 'auto' } = req.body || {};

    if (!Array.isArray(texts) || texts.length === 0) {
        return res.status(400).json({ error: 'An array of texts is required' });
    }
    if (typeof target !== 'string' || !SUPPORTED_LANGUAGES.includes(target)) {
        return res.status(400).json({ error: `Unsupported target language. Allowed: ${SUPPORTED_LANGUAGES.join(', ')}` });
    }

    const cleaned = texts.map((text) => (typeof text === 'string' ? text : '')).filter((text) => text.trim().length > 0);
    if (cleaned.length === 0) {
        return res.json({ translations: [] });
    }

    try {
        const translations = await translateTexts(cleaned, target, source);
        return res.json({ translations, serviceUrl: BASE_URL });
    } catch (err) {
        console.error('Translate error:', err.message);
        return res.status(503).json({ error: 'Translation service unavailable' });
    }
}

module.exports = { translate };
