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
// import { playMatch } from './controllers/game'; // for testing
import { connectRandomRoom, renderGamePage } from './controllers/GameController';
import {
  registerUser,
  logIn,
  getAllUsers,
  friendRequest,
  acceptFriendRequestController,
  declineFriendRequestController,
  createPrivateRoomController,
  getPrivateRoomsByOwnerController,
  deletePrivateRoomController,
  createInvitationController,
  acceptInvitationController,
  declineInvitationController,
} from './controllers/UserController';
<<<<<<< HEAD
import { connectedClients, connectedClientIds } from './models/SocketModel';
import { room1 } from './models/RoomModel';
=======
import { validateCreatePrivateRoomBody } from './validators/authValidator';
>>>>>>> 1390a09 (update)

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

app.post('/api/users', registerUser);
app.post('/api/logIn', logIn);
app.get('api/users', getAllUsers);

app.post('/api/game/play', connectRandomRoom);

app.post('/api/friendRequest', friendRequest);

app.post('/api/friendRequest/:friendRequestId/accept', acceptFriendRequestController);

app.post('/api/friendRequest/:friendRequestId/decline', declineFriendRequestController);

app.post('/api/privateRooms', validateCreatePrivateRoomBody, createPrivateRoomController);

app.get('/privateRoomsByOwner', getPrivateRoomsByOwnerController);

app.post('/api/deletePrivateRooms/:roomName', deletePrivateRoomController);

app.post('/api/invitations', createInvitationController);

app.post('/api/invitation/:invitationId/accept', acceptInvitationController);

app.post('/api/invitation/:invitationId/decline', declineInvitationController);

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
      return;
    }
    let betAmount = amount;
    if (room1.playerBankRolls[room1.currentTurnIndex] < amount) {
      betAmount = room1.playerBankRolls[room1.currentTurnIndex];
    }
    console.log(`received a raise event from the client: ${username}`);
    room1.pot += betAmount;
    if (betAmount > room1.currentBet) {
      room1.currentBet = betAmount;
    }
    socketServer.emit(
      'addRaise',
      username,
      amount,
      room1.pot,
      room1.playerBankRolls[room1.currentTurnIndex]
    );
    room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
  });

  socket.on('fold', () => {
    if (room1.playerIds[room1.currentTurnIndex] !== userId) {
      return;
    }
    if (room1.playerFoldStatus[room1.currentTurnIndex] === true) {
      return;
    }
    console.log(`received a fold event from the client: ${username}`);
    room1.playerFoldStatus[room1.currentTurnIndex] = true;
    socketServer.emit('fold', username);

    room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
  });

  socket.on('check', () => {
    if (room1.playerIds[room1.currentTurnIndex] !== userId) {
      return;
    }
    if (room1.playerFoldStatus[room1.currentTurnIndex] === true) {
      return;
    }
    console.log(`received a check event from the client: ${username}`);
    room1.pot += room1.currentBet;
    socketServer.emit('check', username);

    room1.currentTurnIndex = (room1.currentTurnIndex + 1) % room1.playerIds.length;
  });
  socket.on('joinGame', () => {
    if (room1.playerIds.length < 4) {
      room1.playerIds.push(authenticatedUser.userId);
    }

    if (room1.playerIds.length === 4) {
      socket.emit('startGame');
      room1.currentTurnIndex = 0;
    }
  });
});
