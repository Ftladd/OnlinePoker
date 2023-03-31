import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  User,
  addUser,
  getUserByEmail,
  allUserData,
  getUserById,
  updateEmailAddress,
  updateUsername,
  addFriendRequest,
  createPrivateRoom,
  getPrivateRoomsByOwner,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;

  // Hash Password
  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(username, email, passwordHash);
    console.log(newUser);
    res.status(201);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as NewUserRequest;

  const user = await getUserByEmail(email);

  if (!user) {
    res.sendStatus(404);
    return; // exit the function
  }

  const { passwordHash } = user;

  // Check password
  if (!(await argon2.verify(passwordHash, password))) {
    res.sendStatus(404);
    return;
  }

  await req.session.clearSession();
  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
  };
  req.session.isLoggedIn = true;

  res.sendStatus(200);
}

async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await allUserData();

  res.json(users);
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
  // TODO: Implement me!
  const { email, userId } = req.params as NewEmailBody;

  const user = await getUserById(userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  try {
    await updateEmailAddress(userId, email);
    user.email = email;
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }

  res.sendStatus(200);
}

async function updateUserUsername(req: Request, res: Response): Promise<void> {
  // TODO: Implement me!
  const { username, userId } = req.params as NewUsername;

  const user = await getUserById(userId);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  try {
    await updateUsername(userId, username);
    user.username = username;
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err);
    res.sendStatus(500).json(databaseErrorMessage);
  }

  res.sendStatus(200);
}

// friend request controller
async function friendRequest(req: Request, res: Response): Promise<void> {
  const { senderUsername, receiverUsername } = req.body as NewFriendRequest;

  try {
    await addFriendRequest(senderUsername, receiverUsername);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function createPrivateRoomController(req: Request, res: Response): Promise<void> {
  // Extract roomName from the request body
  const { roomName } = req.body as PrivateRoomRequest;
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;

  try {
    const privateRoom = await createPrivateRoom(user, roomName);
    res.status(201).json(privateRoom);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function getPrivateRoomsByOwnerController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;

  try {
    const privateRooms = await getPrivateRoomsByOwner(user);
    // Return the private rooms in the response
    res.json(privateRooms);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

export {
  registerUser,
  logIn,
  getAllUsers,
  updateUserEmail,
  updateUserUsername,
  friendRequest,
  createPrivateRoomController,
  getPrivateRoomsByOwnerController,
};
