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
  acceptFriendRequest,
  declineFriendRequest,
  createPrivateRoom,
  getPrivateRoomsByOwner,
  createInvitation,
  acceptInvitation,
  declineInvitation,
} from '../models/UserModel';
import { parseDatabaseError } from '../utils/db-utils';

async function registerUser(req: Request, res: Response): Promise<void> {
  const { username, email, password } = req.body as NewUserRequest;
  const { authenticatedUser } = req.session;

  if (username === authenticatedUser.username) {
    res.sendStatus(404);
    return;
  }
  // Hash Password
  const passwordHash = await argon2.hash(password);

  try {
    const newUser = await addUser(username, email, passwordHash);
    console.log(newUser);
    res.redirect('/api/login');
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

// friend request controller
async function friendRequest(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;
  if (!user) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  // Get the necessary data from the request body
  const { senderUsername, receiverUsername } = req.body as NewFriendRequest;

  try {
    // Send the friend request
    const friendRequests = await addFriendRequest(senderUsername, receiverUsername);

    // If the request was successfully created, send a 200 OK response with the friendRequestId
    res.status(200).json(friendRequests);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

// accpt friend request controller
async function acceptFriendRequestController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;
  if (!user) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  // Get the friend request ID from the request parameters
  const { friendRequestId } = req.params;

  try {
    // Accept the friend request
    const request = await acceptFriendRequest(friendRequestId);

    if (!request) {
      res.status(404).send('Friend request not found');
    } else {
      res.status(200).json(request);
    }
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

// declined friend request controller
async function declineFriendRequestController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;
  if (!user) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  // Get the friend request ID from the request parameters
  const { friendRequestId } = req.params;

  try {
    // Decline the friend request
    const request = await declineFriendRequest(friendRequestId);

    if (!request) {
      res.status(404).send('Friend request not found');
    } else {
      res.status(200).json(request);
    }
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
    const privateRoom = await createPrivateRoom(user, roomName);
    res.status(200).json(privateRoom);
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
    // Return the private rooms in the response
    res.status(200).json(privateRooms);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function createInvitationController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;
  if (!user) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  // Get the necessary data from the request body
  const { senderUsername, roomName, invitedUsernames } = req.body as NewInvitation;

  try {
    // Create the invitation
    const invitation = await createInvitation(senderUsername, roomName, invitedUsernames);

    // If the invitation was successfully created, send a 200 OK response
    res.status(200).json(invitation);
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function acceptInvitationController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;
  if (!user) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  // Get the invitation ID from the request parameters
  const { invitationId } = req.params;

  try {
    // Accept the invitation
    const invitation = await acceptInvitation(invitationId);

    if (!invitation) {
      res.status(404).send('Invitation not found');
    } else {
      res.status(200).json(invitation);
    }
  } catch (err) {
    console.error(err);
    const databaseErrorMessage = parseDatabaseError(err as Error);
    res.status(500).json(databaseErrorMessage);
  }
}

async function declineInvitationController(req: Request, res: Response): Promise<void> {
  // Get the authenticated user from the session
  const user = req.session.authenticatedUser as User;
  if (!user) {
    // Return a 401 unauthorized status if the user is not authenticated
    res.status(401).send('Unauthorized');
    return;
  }

  // Get the invitation ID from the request parameters
  const { invitationId } = req.params;

  try {
    // Decline the invitation
    const invitation = await declineInvitation(invitationId);

    if (!invitation) {
      res.status(404).send('Invitation not found');
    } else {
      res.status(200).json(invitation);
    }
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
  acceptFriendRequestController,
  declineFriendRequestController,
  createPrivateRoomController,
  getPrivateRoomsByOwnerController,
  createInvitationController,
  acceptInvitationController,
  declineInvitationController,
};
