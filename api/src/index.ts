import { app } from "@azure/functions";
import "./functions/items";
import "./functions/auth";
import "./functions/messaging";
import "./functions/signalr";


app.setup({
  enableHttpStream: true,
});
