import {Hono} from 'hono'
import sessions from "./routes/session"
import chat from "./routes/chat"
import {HTTPException} from "hono/http-exception"
const app=new Hono()



app.onError((error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ 
      error: error.message || "Request failed",
    }, error.status);
  };

  console.error("Unhandled server error", error);
  return c.json({ error: "Internal server error" }, 500);
});

const routes=app.route("/sessions",sessions).route("/chat",chat);

export type AppType=typeof routes;

export default {port:3000,fetch:app.fetch,idleTimeout:255}

//idleTimeout must be high,otherwise LLM toool calls might not complete