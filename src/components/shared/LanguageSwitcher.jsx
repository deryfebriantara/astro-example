import { useState, useEffect } from 'react';

export default function LanguageSwitcher() {
	const [language, setLanguage] = useState('en');
	const [isOpen, setIsOpen] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		// Get language from localStorage or cookie
		const savedLang = localStorage.getItem('language') ||
			document.cookie.split('; ').find(row => row.startsWith('language='))?.split('=')[1] ||
			'en';
		setLanguage(savedLang);
	}, []);

	const changeLanguage = (lang) => {
		setLanguage(lang);
		localStorage.setItem('language', lang);
		// Set cookie for server-side
		document.cookie = `language=${lang}; path=/; max-age=31536000`;
		// Reload to update Astro components
		setTimeout(() => {
			window.location.reload();
		}, 100);
	};

	if (!mounted) {
		return null;
	}

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
			>
				<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
					/>
				</svg>
				<span className="font-medium uppercase text-sm">{language}</span>
				<svg
					className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<>
					{/* Backdrop */}
					<div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>

					{/* Dropdown */}
					<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
						<button
							onClick={() => {
								changeLanguage('en');
								setIsOpen(false);
							}}
							className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3 ${
								language === 'en' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
							}`}
						>
							<span className="text-2xl">🇬🇧</span>
							<div>
								<p className="font-medium">English</p>
								<p className="text-xs text-gray-500">English</p>
							</div>
							{language === 'en' && (
								<svg className="w-5 h-5 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>

						<button
							onClick={() => {
								changeLanguage('id');
								setIsOpen(false);
							}}
							className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center gap-3 ${
								language === 'id' ? 'bg-primary-50 text-primary-600' : 'text-gray-700'
							}`}
						>
							<span className="text-2xl">🇮🇩</span>
							<div>
								<p className="font-medium">Indonesia</p>
								<p className="text-xs text-gray-500">Bahasa Indonesia</p>
							</div>
							{language === 'id' && (
								<svg className="w-5 h-5 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20">
									<path
										fillRule="evenodd"
										d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							)}
						</button>
					</div>
				</>
			)}
		</div>
	);
}
