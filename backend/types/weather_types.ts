export type WeatherResponse = {
    time: string;
    temperature: number;
    probOfPrecipitation: number;
    significantWeatherCode: number;
}

export type EnrichedWeather = WeatherResponse & {
    description: string;
    umbrella: string | null;
};

export type WeatherReport = {
    location: string;
    forecast: EnrichedWeather[];
};