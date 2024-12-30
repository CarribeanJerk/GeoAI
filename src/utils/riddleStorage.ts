import fs from 'fs';
import path from 'path';
import cities from '~/cities.json';

interface City {
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  riddle: string | null;
}

export const saveRiddle = async (cityName: string, riddle: string) => {
  const citiesPath = path.join(process.cwd(), 'src', 'cities.json');
  const updatedCities = cities.map((city: City) => {
    if (city.city === cityName) {
      return { ...city, riddle };
    }
    return city;
  });
  
  await fs.promises.writeFile(citiesPath, JSON.stringify(updatedCities, null, 2));
};

export const getRiddle = (cityName: string): string | null => {
  const city = cities.find((c: City) => c.city === cityName);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return city?.riddle ?? null;
}; 