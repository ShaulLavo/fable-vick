import type { Context } from "hono";

export const createTodoHandler = async (c: Context) => {
  // In a real case, user-provided data should ALWAYS be validated with tools like zod
  const newTodo = (await c.req.json()) as { text: string };

  console.log("Received new todo", newTodo);

  return new Response(JSON.stringify({ status: "OK" }), {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
};
