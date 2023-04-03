import './config';
import 'express-async-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
// import * as http from 'http';
import session from 'express-session';
import ip from 'ip';
import dotenv from 'dotenv';
import connectSqlite3 from 'connect-sqlite3';
import { Server } from 'socket.io';
// import { playMatch } from './controllers/game'; // for testing
import { connectRandomRoom, startGame } from './controllers/GameController';
import { registerUser, logIn, getAllUsers, friendRequest } from './controllers/UserController';

dotenv.config();
const app: Express = express();
const { PORT, COOKIE_SECRET } = process.env;

const SQLiteStore = connectSqlite3(session);

// playMatch(); // for testing game

const sessionMiddleware = session({
  store: new SQLiteStore({ db: 'sessions.sqlite' }),
  secret: COOKIE_SECRET,
  cookie: { maxAge: 8 * 60 * 60 * 1000 },
  name: 'session',
  resave: false,
  saveUninitialized: false,
});

app.use(sessionMiddleware);
app.use(express.static('public', { extensions: ['html'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/users', registerUser);
app.post('/api/logIn', logIn);
app.get('api/users', getAllUsers);

app.post('api/game/:userId', connectRandomRoom);
app.get('api/game', startGame);

app.post('/api/friend-request', friendRequest);

const server = app.listen(PORT, () => {
  console.log(`App is listening on port http://${ip.address()}:${PORT}`);
});

const connectedClients: Record<string, CustomWebSocket> = {};

const socketServer = new Server<ClientToServerEvents, ServerToClientEvents, null, null>(server);

socketServer.use((socket, next) =>
  sessionMiddleware(socket.request as Request, {} as Response, next as NextFunction)
);

socketServer.on('connection', (socket) => {
  const req = socket.request;

  // We need this chunk of code so that socket.io
  // will automatically reload the session data
  // don't change this code
  socket.use((__, next) => {
    req.session.reload((err) => {
      if (err) {
        socket.disconnect();
      } else {
        next();
      }
    });
  });

  // This is just to make sure only logged in users
  // are able to connect to a game
  if (!req.session.isLoggedIn) {
    console.log('An unauthenticated user attempted to connect.');
    socket.disconnect();
    return;
  }

  const { authenticatedUser } = req.session;
  const { username } = authenticatedUser;

  console.log(`${username} has connected`);
  connectedClients[username] = socket;

  socket.on('disconnect', () => {
    delete connectedClients[username];
    console.log(`${username} has disconnected`);
    socketServer.emit('exitedChat', `${username} has left the chat.`);
  });

  socketServer.emit('enteredChat', `${username} has entered the chat`);
});
