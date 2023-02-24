import './config';
import express, { Express } from 'express';
import ip from 'ip';
import { playMatch } from './controllers/game';

const app: Express = express();
const { PORT } = process.env;

playMatch();

app.use(express.json());

app.post('/api/playGame', playMatch);

app.listen(PORT, () => {
  console.log(`App is listening on port http://${ip.address()}:${PORT}`);
});
