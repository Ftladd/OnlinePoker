import './config';
import express, { Express } from 'express';
import ip from 'ip';
import { playMatch } from './controllers/game';
import { registerUser, logIn, getAllUsers } from './controllers/UserController';

const app: Express = express();
const { PORT } = process.env;

playMatch();

app.use(express.json());

app.post('/api/users', registerUser);
app.post('/api/logIn', logIn);
app.get('api/users', getAllUsers);
/* app.get('/api/gameStart/:userId', playMatch);
app.post('/api/bet/:userId', placeBet);
app.post('/api/playGame', playMatch); */

app.listen(PORT, () => {
  console.log(`App is listening on port http://${ip.address()}:${PORT}`);
});
