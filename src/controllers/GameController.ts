import { Request, Response } from 'express';
// import { parseDatabaseError } from '../utils/db-utils';
import { startGame } from '../models/GameModel';
// import { connectedClientIds } from '../models/SocketModel';
import { room1 } from '../models/RoomModel';

function renderGamePage(req: Request, res: Response): void {
  const { authenticatedUser } = req.session;
  const { username } = authenticatedUser;
  let stackSize = 0;
  for (let i = 0; i < room1.playerIds.length; i += 1) {
    if (room1.playerUsernames[i] === username) {
      stackSize = room1.playerBankRolls[i];
    }
  }
  const userInfo = [username, stackSize];
  res.render('gamePage', userInfo);
}
function connectRandomRoom(req: Request, res: Response): void {
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || !authenticatedUser) {
    res.sendStatus(403); // forbidden
    return;
  }
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

export { connectRandomRoom, startGame, renderGamePage };
