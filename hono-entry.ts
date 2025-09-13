import { Hono } from "hono";
import { handle } from "hono/vercel";
import { aiGenerateHandler, aiModelsHandler, aiStreamHandler } from "./server/ai-handler";
import { vikeHandler } from "./server/vike-handler";

const app = new Hono();

app.get("/api/ai/models", aiModelsHandler);
app.post("/api/ai/generate", aiGenerateHandler);
app.post("/api/ai/stream", aiStreamHandler);

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
app.all("*", vikeHandler);

export const GET = handle(app);

export const POST = handle(app);

export default process.env.NODE_ENV === "production" ? undefined : app;
