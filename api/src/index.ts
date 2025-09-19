import { app } from "@azure/functions";
import "./functions/items";
import "./functions/auth";
import "./functions/messaging";
import "./functions/signalr";
import "./functions/messages";
import "./functions/users"; // New import


app.setup({
  enableHttpStream: true,
});
