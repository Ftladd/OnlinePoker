import './config';
import 'express-async-errors';
import express, { Express } from 'express';
import session from 'express-session';
import ip from 'ip';
import dotenv from 'dotenv';
import connectSqlite3 from 'connect-sqlite3';
// import { playMatch } from './controllers/game'; // for testing
import { connectRandomRoom, startGame } from './controllers/GameController';
import { registerUser, logIn, getAllUsers, friendRequest } from './controllers/UserController';

dotenv.config();
const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

// playMatch(); // for testing game

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.sqlite' }),
    secret: COOKIE_SECRET,
    cookie: { maxAge: 8 * 60 * 60 * 1000 },
    name: 'session',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(express.json());

app.post('/api/users', registerUser);
app.post('/api/logIn', logIn);
app.get('api/users', getAllUsers);

app.post('api/game/:userId', connectRandomRoom);
app.get('api/game', startGame);

app.post('/api/friend-request', friendRequest);

app.listen(PORT, () => {
  console.log(`App is listening on port http://${ip.address()}:${PORT}`);
});
