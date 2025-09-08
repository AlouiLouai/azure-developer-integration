import { app } from '@azure/functions';
import './functions/items';
import './functions/users';

app.setup({
    enableHttpStream: true,
});
