import { useState, useEffect } from 'react';
import { translations } from '../../i18n/translations';

export default function FlightSearchForm() {
	const [tripType, setTripType] = useState('round-trip');
	const [origin, setOrigin] = useState('');
	const [destination, setDestination] = useState('');
	const [departDate, setDepartDate] = useState('');
	const [returnDate, setReturnDate] = useState('');
	const [passengers, setPassengers] = useState(1);
	const [travelClass, setTravelClass] = useState('economy');
	const [errors, setErrors] = useState({});
	const [language, setLanguage] = useState('en');

	// Get language from localStorage or cookie
	useEffect(() => {
		const savedLang = localStorage.getItem('language') ||
			document.cookie.split('; ').find(row => row.startsWith('language='))?.split('=')[1] || 'en';
		setLanguage(savedLang);
	}, []);

	const t = translations[language];

	// Popular airports for autocomplete suggestions
	const airports = [
		{ code: 'JFK', city: 'New York', name: 'John F. Kennedy International' },
		{ code: 'LHR', city: 'London', name: 'London Heathrow' },
		{ code: 'CDG', city: 'Paris', name: 'Charles de Gaulle' },
		{ code: 'NRT', city: 'Tokyo', name: 'Narita International' },
		{ code: 'DXB', city: 'Dubai', name: 'Dubai International' },
		{ code: 'SIN', city: 'Singapore', name: 'Singapore Changi' },
		{ code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International' },
		{ code: 'SYD', city: 'Sydney', name: 'Sydney Kingsford Smith' },
		{ code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International' },
		{ code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport' },
	];

	const handleSubmit = (e) => {
		e.preventDefault();

		// Clear previous errors
		const newErrors = {};

		// Validate form
		if (!origin) {
			newErrors.origin = t.search.errors.origin;
		}
		if (!destination) {
			newErrors.destination = t.search.errors.destination;
		}
		if (!departDate) {
			newErrors.departDate = t.search.errors.departDate;
		}
		if (tripType === 'round-trip' && !returnDate) {
			newErrors.returnDate = t.search.errors.returnDate;
		}

		// Check if origin and destination are the same
		if (origin && destination && origin === destination) {
			newErrors.destination = t.search.errors.sameLocation;
		}

		// Check if return date is before departure date
		if (departDate && returnDate && new Date(returnDate) < new Date(departDate)) {
			newErrors.returnDate = t.search.errors.invalidReturnDate;
		}

		// If there are errors, set them and don't submit
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			// Scroll to first error
			const firstErrorElement = document.querySelector('.error-field');
			if (firstErrorElement) {
				firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}
			return;
		}

		// Clear errors
		setErrors({});

		// Navigate to book page with search parameters
		const searchParams = new URLSearchParams({
			origin,
			destination,
			departDate,
			...(tripType === 'round-trip' && returnDate && { returnDate }),
			passengers: passengers.toString(),
			class: travelClass,
			tripType,
		});

		window.location.href = `/book?${searchParams.toString()}`;
	};

	const handleSwapLocations = () => {
		const temp = origin;
		setOrigin(destination);
		setDestination(temp);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Trip Type Tabs */}
			<div className="flex gap-2 border-b border-gray-200 pb-4">
				<button
					type="button"
					onClick={() => setTripType('round-trip')}
					className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
						tripType === 'round-trip'
							? 'bg-primary-600 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					{t.search.tripType.roundTrip}
				</button>
				<button
					type="button"
					onClick={() => setTripType('one-way')}
					className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
						tripType === 'one-way'
							? 'bg-primary-600 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					{t.search.tripType.oneWay}
				</button>
				<button
					type="button"
					onClick={() => setTripType('multi-city')}
					className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
						tripType === 'multi-city'
							? 'bg-primary-600 text-white'
							: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
					}`}
				>
					{t.search.tripType.multiCity}
				</button>
			</div>

			{/* Location and Date Inputs */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{/* Origin */}
				<div className="relative">
					<label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
						{t.search.from}
					</label>
					<div className="relative">
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<input
							type="text"
							id="origin"
							list="origin-airports"
							value={origin}
							onChange={(e) => {
								setOrigin(e.target.value);
								if (errors.origin) setErrors({ ...errors, origin: null });
							}}
							placeholder={t.search.placeholder.city}
							className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
								errors.origin ? 'border-red-500 error-field' : 'border-gray-300'
							}`}
						/>
						<button
							type="button"
							onClick={handleSwapLocations}
							className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
							title="Swap locations"
						>
							<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
								/>
							</svg>
						</button>
					</div>
					{errors.origin && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{errors.origin}
						</p>
					)}
					<datalist id="origin-airports">
						{airports.map((airport) => (
							<option key={airport.code} value={`${airport.code} - ${airport.city}`} />
						))}
					</datalist>
				</div>

				{/* Destination */}
				<div>
					<label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
						{t.search.to}
					</label>
					<div className="relative">
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
							/>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
							/>
						</svg>
						<input
							type="text"
							id="destination"
							list="destination-airports"
							value={destination}
							onChange={(e) => {
								setDestination(e.target.value);
								if (errors.destination) setErrors({ ...errors, destination: null });
							}}
							placeholder={t.search.placeholder.city}
							className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
								errors.destination ? 'border-red-500 error-field' : 'border-gray-300'
							}`}
						/>
					</div>
					{errors.destination && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{errors.destination}
						</p>
					)}
					<datalist id="destination-airports">
						{airports.map((airport) => (
							<option key={airport.code} value={`${airport.code} - ${airport.city}`} />
						))}
					</datalist>
				</div>

				{/* Departure Date */}
				<div>
					<label htmlFor="departDate" className="block text-sm font-medium text-gray-700 mb-2">
						{t.search.departure}
					</label>
					<div className="relative">
						<svg
							className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<input
							type="date"
							id="departDate"
							value={departDate}
							onChange={(e) => {
								setDepartDate(e.target.value);
								if (errors.departDate) setErrors({ ...errors, departDate: null });
							}}
							min={new Date().toISOString().split('T')[0]}
							className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
								errors.departDate ? 'border-red-500 error-field' : 'border-gray-300'
							}`}
						/>
					</div>
					{errors.departDate && (
						<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
								<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
							</svg>
							{errors.departDate}
						</p>
					)}
				</div>

				{/* Return Date */}
				{tripType === 'round-trip' && (
					<div>
						<label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-2">
							{t.search.return}
						</label>
						<div className="relative">
							<svg
								className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
								/>
							</svg>
							<input
								type="date"
								id="returnDate"
								value={returnDate}
								onChange={(e) => {
									setReturnDate(e.target.value);
									if (errors.returnDate) setErrors({ ...errors, returnDate: null });
								}}
								min={departDate || new Date().toISOString().split('T')[0]}
								className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
									errors.returnDate ? 'border-red-500 error-field' : 'border-gray-300'
								}`}
							/>
						</div>
						{errors.returnDate && (
							<p className="mt-1 text-sm text-red-600 flex items-center gap-1">
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
								</svg>
								{errors.returnDate}
							</p>
						)}
					</div>
				)}
			</div>

			{/* Passengers and Class */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Passengers */}
				<div>
					<label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-2">
						{t.search.passengers}
					</label>
					<select
						id="passengers"
						value={passengers}
						onChange={(e) => setPassengers(parseInt(e.target.value))}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
							<option key={num} value={num}>
								{num} {num === 1 ? t.search.passenger : t.search.passengers}
							</option>
						))}
					</select>
				</div>

				{/* Travel Class */}
				<div>
					<label htmlFor="travelClass" className="block text-sm font-medium text-gray-700 mb-2">
						{t.search.class}
					</label>
					<select
						id="travelClass"
						value={travelClass}
						onChange={(e) => setTravelClass(e.target.value)}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
						<option value="economy">{t.search.economy}</option>
						<option value="business">{t.search.business}</option>
						<option value="first">{t.search.first}</option>
					</select>
				</div>

				{/* Submit Button */}
				<div className="flex items-end">
					<button
						type="submit"
						className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
					>
						<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						{t.search.searchFlights}
					</button>
				</div>
			</div>
		</form>
	);
}
