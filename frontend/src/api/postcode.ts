import type { PostcodeInfo } from "../../../backend/types/postcode_types.ts";

const BASE_URL = "http://localhost:3001";

export const getRandomPostcode = async (): Promise<PostcodeInfo> => {
    const response = await fetch(`${BASE_URL}/random-postcode`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error ?? "Failed to fetch random postcode");
    }

    return data;
}

