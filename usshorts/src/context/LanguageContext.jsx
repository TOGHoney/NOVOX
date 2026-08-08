import { createContext, useContext, useMemo, useState } from 'react';

export const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'ja', label: 'Japanese' },
];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [targetLanguage, setTargetLanguage] = useState('en');

    const value = useMemo(() => ({ targetLanguage, setTargetLanguage }), [targetLanguage]);

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
