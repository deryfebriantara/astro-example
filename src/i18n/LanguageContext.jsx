import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
	const [language, setLanguage] = useState('en');

	// Load language from localStorage on mount
	useEffect(() => {
		const savedLang = localStorage.getItem('language');
		if (savedLang && (savedLang === 'en' || savedLang === 'id')) {
			setLanguage(savedLang);
		}
	}, []);

	// Save language to localStorage when it changes
	const changeLanguage = (lang) => {
		setLanguage(lang);
		localStorage.setItem('language', lang);
		// Reload page to update Astro components
		window.location.reload();
	};

	const t = translations[language];

	return (
		<LanguageContext.Provider value={{ language, changeLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within LanguageProvider');
	}
	return context;
}
