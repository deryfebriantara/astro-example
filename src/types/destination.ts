export interface Destination {
  slug: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  image: string;
  hero_image: string;
  starting_price: number;
  popular: boolean;
  featured: boolean;
  airports: string[];
  highlights: string[];
  best_time_to_visit: string;
  flight_time: string;
  weekly_flights: number;
}

export type Continent = 'Europe' | 'Asia' | 'North America' | 'South America' | 'Africa' | 'Oceania' | 'Middle East';

export interface DestinationFilters {
  continent?: Continent;
  search?: string;
  priceRange?: [number, number];
  popular?: boolean;
}
