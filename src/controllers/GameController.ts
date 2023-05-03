import { Request, Response } from 'express';
// import { parseDatabaseError } from '../utils/db-utils';
// import { connectedClientIds } from '../models/SocketModel';
import { room1 } from '../models/RoomModel';
import { dealCards } from '../models/PokerModel';
import { getUserById } from '../models/UserModel';

function renderGamePage(req: Request, res: Response): void {
  const { authenticatedUser } = req.session;
  res.render('gamePage', { room1, authenticatedUser });
}

async function connectRandomRoom(req: Request, res: Response): Promise<void> {
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || !authenticatedUser) {
    res.sendStatus(403); // forbidden
    return;
  }
  const user = await getUserById(authenticatedUser.userId);
  const money = user.stackSize;
  room1.playerUsernames.push(authenticatedUser.username);
  room1.playerBankRolls.push(money);
  dealCards(authenticatedUser.username);

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
