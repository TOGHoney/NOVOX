import { FiGlobe } from 'react-icons/fi';
import { LANGUAGES, useLanguage } from '../context/LanguageContext';

export default function LanguageSelector() {
    const { targetLanguage, setTargetLanguage } = useLanguage();

    return (
        <label className="language-select" aria-label="Select translation language">
            <FiGlobe />
            <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
