import { app } from '@azure/functions';
import './functions/items';

app.setup({
    enableHttpStream: true,
});
