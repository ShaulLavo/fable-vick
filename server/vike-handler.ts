/// <reference lib="webworker" />

import type { Context } from "hono";
import { renderPage } from "vike/server";

export const vikeHandler = async (c: Context) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
    headersOriginal: c.req.raw.headers,
  } as const;
  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  const { readable, writable } = new TransformStream();
  response.pipe(writable);

  return new Response(readable, {
    status: response.statusCode,
    headers: response.headers,
  });
};
