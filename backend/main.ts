import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { getWeatherReport, type EnrichedWeather } from "./weatherReport.ts";

const formatWeather = (entry: EnrichedWeather): string => {
    const time = new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return `${time}: ${entry.description}, ${entry.temperature}°C, ${entry.probOfPrecipitation}% chance of rain. ${entry.umbrella ?? "No umbrella needed"}`;
}

const main = async () => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    try {
        const postcode: string = await rl.question("Enter postcode: ");

        const report = await getWeatherReport(postcode);

        console.log(`Weather report for ${report.location}:`)
        for (const entry of report.forecast) {
            console.log(formatWeather(entry));
        }
    } catch (error: any) {
        console.log(error.message);
    } finally {
        rl.close();
    }
}

main();
