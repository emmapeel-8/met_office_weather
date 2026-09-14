import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { fetchWeatherThreeHours } from "./api/metOffice.ts";
import type { WeatherResponse } from "./types/weather_types.ts";

async function promptNumber(rl: ReturnType<typeof createInterface>, question: string): Promise<number> {
    while (true) {
        const answer = await rl.question(question);
        const value = Number(answer);
        if (!Number.isNaN(value)) {
            return value;
        }
        console.log("Please enter a valid number.");
    }
}

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
        const latitude = await promptNumber(rl, "Latitude: ");
        const longitude = await promptNumber(rl, "Longitude: ");

        const data: WeatherResponse[] = await fetchWeatherThreeHours(latitude, longitude);
        const nextThreeHours = getNextThreeHours(data);

        for (const entry of nextThreeHours) {
            console.log(formatWeather(entry));
        }
    } finally {
        rl.close();
    }
}

main();
