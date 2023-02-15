import './config';
import express, { Express } from 'express';
import ip from 'ip';

const app: Express = express();
const { PORT } = process.env;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`App is listening on port http://${ip.address()}:${PORT}`);
});
