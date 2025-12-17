export interface Airport {
  code: string;
  city: string;
  airport: string;
}

export interface FlightClass {
  available: number;
  price: number;
  amenities: string[];
}

export interface FlightClasses {
  economy: FlightClass;
  business: FlightClass;
  first?: FlightClass;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  origin: Airport;
  destination: Airport;
  departure: string; // ISO date string
  arrival: string; // ISO date string
  duration: string;
  stops: number;
  aircraft: string;
  classes: FlightClasses;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date | null;
  returnDate?: Date | null;
  passengers: number;
  travelClass: 'economy' | 'business' | 'first';
  tripType: 'one-way' | 'round-trip' | 'multi-city';
}

export interface FlightFilters {
  maxPrice?: number;
  stops?: number[];
  departureTimeRange?: [number, number]; // hours in 24h format
  airlines?: string[];
}

export type SortOption = 'price' | 'duration' | 'departure' | 'arrival';
