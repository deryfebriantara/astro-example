import { useState } from 'react';

export default function FlightCard({ flight, selectedClass = 'economy' }) {
	const [expanded, setExpanded] = useState(false);

	const formatTime = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		});
	};

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
		});
	};

	const classInfo = flight.classes[selectedClass];

	if (!classInfo) {
		return null;
	}

	return (
		<div className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 mb-4">
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
				{/* Flight Info */}
				<div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Departure */}
					<div>
						<p className="text-3xl font-bold text-gray-900">
							{formatTime(flight.departure)}
						</p>
						<p className="text-sm text-gray-600">{flight.origin.code}</p>
						<p className="text-xs text-gray-500">{formatDate(flight.departure)}</p>
					</div>

					{/* Duration & Stops */}
					<div className="flex flex-col items-center justify-center">
						<p className="text-sm text-gray-600 mb-2">{flight.duration}</p>
						<div className="w-full relative">
							<div className="border-t-2 border-gray-300 relative">
								{flight.stops === 0 ? (
									<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
										<svg
											className="w-6 h-6 text-primary-600"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
										</svg>
									</div>
								) : (
									<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
										<span className="text-xs text-gray-600">{flight.stops} stop</span>
									</div>
								)}
							</div>
						</div>
						<p className="text-xs text-gray-500 mt-2">
							{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
						</p>
					</div>

					{/* Arrival */}
					<div className="text-right md:text-left lg:text-right">
						<p className="text-3xl font-bold text-gray-900">
							{formatTime(flight.arrival)}
						</p>
						<p className="text-sm text-gray-600">{flight.destination.code}</p>
						<p className="text-xs text-gray-500">{formatDate(flight.arrival)}</p>
					</div>
				</div>

				{/* Price & Select */}
				<div className="flex flex-col items-center lg:items-end gap-4 min-w-[200px]">
					<div className="text-center lg:text-right">
						<p className="text-sm text-gray-600">From</p>
						<p className="text-3xl font-bold text-primary-600">
							${classInfo.price}
						</p>
						<p className="text-xs text-gray-500 capitalize">{selectedClass} class</p>
						<p className="text-xs text-green-600 mt-1">
							{classInfo.available} seats available
						</p>
					</div>

					<button
						onClick={() => alert(`Booking flight ${flight.flightNumber} - $${classInfo.price}`)}
						className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
					>
						Select Flight
					</button>

					<button
						onClick={() => setExpanded(!expanded)}
						className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
					>
						{expanded ? 'Less' : 'More'} details
						<svg
							className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
				</div>
			</div>

			{/* Expanded Details */}
			{expanded && (
				<div className="mt-6 pt-6 border-t border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{/* Flight Details */}
						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Flight Details</h4>
							<div className="space-y-2 text-sm">
								<div className="flex justify-between">
									<span className="text-gray-600">Flight Number:</span>
									<span className="font-medium">{flight.flightNumber}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Aircraft:</span>
									<span className="font-medium">{flight.aircraft}</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Airline:</span>
									<span className="font-medium">{flight.airline}</span>
								</div>
							</div>
						</div>

						{/* Amenities */}
						<div>
							<h4 className="font-semibold text-gray-900 mb-3">Amenities Included</h4>
							<ul className="space-y-2">
								{classInfo.amenities.map((amenity, index) => (
									<li key={index} className="flex items-center gap-2 text-sm text-gray-600">
										<svg
											className="w-4 h-4 text-green-600"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										{amenity}
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Other Classes Available */}
					<div className="mt-6 pt-6 border-t border-gray-200">
						<h4 className="font-semibold text-gray-900 mb-3">Other Classes Available</h4>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{Object.entries(flight.classes).map(([className, classData]) => (
								<div
									key={className}
									className={`border rounded-lg p-4 ${
										className === selectedClass
											? 'border-primary-600 bg-primary-50'
											: 'border-gray-200'
									}`}
								>
									<p className="font-semibold text-gray-900 capitalize mb-1">
										{className}
									</p>
									<p className="text-2xl font-bold text-primary-600 mb-2">
										${classData.price}
									</p>
									<p className="text-xs text-gray-600">
										{classData.available} seats available
									</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
