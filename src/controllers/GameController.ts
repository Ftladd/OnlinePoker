import { Request, Response } from 'express';
// import { parseDatabaseError } from '../utils/db-utils';
import { startGame } from '../models/GameModel';

// Game Room
const room1: GameRoom = {
  player1Id: undefined,
  player2Id: undefined,
  player3Id: undefined,
  player4Id: undefined,
};

function connectRandomRoom(req: Request, res: Response): void {
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || !authenticatedUser) {
    res.sendStatus(403); // forbidden
    return;
  }
  if (room1.player1Id === undefined) {
    room1.player1Id = authenticatedUser.userId;
    res.redirect('/waitingRoom');
  } else if (room1.player2Id === undefined) {
    room1.player2Id = authenticatedUser.userId;
    res.redirect('/waitingRoom');
  } else if (room1.player3Id === undefined) {
    room1.player3Id = authenticatedUser.userId;
    res.redirect('/waitingRoom');
  } else if (room1.player4Id === undefined) {
    room1.player4Id = authenticatedUser.userId;
    res.redirect('/waitingRoom');
  } else {
    res.sendStatus(404);
  }
  if (
    room1.player1Id !== undefined &&
    room1.player2Id !== undefined &&
    room1.player3Id !== undefined &&
    room1.player4Id !== undefined
  ) {
    res.sendStatus(200);
    startGame(room1);
  } else {
    res.sendStatus(404);
  }
}

export { connectRandomRoom, startGame };
