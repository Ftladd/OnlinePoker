import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { FriendRequest } from '../entities/FriendRequest';
import { PrivateRoom } from '../entities/PrivateRoom';
import { Invitation } from '../entities/Invitation';

const userRepository = AppDataSource.getRepository(User);
const friendRequestRepository = AppDataSource.getRepository(FriendRequest);
const privateRoomRepository = AppDataSource.getRepository(PrivateRoom);
const invitationRepository = AppDataSource.getRepository(Invitation);

async function allUserData(): Promise<User[]> {
  const allUsers = await userRepository.find();
  return allUsers;
}

async function addUser(username: string, email: string, passwordHash: string): Promise<User> {
  // 1) Create a new user object and set the properties
  let newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.passwordHash = passwordHash;
  // 2) Save it in the database
  newUser = await userRepository.save(newUser);
  // 3) Return the created user
  return newUser;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { email } });
  return user;
}

// Gets the user by checking userId in the database.
async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({
    select: {
      userId: true,
      email: true,
      stackSize: true,
      verifiedEmail: true,
    },
    where: { userId },
  });
  return user;
}

async function getUserByUsername(username: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { username } });
  return user;
}

// Function that gets the users with stackSize greater than or equal to a certain number provided.
async function getUsersByStackSize(stack: number): Promise<User[]> {
  const viralUsers = await userRepository
    .createQueryBuilder('user')
    .where('stackSize >= :stack', { stack })
    .select(['user.userId', 'user.stackSize'])
    .getMany();

  return viralUsers;
}

async function updateEmailAddress(userId: string, newEmail: string): Promise<void> {
  // TODO: Implement me!
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ email: newEmail })
    .where({ userId })
    .execute();
}

async function updateUsername(userId: string, newUsername: string): Promise<void> {
  await userRepository
    .createQueryBuilder()
    .update(User)
    .set({ username: newUsername })
    .where({ userId })
    .execute();
}

// async function getfriendRequestById(friendRequestId: string): Promise<FriendRequest | null> {
//   const request = await friendRequestRepository.findOne({ where: { friendRequestId } });
//   return request;
// }

async function addFriendRequest(
  senderUsername: string,
  receiverUsername: string
): Promise<FriendRequest | null> {
  // Find the user with the given sender username
  const senderUser = await userRepository.findOne({ where: { username: senderUsername } });

  // Find the user with the given receiver username
  const receiverUser = await userRepository.findOne({ where: { username: receiverUsername } });

  // If either the sender or the receiver username is invalid, return null
  if (!senderUser || !receiverUser) {
    return null;
  }

  // Create a new FriendRequest instance with pending status
  let friendRequest = new FriendRequest();
  friendRequest.status = 'pending';

  // Set the sender and receiver of the friend request to the respective user instances
  friendRequest.sender = senderUser;
  friendRequest.receiver = receiverUser;

  // Save the friend request to our database
  friendRequest = await friendRequestRepository.save(friendRequest);

  // Return the newly created friend request
  return friendRequest;
}

// accpet friend request model
async function acceptFriendRequest(friendRequestId: string): Promise<FriendRequest | null> {
  // Find the friend request with the given ID
  const friendRequest = await friendRequestRepository.findOne({ where: { friendRequestId } });

  // If the friend request doesn't exist, return null
  if (!friendRequest) {
    return null;
  }

  // Update the friend request status to 'accepted'
  friendRequest.status = 'accepted';

  // Save the updated friend request to the database
  await friendRequestRepository.save(friendRequest);

  // Return the updated friend request
  return friendRequest;
}

// decline friiend request model
async function declineFriendRequest(friendRequestId: string): Promise<FriendRequest | null> {
  // Find the friend request with the given ID
  const friendRequest = await friendRequestRepository.findOne({ where: { friendRequestId } });

  // If the friend request doesn't exist, return null
  if (!friendRequest) {
    return null;
  }

  // Update the friend request status to 'declined'
  friendRequest.status = 'declined';

  // Save the updated friend request to the database
  await friendRequestRepository.save(friendRequest);

  // Return the updated friend request
  return friendRequest;
}

// private room
async function createPrivateRoom(owner: User, roomName: string): Promise<PrivateRoom> {
  let privateRoom = new PrivateRoom();
  privateRoom.owner = owner;
  privateRoom.roomName = roomName;
  privateRoom = await privateRoomRepository.save(privateRoom);
  return privateRoom;
}

async function getPrivateRoomsByOwner(owner: User): Promise<PrivateRoom[]> {
  const privateRooms = await privateRoomRepository.find({ where: { owner } });
  return privateRooms;
}

// invitation system
async function createInvitation(
  senderUsername: string,
  roomName: string,
  invitedUsernames: string
): Promise<Invitation | null> {
  // Find the user with the given sender username
  const senderUser = await userRepository.findOne({ where: { username: senderUsername } });

  // If the sender username is invalid, return null
  if (!senderUser) {
    return null;
  }

  // Find the private room with the given name
  const privateRoom = await privateRoomRepository.findOne({ where: { roomName } });

  // If the room doesn't exist, return null
  if (!privateRoom) {
    return null;
  }

  // Find the users with the given invited usernames
  const invitedUsers = [];
  for (let i = 0; i < invitedUsernames.length; i += 1) {
    const invitedUser = await userRepository.findOne({ where: { username: invitedUsernames[i] } });
    if (!invitedUser) {
      return null;
    }
    invitedUsers.push(invitedUser);
  }

  // Create a new Invitation instance with a "pending" status
  let invitation = new Invitation();
  invitation.status = 'pending';

  // Set the sender and private room of the invitation
  invitation.sender = senderUser;
  invitation.privateRoom = privateRoom;

  // Add the invited users to the invitation
  invitation.invitedUsers = invitedUsers;

  // invitation.status = 'pending';

  // Save the invitation to the database
  invitation = await invitationRepository.save(invitation);

  // Return the newly created invitation
  return invitation;
}

async function acceptInvitation(invitationId: string): Promise<Invitation | null> {
  // Find the invitation with the given ID
  const invitation = await invitationRepository.findOne({ where: { invitationId } });

  // If the invitation doesn't exist, return null
  if (!invitation) {
    return null;
  }

  // Update the invitation status to 'accepted'
  invitation.status = 'accepted';

  // Save the updated invitation to the database
  await invitationRepository.save(invitation);

  // Return the updated invitation
  return invitation;
}

async function declineInvitation(invitationId: string): Promise<Invitation | null> {
  // Find the invitation with the given ID
  const invitation = await invitationRepository.findOne({ where: { invitationId } });

  // If the invitation doesn't exist, return null
  if (!invitation) {
    return null;
  }

  // Update the invitation status to 'declined'
  invitation.status = 'declined';

  // Save the updated invitation to the database
  await invitationRepository.save(invitation);

  // Return the updated invitation
  return invitation;
}

export {
  User,
  allUserData,
  addUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  getUsersByStackSize,
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
};
