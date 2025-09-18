import { app } from "@azure/functions";
import "./functions/items";
import "./functions/auth";
import "./functions/send-to-queue";
import "./functions/send-to-topic";
import "./functions/signalr-negotiate";


app.setup({
  enableHttpStream: true,
});
