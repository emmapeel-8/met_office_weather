import React, { useEffect } from "react";
import "./Banner.css";

type Cloud = {
    top: string;
    width: number;
    duration: number;
    delay: number;
    opacity: number;
};

type SkyCondition = "clear" | "cloudy" | "rainy" | "snowy" | "stormy";
type CloudDensity = "none" | "light" | "normal" | "heavy";
type RainIntensity = "none" | "light" | "heavy";

type WeatherVisual = {
    sky: SkyCondition;
    clouds: CloudDensity;
    rain: RainIntensity;
};

const LIGHT_CLOUDS: Cloud[] = [
    { top: "55%", width: 100, duration: 22, delay: -8, opacity: 0.85 },
    { top: "10%", width: 80, duration: 34, delay: -20, opacity: 0.7 },
];

const CLOUDS: Cloud[] = [
    { top: "20%", width: 140, duration: 28, delay: 0, opacity: 1 },
    { top: "55%", width: 100, duration: 22, delay: -8, opacity: 0.85 },
    { top: "10%", width: 80, duration: 34, delay: -20, opacity: 0.7 },
];

const STORMY_CLOUDS: Cloud[] = [
    { top: "30%", width: 140, duration: 28, delay: 0, opacity: 1 },
    { top: "55%", width: 100, duration: 22, delay: -8, opacity: 0.85 },
    { top: "10%", width: 100, duration: 34, delay: -20, opacity: 0.7 },
    { top: "10%", width: 100, duration: 34, delay: -20, opacity: 0.6 },
    { top: "85%", width: 100, duration: 34, delay: -20, opacity: 0.9 },
]

const RAINDROPS = Array.from({ length: 16 }, (_, i) => ({
    left: (i * 6.25) % 100,
    duration: 1.2 + (i % 5) * 0.2,
    delay: (i * 0.27) % 3,
}));

const STORMY_RAINDROPS = Array.from({ length: 40 }, (_, i) => ({
    left: (i * 2.5) % 100,
    duration: 0.5 + (i % 5) * 0.1,
    delay: (i * 0.13) % 2,
}));

// Keyed by Met Office significantWeatherCode.
const WEATHER_VISUALS: Record<number, WeatherVisual> = {
    [-1]: { sky: "rainy", clouds: "normal", rain: "light" },  // Trace rain
    0: { sky: "clear", clouds: "none", rain: "none" },        // Clear night
    1: { sky: "clear", clouds: "none", rain: "none" },        // Sunny day
    2: { sky: "clear", clouds: "light", rain: "none" },       // Partly cloudy (night)
    3: { sky: "clear", clouds: "light", rain: "none" },       // Partly cloudy (day)
    4: { sky: "clear", clouds: "none", rain: "none" },        // Not used
    5: { sky: "cloudy", clouds: "light", rain: "none" },      // Mist
    6: { sky: "cloudy", clouds: "light", rain: "none" },      // Fog
    7: { sky: "cloudy", clouds: "normal", rain: "none" },     // Cloudy
    8: { sky: "cloudy", clouds: "normal", rain: "none" },     // Overcast
    9: { sky: "rainy", clouds: "normal", rain: "light" },     // Light rain shower (night)
    10: { sky: "rainy", clouds: "normal", rain: "light" },    // Light rain shower (day)
    11: { sky: "rainy", clouds: "normal", rain: "light" },    // Drizzle
    12: { sky: "rainy", clouds: "normal", rain: "light" },    // Light rain
    13: { sky: "rainy", clouds: "heavy", rain: "heavy" },     // Heavy rain shower (night)
    14: { sky: "rainy", clouds: "heavy", rain: "heavy" },     // Heavy rain shower (day)
    15: { sky: "rainy", clouds: "heavy", rain: "heavy" },     // Heavy rain
    16: { sky: "snowy", clouds: "normal", rain: "light" },    // Sleet shower (night)
    17: { sky: "snowy", clouds: "normal", rain: "light" },    // Sleet shower (day)
    18: { sky: "snowy", clouds: "normal", rain: "light" },    // Sleet
    19: { sky: "stormy", clouds: "heavy", rain: "heavy" },    // Hail shower (night)
    20: { sky: "stormy", clouds: "heavy", rain: "heavy" },    // Hail shower (day)
    21: { sky: "stormy", clouds: "heavy", rain: "heavy" },    // Hail
    22: { sky: "snowy", clouds: "light", rain: "none" },      // Light snow shower (night)
    23: { sky: "snowy", clouds: "light", rain: "none" },      // Light snow shower (day)
    24: { sky: "snowy", clouds: "light", rain: "none" },      // Light snow
    25: { sky: "snowy", clouds: "heavy", rain: "none" },      // Heavy snow shower (night)
    26: { sky: "snowy", clouds: "heavy", rain: "none" },      // Heavy snow shower (day)
    27: { sky: "snowy", clouds: "heavy", rain: "none" },      // Heavy snow
    28: { sky: "stormy", clouds: "heavy", rain: "heavy" },    // Thunder shower (night)
    29: { sky: "stormy", clouds: "heavy", rain: "heavy" },    // Thunder shower (day)
    30: { sky: "stormy", clouds: "heavy", rain: "heavy" },    // Thunder
};

const DEFAULT_VISUAL: WeatherVisual = { sky: "clear", clouds: "none", rain: "none" };

const getWeatherVisual = (significantWeatherCode: number): WeatherVisual =>
    WEATHER_VISUALS[significantWeatherCode] ?? DEFAULT_VISUAL;

const CLOUDS_BY_DENSITY: Record<CloudDensity, Cloud[]> = {
    none: [],
    light: LIGHT_CLOUDS,
    normal: CLOUDS,
    heavy: STORMY_CLOUDS,
};

const RAINDROPS_BY_INTENSITY: Record<RainIntensity, typeof RAINDROPS> = {
    none: [],
    light: RAINDROPS,
    heavy: STORMY_RAINDROPS,
};

// #cloudy_sky / #rainy_sky / #snowy_sky / #stormy_sky are defined in Banner.css and
// override the --sky-top/--sky-bottom variables the `body` background reads, so the
// id has to live on `body` itself for it to take effect.
const SKY_BODY_ID: Record<SkyCondition, string> = {
    clear: "",
    cloudy: "cloudy_sky",
    rainy: "rainy_sky",
    snowy: "snowy_sky",
    stormy: "stormy_sky",
};

const Cloud = ({ width }: { width: number }): React.ReactElement => (
    <svg width={width} height={width * 0.55} viewBox="0 0 64 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16 26C10.5 26 6 21.7 6 16.5C6 11.3 10.5 7 16 7C17.6 7 19.1 7.4 20.4 8C22.6 3.3 27.4 0 33 0C40.5 0 46.7 5.9 47.5 13.4C53.6 14.2 58 19.1 58 25C58 30 54 34 49 34H16C10.5 34 6 29.6 6 26Z"
            fill="var(--cloud)"
        />
    </svg>
);

export const Banner = ({ significantWeatherCode }: { significantWeatherCode: number }): React.ReactElement => {
    const visual = getWeatherVisual(significantWeatherCode);
    const clouds = CLOUDS_BY_DENSITY[visual.clouds];
    const raindrops = RAINDROPS_BY_INTENSITY[visual.rain];
    const heavyRain = visual.rain === "heavy";

    useEffect(() => {
        document.body.id = SKY_BODY_ID[visual.sky];
        return () => {
            document.body.id = "";
        };
    }, [visual.sky]);

    return (
        <div className="banner">
            <div className="banner-sun" />

            {clouds.map((cloud: Cloud, i: number)=> (
                <div
                    key={i}
                    className="banner-cloud"
                    style={{
                        top: cloud.top,
                        opacity: cloud.opacity,
                        animationDuration: `${cloud.duration}s`,
                        animationDelay: `${cloud.delay}s`,
                    }}
                >
                    <Cloud width={cloud.width} />
                </div>
            ))}

            {raindrops.map((drop, i) => (
                <div
                    key={i}
                    className={heavyRain ? "banner-raindrop banner-raindrop--heavy" : "banner-raindrop"}
                    style={{
                        left: `${drop.left}%`,
                        animationDuration: `${drop.duration}s`,
                        animationDelay: `${drop.delay}s`,
                    }}
                />
            ))}

        </div>
    )
}
