import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchWeatherThreeHours } from "../api/metOffice.ts";

function mockFetchJson(body: unknown): typeof fetch {
    return (async () => ({ json: async () => body })) as unknown as typeof fetch;
}

test("fetchWeatherThreeHours returns weather data for a valid latitude and longitude", async (t) => {
    t.mock.method(globalThis, "fetch", mockFetchJson({
        features: [
            {
                properties: {
                    timeSeries: [
                        { time: "2026-09-14T11:00Z", screenTemperature: 20.5, probOfPrecipitation: 5, significantWeatherCode: 1 },
                        { time: "2026-09-14T12:00Z", screenTemperature: 21.2, probOfPrecipitation: 10, significantWeatherCode: 7 },
                    ],
                },
            },
        ],
    }));

    const result = await fetchWeatherThreeHours(51.5, -0.1);

    assert.deepEqual(result, [
        { time: "2026-09-14T11:00Z", temperature: 20.5, probOfPrecipitation: 5, significantWeatherCode: 1 },
        { time: "2026-09-14T12:00Z", temperature: 21.2, probOfPrecipitation: 10, significantWeatherCode: 7 },
    ]);
});

test("fetchWeatherThreeHours rejects with a clear error for an invalid latitude and longitude", async (t) => {
    // Real API response shape when latitude/longitude are out of range - no `features` key.
    t.mock.method(globalThis, "fetch", mockFetchJson({
        total: 2,
        _embedded: {
            errors: [
                { message: "An invalid latitude value was provided - it must be in the range from -85 to 85" },
                { message: "An invalid longitude value was provided - it must be in the range from -180 to 180" },
            ],
        },
    }));

    await assert.rejects(
        () => fetchWeatherThreeHours(999, 999),
        { message: "Invalid latitude or longitude" },
    );
});
