import { useState, useMemo } from 'react';
import FlightCard from './FlightCard.jsx';

export default function FlightResults({ flights, searchParams }) {
	const [sortBy, setSortBy] = useState('price');
	const [filterStops, setFilterStops] = useState('all');
	const [selectedClass, setSelectedClass] = useState(searchParams?.class || 'economy');

	// Filter and sort flights
	const filteredAndSortedFlights = useMemo(() => {
		let result = [...flights];

		// Filter by stops
		if (filterStops !== 'all') {
			const stops = parseInt(filterStops);
			result = result.filter((flight) => flight.stops === stops);
		}

		// Sort flights
		result.sort((a, b) => {
			switch (sortBy) {
				case 'price':
					return (a.classes[selectedClass]?.price || 0) - (b.classes[selectedClass]?.price || 0);
				case 'duration':
					// Simple duration comparison (assumes format like "7h 0m")
					const getDurationMinutes = (dur) => {
						const [hours, minutes] = dur.split('h').map((s) => parseInt(s) || 0);
						return hours * 60 + minutes;
					};
					return getDurationMinutes(a.duration) - getDurationMinutes(b.duration);
				case 'departure':
					return new Date(a.departure) - new Date(b.departure);
				case 'arrival':
					return new Date(a.arrival) - new Date(b.arrival);
				default:
					return 0;
			}
		});

		return result;
	}, [flights, sortBy, filterStops, selectedClass]);

	return (
		<div className="max-w-screen-xl mx-auto px-4 py-8">
			{/* Search Summary */}
			{searchParams && (
				<div className="bg-white rounded-lg shadow-md p-6 mb-6">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">Flight Results</h2>
					<div className="flex flex-wrap gap-4 text-sm text-gray-600">
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
							</svg>
							<span>
								<strong>{searchParams.origin}</strong> → <strong>{searchParams.destination}</strong>
							</span>
						</div>
						{searchParams.departDate && (
							<div className="flex items-center gap-2">
								<svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								<span>{new Date(searchParams.departDate).toLocaleDateString()}</span>
							</div>
						)}
						<div className="flex items-center gap-2">
							<svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
							</svg>
							<span>{searchParams.passengers} Passenger(s)</span>
						</div>
						<div className="flex items-center gap-2 capitalize">
							<svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
							</svg>
							<span>{searchParams.class} Class</span>
						</div>
					</div>
				</div>
			)}

			{/* Filters and Sorting */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				{/* Sort By */}
				<div className="flex-1">
					<label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
						Sort by
					</label>
					<select
						id="sortBy"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
						<option value="price">Price (Low to High)</option>
						<option value="duration">Duration (Shortest)</option>
						<option value="departure">Departure Time</option>
						<option value="arrival">Arrival Time</option>
					</select>
				</div>

				{/* Filter by Stops */}
				<div className="flex-1">
					<label htmlFor="filterStops" className="block text-sm font-medium text-gray-700 mb-2">
						Stops
					</label>
					<select
						id="filterStops"
						value={filterStops}
						onChange={(e) => setFilterStops(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
						<option value="all">All Flights</option>
						<option value="0">Non-stop only</option>
						<option value="1">1 stop or less</option>
					</select>
				</div>

				{/* Class Selection */}
				<div className="flex-1">
					<label htmlFor="classFilter" className="block text-sm font-medium text-gray-700 mb-2">
						Class
					</label>
					<select
						id="classFilter"
						value={selectedClass}
						onChange={(e) => setSelectedClass(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
					>
						<option value="economy">Economy</option>
						<option value="business">Business</option>
						<option value="first">First Class</option>
					</select>
				</div>
			</div>

			{/* Results Count */}
			<div className="mb-6">
				<p className="text-gray-600">
					Showing <strong>{filteredAndSortedFlights.length}</strong> of{' '}
					<strong>{flights.length}</strong> flights
				</p>
			</div>

			{/* Flight Cards */}
			{filteredAndSortedFlights.length > 0 ? (
				<div>
					{filteredAndSortedFlights.map((flight) => (
						<FlightCard key={flight.id} flight={flight} selectedClass={selectedClass} />
					))}
				</div>
			) : (
				<div className="bg-white rounded-lg shadow-md p-12 text-center">
					<svg
						className="mx-auto h-12 w-12 text-gray-400 mb-4"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">No flights found</h3>
					<p className="text-gray-600 mb-6">
						Try adjusting your filters or search criteria
					</p>
					<a
						href="/book"
						className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						New Search
					</a>
				</div>
			)}
		</div>
	);
}
