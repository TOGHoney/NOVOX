const BASE_URL = process.env.LIBRETRANSLATE_URL || 'http://localhost:5002';
const TIMEOUT_MS = 120000;

const cache = new Map();
const CACHE_TTL = 60 * 60 * 1000;

function getCached(key) {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.data;
    }
    cache.delete(key);
    return null;
}

function setCache(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}

async function translateTexts(texts, target, source = 'auto') {
    const results = new Array(texts.length);
    const missing = [];

    for (let i = 0; i < texts.length; i++) {
        const text = texts[i];
        const cacheKey = `${source}:${target}:${text}`;
        const cached = getCached(cacheKey);
        if (cached !== null) {
            results[i] = cached;
        } else {
            missing.push({ index: i, text, cacheKey });
        }
    }

    if (missing.length > 0) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        let response;
        try {
            response = await fetch(`${BASE_URL}/translate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    q: missing.map((item) => item.text),
                    source,
                    target,
                    format: 'text',
                }),
                signal: controller.signal,
            });
        } finally {
            clearTimeout(timeout);
        }

        if (!response.ok) {
            const detail = await response.text().catch(() => '');
            throw new Error(`LibreTranslate error (${response.status}): ${detail.slice(0, 200)}`);
        }

        const data = await response.json();
        const translatedList = Array.isArray(data)
            ? data
            : data.translatedText ?? data.translatedTexts;

        if (!Array.isArray(translatedList)) {
            throw new Error('Unexpected LibreTranslate response');
        }

        for (let j = 0; j < missing.length; j++) {
            const translated = translatedList[j] ?? '';
            setCache(missing[j].cacheKey, translated);
            results[missing[j].index] = translated;
        }
    }

    return results;
}

module.exports = { translateTexts, BASE_URL };
