import { Request, Response } from 'express';
import argon2 from 'argon2';
import {
  User,
  addUser,
  getUserByUsername,
  allUserData,
  getUserById,
  updateEmailAddress,
  updateUsername,
  addFriendRequest,
  createPrivateRoom,
  getPrivateRoomByName,
  getPrivateRoomsByOwner,
  deletePrivateRoom,
  createInvitation,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';
import { sendEmail } from '../services/emailService';

let domain = `${process.env.hostname}`;
if (!process.env.hostname.startsWith('https')) {
  domain += `:${process.env.PORT}`;
}

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;
  console.log(req.body);
  const { authenticatedUser } = req.session;

  if (authenticatedUser && username === authenticatedUser.username) {
    res.sendStatus(404);
    return;
  }
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

  req.session.authenticatedUser = {
    userId: user.userId,
    email: user.email,
    username: user.username,
  };
  req.session.isLoggedIn = true;

  res.redirect('/play');
}

async function getAllUsers(req: Request, res: Response): Promise<void> {
  const users = await allUserData();

  res.json(users);
}

async function updateUserEmail(req: Request, res: Response): Promise<void> {
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

async function getUserProfileData(req: Request, res: Response): Promise<void> {
  const { userId } = req.params as UserIdParameter;

  // Get the user account
  const user = await getUserById(userId);

  if (!user) {
    res.sendStatus(404); // 404 Not Found
    return;
  }

  // Now update their profile views
  // user = await incrementProfileViews(user);

  // res.json(user);
  res.render('profilePage', { username: user.username, email: user.email, userId: user.userId });
}

// friend request controller
async function friendRequest(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  const { username, userId } = authenticatedUser;

  // Get the necessary data from the request body
  const { receiverUsername } = req.body as NewFriendRequest;
  console.log(req.body);

  if (username === receiverUsername) {
    res.sendStatus(400);
    return;
  }

  try {
    // Send the friend request
    const friendRequests = await addFriendRequest(username, receiverUsername);
    const receiverUser = await getUserByUsername(receiverUsername);
    await sendEmail(
      receiverUser.email,
      'Friend Request!',
      `You have received a friend request from ${username}.View their profile at ${domain}/api/users/${userId}`
    );
    console.log(receiverUser.email);
    // If the request was successfully created, send a 200 OK response with the friendRequestId
    res.status(200).json(friendRequests);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

// create  a new private room for the authenticated user.
async function createPrivateRoomController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;

  if (!user) {
    res.status(401).send('Unauthorized');
    return;
  }

  const { roomName } = req.body as PrivateRoomRequest;

  try {
    // Check if a private room with the given name already exists
    const existingPrivateRoom = await getPrivateRoomByName(roomName);
    if (existingPrivateRoom) {
      res.status(400).send('A private room with that name already exists');
      return;
    }

    const privateRoom = await createPrivateRoom(user, roomName);
    // res.status(200).json(privateRoom);
    console.log(privateRoom);
    res.redirect('/privateRoom');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

// retrieves all the private rooms owned by a specific user,
// identified by the authenticated user stored in the session.
async function getPrivateRoomsByOwnerController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;

  try {
    const privateRooms = await getPrivateRoomsByOwner(user);
    // Return the private rooms
    res.render('privateRoomOwner', { user, privateRooms });
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}
// delete private room
async function deletePrivateRoomController(req: Request, res: Response): Promise<void> {
  const { authenticatedUser } = req.session;
  const { userId } = authenticatedUser;
  const user = await getUserById(userId);

  const privateRoomName = req.params.roomName;

  try {
    // Check if the private room belongs to the authenticated user
    const privateRoom = await getPrivateRoomByName(privateRoomName);
    // console.log(`Owner: ${JSON.stringify(privateRoom.owner, null, 4)}`);
    // console.log(`User.privateRooms: ${JSON.stringify(user.privateRooms, null, 4)}`);

    if (!privateRoom) {
      res.status(404).send('Private room not found');
      return;
    }

    if (privateRoom.owner.userId !== user.userId) {
      res.status(403).send('You do not own this room');
      return;
    }

    await deletePrivateRoom(privateRoom.roomName);
    console.log(privateRoomName);

    res.redirect('/privateRoomsByOwner');
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function createInvitationController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const { authenticatedUser, isLoggedIn } = req.session;
  if (!isLoggedIn) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  const { username } = authenticatedUser;

  // Get the necessary data from the request body
  const { roomName, invitedUsernames } = req.body as NewInvitation;
  console.log(req.body);

  if (username === invitedUsernames) {
    res.sendStatus(400);
    return;
  }

  try {
    // Send the invitation
    const invitation = await createInvitation(username, roomName, invitedUsernames);
    const privateRoom = await getPrivateRoomByName(roomName);
    const invitedUser = await getUserByUsername(invitedUsernames);
    await sendEmail(
      invitedUser.email,
      'Invitation to join private room!',
      `You have received an invitation from ${username} to join the private room ${roomName}.`
    );
    console.log(invitedUser.email);
    // If the invitation was successfully created, send a 200 OK response with the invitation details
    res.status(200).json({ invitation, privateRoom });
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
  getUserProfileData,
  friendRequest,
  createPrivateRoomController,
  getPrivateRoomsByOwnerController,
  deletePrivateRoomController,
  createInvitationController,
};
