import { translations, type Language } from './translations';

export function getLanguageFromCookie(cookieString?: string): Language {
	if (!cookieString) return 'en';

	const cookies = cookieString.split(';').reduce((acc, cookie) => {
		const [key, value] = cookie.trim().split('=');
		acc[key] = value;
		return acc;
	}, {} as Record<string, string>);

	const lang = cookies['language'];
	return (lang === 'id' ? 'id' : 'en') as Language;
}

export function getTranslations(lang: Language) {
	return translations[lang];
}
