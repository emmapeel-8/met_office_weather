export type EnrichedWeather = {
    time: string;
    temperature: number;
    probOfPrecipitation: number;
    significantWeatherCode: number;
    description: string;
    umbrella: string | null;
};

export type WeatherReport = {
    location: string;
    forecast: EnrichedWeather[];
};

const BASE_URL = "http://localhost:3001";

export const getWeatherReport = async (postcode: string): Promise<WeatherReport> => {
    const response = await fetch(`${BASE_URL}/weather?postcode=${encodeURIComponent(postcode)}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch weather report");
    }

    return data;
}
