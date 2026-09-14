import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { fetchWeatherThreeHours} from "./api/metOffice.ts";
import { fetchPostcode} from "./api/postcodes.ts";
import type { WeatherResponse } from "./types/weather_types.ts";
import type { PostcodeInfo } from "./types/postcode_types.ts";

function getNextThreeHours(data: WeatherResponse[]): WeatherResponse[] {
    const now = new Date();
    return data.filter((entry) => new Date(entry.time) >= now).slice(0, 3);
}

function formatWeather(entry: WeatherResponse): string {
    const time = new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const umbrella = needUmbrella(entry.probOfPrecipitation);
    return `${time}: ${entry.temperature}°C, ${entry.probOfPrecipitation}% chance of rain. ${umbrella ?? "No umbrella needed"}`;
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
