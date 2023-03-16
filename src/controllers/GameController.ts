import { Request, Response } from 'express';
// import { parseDatabaseError } from '../utils/db-utils';
import { getUserById } from '../models/UserModel';
import { randomRooms } from '../models/RoomModel';
import { playMatch } from '../models/GameModel';

function connectRandomRoom(req: Request, res: Response): void {
  const { userId } = req.params as UserIdParam;
  const { isLoggedIn, authenticatedUser } = req.session;

  if (!isLoggedIn || authenticatedUser.userId !== userId) {
    res.sendStatus(403); // forbidden
    return;
  }

  for (let i = 0; i < randomRooms.length; i += 1) {
    if (randomRooms[i].player1Id === undefined) {
      randomRooms[i].player1Id = userId;
      return;
    }
    if (randomRooms[i].player2Id === undefined) {
      randomRooms[i].player2Id = userId;
      return;
    }
    if (randomRooms[i].player3Id === undefined) {
      randomRooms[i].player3Id = userId;
      return;
    }
    if (randomRooms[i].player4Id === undefined) {
      randomRooms[i].player4Id = userId;
      return;
    }
  }

  res.sendStatus(404);
  // I'd rather send a message that there isn't an empty
  // But I'm not sure how to do that
}

async function startGame(req: Request, res: Response): Promise<void> {
  for (let i = 0; i < randomRooms.length; i += 1) {
    if (
      randomRooms[i].player1Id !== undefined &&
      randomRooms[i].player2Id !== undefined &&
      randomRooms[i].player3Id !== undefined &&
      randomRooms[i].player4Id !== undefined
    ) {
      const user1 = await getUserById(randomRooms[i].player1Id);
      const user2 = await getUserById(randomRooms[i].player2Id);
      const user3 = await getUserById(randomRooms[i].player3Id);
      const user4 = await getUserById(randomRooms[i].player4Id);

      const player1: Player = {
        balance: user1.stackSize,
        hand: [],
        folded: false,
        handRank: 0,
        userId: user1.userId,
        bet: 0,
      };
      const player2: Player = {
        balance: user2.stackSize,
        hand: [],
        folded: false,
        handRank: 0,
        userId: user2.userId,
        bet: 0,
      };
      const player3: Player = {
        balance: user3.stackSize,
        hand: [],
        folded: false,
        handRank: 0,
        userId: user3.userId,
        bet: 0,
      };
      const player4: Player = {
        balance: user4.stackSize,
        hand: [],
        folded: false,
        handRank: 0,
        userId: user4.userId,
        bet: 0,
      };

      res.sendStatus(200);
      playMatch(player1, player2, player3, player4);
      randomRooms[i].player1Id = undefined;
      randomRooms[i].player2Id = undefined;
      randomRooms[i].player3Id = undefined;
      randomRooms[i].player4Id = undefined;
      return;
    }
  }
  res.sendStatus(404);
}

export { connectRandomRoom, startGame };
