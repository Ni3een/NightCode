import {Hono} from 'hono'
import sessions from "./routes/session"
import chat from "./routes/chat"
import { requireAuth } from "./middleware/require-auth";
import auth from "./routes/auth"
import billing from "./routes/billing"
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

app.use("/sessions/*", requireAuth);
app.use("/chat/*", requireAuth);
app.use("/billing/checkout",requireAuth);
app.use("/billing/portal",requireAuth);

const routes=app
.route("/auth",auth)
.route("/sessions",sessions)
.route("/chat",chat)
.route("/billing",billing);

export type AppType=typeof routes;

export default {port: Number(process.env.PORT) || 3000, fetch:app.fetch, idleTimeout:255}

//idleTimeout must be high,otherwise LLM toool calls might not complete