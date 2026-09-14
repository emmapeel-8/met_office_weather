import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { fetchWeatherThreeHours} from "./api/metOffice.ts";
import { fetchPostcode} from "./api/postcodes.ts";
import type { WeatherResponse } from "./types/weather_types.ts";
import type { PostcodeInfo } from "./types/postcode_types.ts";

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

function describeWeatherCode(significantWeatherCode: number): string {
    return WEATHER_CODE_DESCRIPTIONS[significantWeatherCode] ?? "Not available";
}

function getNextThreeHours(data: WeatherResponse[]): WeatherResponse[] {
    const now = new Date();
    return data.filter((entry) => new Date(entry.time) >= now).slice(0, 3);
}

function formatWeather(entry: WeatherResponse): string {
    const time = new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const umbrella = needUmbrella(entry.probOfPrecipitation);
    const significantWeather = describeWeatherCode(entry.significantWeatherCode);
    return `${time}: ${significantWeather}, ${entry.temperature}°C, ${entry.probOfPrecipitation}% chance of rain. ${umbrella ?? "No umbrella needed"}`;
}

function needUmbrella(probOfPrecipitation: number): string | null {
    return probOfPrecipitation > 10 ? "Bring an umbrella!" : null;
}

async function main() {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    try {
        const postcode : string = await rl.question("Enter postcode: ");

        const postcode_data: PostcodeInfo = await fetchPostcode(postcode)
        const weather: WeatherResponse[] = await fetchWeatherThreeHours(postcode_data.latitude, postcode_data.longitude);
        const nextThreeHours: WeatherResponse[] = getNextThreeHours(weather);

        console.log(`Weather report for ${postcode_data.parliamentary_constituency}:`)
        for (const entry of nextThreeHours) {
            console.log(formatWeather(entry));
        }
    } catch (error: any) {
        console.log(error.message);
    } finally {
        rl.close();
    }
}

main();
