import type { PostcodeInfo } from "../types/postcode_types.ts";

export const fetchPostcode = async (postcode: string): Promise<PostcodeInfo> => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`, {
        headers: {
            accept: "application/json",
        },
    });
    const data = await response.json();

    if (!data.result) {
        throw new Error(data.error ?? "Postcode not found");
    }

    return {
        postcode: data.result.postcode,
        parliamentary_constituency: data.result.parliamentary_constituency,
        latitude: data.result.latitude,
        longitude: data.result.longitude,
    };
}

export const fetchRandomPostcode = async (): Promise<PostcodeInfo> => {
    const response = await fetch(`https://api.postcodes.io/random/postcodes`, {
        headers: {
            accept: "application/json",
        },
    });
    const data = await response.json();

    if (!data.result) {
        throw new Error(data.error ?? "Something went wrong");
    }

    return {
        postcode: data.result.postcode,
        parliamentary_constituency: data.result.parliamentary_constituency,
        latitude: data.result.latitude,
        longitude: data.result.longitude,
    };
}