import React from "react";
import "./Banner.css";

type Cloud = {
    top: string;
    width: number;
    duration: number;
    delay: number;
    opacity: number;
};

const CLOUDS: Cloud[] = [
    { top: "20%", width: 140, duration: 28, delay: 0, opacity: 1 },
    { top: "55%", width: 100, duration: 22, delay: -8, opacity: 0.85 },
    { top: "10%", width: 80, duration: 34, delay: -20, opacity: 0.7 },
];

const RAINDROPS = Array.from({ length: 16 }, (_, i) => ({
    left: (i * 6.25) % 100,
    duration: 1.2 + (i % 5) * 0.2,
    delay: (i * 0.27) % 3,
}));

const Cloud = ({ width }: { width: number }): React.ReactElement => (
    <svg width={width} height={width * 0.55} viewBox="0 0 64 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M16 26C10.5 26 6 21.7 6 16.5C6 11.3 10.5 7 16 7C17.6 7 19.1 7.4 20.4 8C22.6 3.3 27.4 0 33 0C40.5 0 46.7 5.9 47.5 13.4C53.6 14.2 58 19.1 58 25C58 30 54 34 49 34H16C10.5 34 6 29.6 6 26Z"
            fill="var(--cloud)"
        />
    </svg>
);

export const Banner = (): React.ReactElement => {
    return (
        <div className="banner">
            <div className="banner-sun" />

            {CLOUDS.map((cloud, i) => (
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

            {RAINDROPS.map((drop, i) => (
                <div
                    key={i}
                    className="banner-raindrop"
                    style={{
                        left: `${drop.left}%`,
                        animationDuration: `${drop.duration}s`,
                        animationDelay: `${drop.delay}s`,
                    }}
                />
            ))}

            <div className="banner-content">
                <h1>Met Office Weather</h1>
                <p>Live local forecasts, wherever you are</p>
            </div>
        </div>
    )
}
