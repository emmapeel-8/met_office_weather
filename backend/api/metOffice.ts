import type { WeatherResponse } from "../types/weather_types.ts";

export const fetchWeatherThreeHours = async (latitude: number, longitude: number): Promise<WeatherResponse[]> => {
    const response = await fetch(`https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/hourly?latitude=${latitude}&longitude=${longitude}`, {
        headers: {
            accept: "application/json",
            apikey: process.env.MET_OFFICE_API_KEY ?? "",
        },
    });
    const data = await response.json();

    if (!data.features) {
        throw new Error("Invalid latitude or longitude");
    }

    const timeSeries = data.features[0].properties.timeSeries;

    return timeSeries.map((entry: any) => ({
        time: entry.time,
        temperature: entry.screenTemperature,
        probOfPrecipitation: entry.probOfPrecipitation,
        significantWeatherCode: entry.significantWeatherCode,
    }));
}
