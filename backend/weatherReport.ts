import { fetchWeatherHours } from "./api/metOffice.ts";
import { fetchPostcode } from "./api/postcodes.ts";
import type { WeatherResponse, WeatherReport } from "./types/weather_types.ts";

const WEATHER_CODE_DESCRIPTIONS: Record<number, string> = {
    [-1]: "Trace rain",
    0: "Clear night",
    1: "Sunny day",
    2: "Partly cloudy (night)",
    3: "Partly cloudy (day)",
    4: "Not used",
    5: "Mist",
    6: "Fog",
    7: "Cloudy",
    8: "Overcast",
    9: "Light rain shower (night)",
    10: "Light rain shower (day)",
    11: "Drizzle",
    12: "Light rain",
    13: "Heavy rain shower (night)",
    14: "Heavy rain shower (day)",
    15: "Heavy rain",
    16: "Sleet shower (night)",
    17: "Sleet shower (day)",
    18: "Sleet",
    19: "Hail shower (night)",
    20: "Hail shower (day)",
    21: "Hail",
    22: "Light snow shower (night)",
    23: "Light snow shower (day)",
    24: "Light snow",
    25: "Heavy snow shower (night)",
    26: "Heavy snow shower (day)",
    27: "Heavy snow",
    28: "Thunder shower (night)",
    29: "Thunder shower (day)",
    30: "Thunder",
};

export const describeWeatherCode = (significantWeatherCode: number): string => {
    return WEATHER_CODE_DESCRIPTIONS[significantWeatherCode] ?? "Not available";
}

export const getNextThreeHours = (data: WeatherResponse[], hours: number): WeatherResponse[] => {
    const now = new Date();
    return data.filter((entry) => new Date(entry.time) >= now).slice(0, hours);
}

export const needUmbrella = (probOfPrecipitation: number): string | null => {
    return probOfPrecipitation > 10 ? "Bring an umbrella!" : null;
}

export const getWeatherReport = async (postcode: string, hours: number): Promise<WeatherReport> => {
    const postcodeData = await fetchPostcode(postcode);
    const weather = await fetchWeatherHours(postcodeData.latitude, postcodeData.longitude);
    const nextThreeHours = getNextThreeHours(weather, hours);

    return {
        location: postcodeData.parliamentary_constituency,
        forecast: nextThreeHours.map((entry) => ({
            ...entry,
            description: describeWeatherCode(entry.significantWeatherCode),
            umbrella: needUmbrella(entry.probOfPrecipitation),
        })),
    };
}