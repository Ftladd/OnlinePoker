import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  addUser,
  getUserByUsername,
  allUserData,
  getUserById,
  updateEmailAddress,
  updateUsername,
  addFriendRequest,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;

  // Hash Password
  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(username, email, passwordHash);
    console.log(newUser);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function logIn(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as NewUserRequest;

  const user = await getUserByUsername(username);

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
    username: user.username,
  };
  req.session.isLoggedIn = true;

  res.redirect('/chat');
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
  const { sender, receiver } = req.body as FriendRequest;

  try {
    await addFriendRequest(sender, receiver);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

export { registerUser, logIn, getAllUsers, updateUserEmail, updateUserUsername, friendRequest };
