import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { FriendRequest } from '../entities/FriendRequest';
import { PrivateRoom } from '../entities/PrivateRoom';

const userRepository = AppDataSource.getRepository(User);
const friendRequestRepository = AppDataSource.getRepository(FriendRequest);
const privateRoomRepository = AppDataSource.getRepository(PrivateRoom);

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

// friend request model
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

  // Create a new FriendRequest instance
  const friendRequest = new FriendRequest();

  // Set the sender and receiver of the friend request to the respective user instances
  friendRequest.sender = senderUser;
  friendRequest.receiver = receiverUser;

  // Save the friend request to our database
  await friendRequestRepository.save(friendRequest);

  // Return the newly created friend request
  return friendRequest;
}

// private room
async function createPrivateRoom(owner: User, roomName: string): Promise<PrivateRoom> {
  const privateRoom = new PrivateRoom();
  privateRoom.owner = owner;
  privateRoom.roomName = roomName;
  const createdPrivateRoom = await privateRoomRepository.save(privateRoom);
  return createdPrivateRoom;
}

async function getPrivateRoomsByOwner(owner: User): Promise<PrivateRoom[]> {
  const privateRooms = await privateRoomRepository.find({ where: { owner } });
  return privateRooms;
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
  createPrivateRoom,
  getPrivateRoomsByOwner,
};
