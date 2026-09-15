import { test } from "node:test";
import assert from "node:assert/strict";
import { fetchPostcode } from "../api/postcodes.ts";

function mockFetchJson(body: unknown): typeof fetch {
    return (async () => ({ json: async () => body })) as unknown as typeof fetch;
}

test("fetchPostcode returns location info for a valid postcode", async (t) => {
    t.mock.method(globalThis, "fetch", mockFetchJson({
        status: 200,
        result: {
            postcode: "SW1A 1AA",
            parliamentary_constituency: "Cities of London and Westminster",
            latitude: 51.50101,
            longitude: -0.141563,
        },
    }));

    const result = await fetchPostcode("SW1A1AA");

    assert.deepEqual(result, {
        postcode: "SW1A 1AA",
        parliamentary_constituency: "Cities of London and Westminster",
        latitude: 51.50101,
        longitude: -0.141563,
    });
});

test("fetchPostcode rejects with a clear error for an invalid postcode", async (t) => {
    // Real API response shape for an unrecognised postcode - no `result` key.
    t.mock.method(globalThis, "fetch", mockFetchJson({ status: 404, error: "Postcode not found" }));

    await assert.rejects(
        () => fetchPostcode("ZZ999ZZ"),
        { message: "Postcode not found" },
    );
});

test("fetchPostcode handles a postcode with spaces", async (t) => {
    const fetchMock = t.mock.method(globalThis, "fetch", mockFetchJson({
        status: 200,
        result: {
            postcode: "SW1A 1AA",
            parliamentary_constituency: "Cities of London and Westminster",
            latitude: 51.50101,
            longitude: -0.141563,
        },
    }));

    const result = await fetchPostcode("SW1A 1AA");

    assert.equal(
        fetchMock.mock.calls[0].arguments[0],
        "https://api.postcodes.io/postcodes/SW1A 1AA",
    );
    assert.deepEqual(result, {
        postcode: "SW1A 1AA",
        parliamentary_constituency: "Cities of London and Westminster",
        latitude: 51.50101,
        longitude: -0.141563,
    });
});
