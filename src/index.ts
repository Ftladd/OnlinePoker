/* eslint-disable prefer-destructuring */
import './config';
import 'express-async-errors';
import express, { Express, Request, Response, NextFunction } from 'express';
// import * as http from 'http';
import session from 'express-session';
import ip from 'ip';
import dotenv from 'dotenv';
import connectSqlite3 from 'connect-sqlite3';
import { Server } from 'socket.io';
import { startGame } from './models/GameModel';
// import { playMatch } from './controllers/game'; // for testing
import { connectRandomRoom, renderGamePage } from './controllers/GameController';
import {
  registerUser,
  logIn,
  getAllUsers,
  getUserProfileData,
  friendRequest,
  createPrivateRoomController,
  getPrivateRoomsByOwnerController,
  deletePrivateRoomController,
  createInvitationController,
} from './controllers/UserController';
import { validateCreatePrivateRoomBody } from './validators/authValidator';
import { room1 } from './models/RoomModel';
import { connectedClientIds, connectedClients } from './models/SocketModel';
import { determineWinner } from './models/PokerModel';
import { updateStackSize } from './models/UserModel';

dotenv.config();
const app: Express = express();
app.set('view engine', 'ejs');
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

app.set('view engine', 'ejs');

app.post('/api/users', registerUser);
app.post('/api/logIn', logIn);
app.get('api/users', getAllUsers);

app.post('/api/game/play', connectRandomRoom);

app.get('/api/users/:userId', getUserProfileData);

app.post('/api/friendRequest', friendRequest);

app.post('/api/privateRooms', validateCreatePrivateRoomBody, createPrivateRoomController);

app.get('/privateRoomsByOwner', getPrivateRoomsByOwnerController);

app.post('/api/deletePrivateRooms/:roomName', deletePrivateRoomController);

app.post('/api/invitations', createInvitationController);

app.get('/game', renderGamePage);

const server = app.listen(PORT, () => {
  console.log(`App is listening on port http://${ip.address()}:${PORT}`);
});

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
  const { username, userId } = authenticatedUser;

  console.log(`${username} has connected`);
  connectedClients[username] = socket;
  connectedClientIds[userId] = socket;

  socket.on('disconnect', () => {
    delete connectedClients[username];
    console.log(`${username} has disconnected`);
    socketServer.emit('exitedChat', `${username} has left the chat.`);
  });

  socketServer.emit('enteredChat', `${username} has entered the chat`);

  socket.on('chatMessage', (msg: string) => {
    console.log(`received a chatMessage event from the client: ${username}`);
    socketServer.emit('chatMessage', username, msg);
  });
});

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
  const { username, userId } = authenticatedUser;

  socket.on('raise', (amount: number) => {
    if (room1.playerIds[room1.currentTurnIndex] !== userId) {
      return;
    }
    if (room1.playerFoldStatus[room1.currentTurnIndex] === true) {
      room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
      return;
    }
    // let betAmount = amount;
    if (room1.playerBankRolls[room1.currentTurnIndex] < amount) {
      // betAmount = room1.playerBankRolls[room1.currentTurnIndex];

      return;
    }
    if (amount <= room1.currentBet) {
      return;
    }

    console.log(`received a raise event from the client: ${username}`);
    room1.pot += amount;
    room1.playerBankRolls[room1.currentTurnIndex] -= amount;
    room1.lastBet[room1.currentTurnIndex] = amount;
    if (amount > room1.currentBet) {
      room1.currentBet = amount;
    }
    socketServer.emit(
      'addRaise',
      username,
      amount,
      room1.pot,
      room1.playerBankRolls[room1.currentTurnIndex]
    );
    room1.endGame[room1.currentTurnIndex] = false;
    room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
    socketServer.emit('currentTurn', room1.playerUsernames[room1.currentTurnIndex]);
  });

  socket.on('fold', () => {
    if (room1.playerIds[room1.currentTurnIndex] !== userId) {
      return;
    }
    if (room1.playerFoldStatus[room1.currentTurnIndex] === true) {
      room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
      return;
    }
    console.log(`received a fold event from the client: ${username}`);
    room1.playerFoldStatus[room1.currentTurnIndex] = true;
    socketServer.emit('fold', username);
    room1.endGame[room1.currentTurnIndex] = true;
    room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
  });

  socket.on('check', () => {
    if (room1.playerIds[room1.currentTurnIndex] !== userId) {
      return;
    }
    if (room1.playerFoldStatus[room1.currentTurnIndex] === true) {
      room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
      return;
    }
    console.log(`received a check event from the client: ${username}`);
    room1.pot += room1.currentBet - room1.lastBet[room1.currentTurnIndex];
    room1.playerBankRolls[room1.currentTurnIndex] -=
      room1.currentBet - room1.lastBet[room1.currentTurnIndex];
    socketServer.emit('check', username, room1.pot);
    room1.endGame[room1.currentTurnIndex] = true;
    room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
    if (
      room1.endGame[0] === true &&
      room1.endGame[1] === true &&
      room1.endGame[2] === true &&
      room1.endGame[3] === true
    ) {
      socket.emit('endGameCheck');
    }
  });

  socket.on('joinGame', () => {
    if (room1.playerIds.length < 4) {
      room1.playerIds.push(authenticatedUser.userId);
    }

    if (room1.playerIds.length === 4) {
      startGame(room1);
      socket.emit('startGame');
      room1.currentTurnIndex = 0;
    }
  });

  socket.on('endGame', async () => {
    const index = determineWinner(room1.playerHands, room1.playerFoldStatus);
    if (index === 0) {
      room1.playerBankRolls[0] += room1.pot;
    } else if (index === 1) {
      room1.playerBankRolls[1] += room1.pot;
    } else if (index === 2) {
      room1.playerBankRolls[2] += room1.pot;
    } else if (index === 3) {
      room1.playerBankRolls[3] += room1.pot;
    } else {
      for (let i = 0; i < room1.playerBankRolls.length; i += 1) {
        room1.playerBankRolls[i] += room1.pot / 4;
      }
    }

    for (let i = 0; i < room1.playerIds.length; i += 1) {
      await updateStackSize(room1.playerIds[i], room1.playerBankRolls[i]);
    }

    socketServer.emit('declareWinner', room1.playerUsernames[index]);
  });
});
