import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { fetchData } from "./api/metOffice.ts";

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

async function main() {
    const rl = createInterface({ input: process.stdin, output: process.stdout });

    try {
        const latitude = await promptNumber(rl, "Latitude: ");
        const longitude = await promptNumber(rl, "Longitude: ");

        const data = await fetchData(latitude, longitude);
        console.log(JSON.stringify(data, null, 2));
    } finally {
        rl.close();
    }
}

main();
