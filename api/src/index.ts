import { app } from '@azure/functions';
import './functions/items';
import './functions/auth';

app.setup({
    enableHttpStream: true,
});