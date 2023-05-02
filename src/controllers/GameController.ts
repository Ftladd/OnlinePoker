import { Request, Response } from 'express';
// import { parseDatabaseError } from '../utils/db-utils';
// import { connectedClientIds } from '../models/SocketModel';
import { room1 } from '../models/RoomModel';

function renderGamePage(req: Request, res: Response): void {
  res.render('gamePage', { room1 });
}

function connectRandomRoom(req: Request, res: Response): void {
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || !authenticatedUser) {
    res.sendStatus(403); // forbidden
    return;
  }
  room1.playerUsernames.push(authenticatedUser.username);
  res.redirect('/waitingRoom');
}

// if (
//   room1.player1Id !== undefined &&
//   room1.player2Id !== undefined &&
//   room1.player3Id !== undefined &&
//   room1.player4Id !== undefined
// ) {
//   connectedClientIds()
//   startGame(room1);
// }

export { connectRandomRoom, renderGamePage };
