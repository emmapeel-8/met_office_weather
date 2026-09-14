import type { WeatherResponse } from "../types/weather_types.ts";

export const fetchWeatherThreeHours = async (latitude: number, longitude: number): Promise<WeatherResponse[]> => {
    try {
        const response = await fetch(`https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/hourly?latitude=${latitude}&longitude=${longitude}`, {
            headers: {
                accept: "application/json",
                apikey: process.env.MET_OFFICE_API_KEY ?? "",
            },
        });
        const data = await response.json();
        const timeSeries = data.features[0].properties.timeSeries;

        return timeSeries.map((entry: any) => ({
            time: entry.time,
            temperature: entry.screenTemperature,
            probOfPrecipitation: entry.probOfPrecipitation,
        }));
    } catch (error: any) {
        console.error(error)
        return error;
    } finally {
        console.log("Request complete")
    }
}
