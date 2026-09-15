import "dotenv/config";
import { createServer } from "node:http";
import { getWeatherReport } from "./weatherReport.ts";

const PORT = process.env.PORT ?? 3001;

const server = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);

    if (url.pathname !== "/weather") {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Not found" }));
        return;
    }

    const postcode = url.searchParams.get("postcode");
    const hours = Number(url.searchParams.get("hours") ?? 3);

    if (!postcode) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "postcode query parameter is required" }));
        return;
    }

    try {
        const report = await getWeatherReport(postcode, hours);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(report));
    } catch (error: any) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
