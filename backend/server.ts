import "dotenv/config";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { getWeatherReport } from "./weatherReport.ts";

const PORT = process.env.PORT ?? 3001;

type Route = (req: IncomingMessage, res: ServerResponse, url: URL) => Promise<void> | void;

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
}

const getWeather: Route = async (_req, res, url) => {
    const postcode = url.searchParams.get("postcode");

    if (!postcode) {
        sendJson(res, 400, { error: "postcode query parameter is required" });
        return;
    }

    try {
        const report = await getWeatherReport(postcode);
        sendJson(res, 200, report);
    } catch (error: any) {
        sendJson(res, 400, { error: error.message });
    }
}

const routes: Record<string, Record<string, Route>> = {
    GET: {
        "/weather": getWeather,
    },
    POST: {},
    DELETE: {},
};

const server = createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", Object.keys(routes).join(", "));

    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const route = routes[req.method ?? "GET"]?.[url.pathname];

    if (!route) {
        sendJson(res, 404, { error: "Not found" });
        return;
    }

    await route(req, res, url);
});

server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
