import { Country } from './country';
import { Region } from './region.type';


export interface CacheStore {
  byCapital:   TermCountries;
  byCountries: TermCountries;
  byRegion:    RegionCountries;
}

export interface TermCountries {
  term: string;
  countries: Country[];
  starred?: boolean;
}

export interface RegionCountries {
  region:    Region;
  countries: Country[];
  starred?: boolean;
}

