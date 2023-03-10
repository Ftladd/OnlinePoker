import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';
import { FriendRequest } from '../entities/FriendRequest';

const userRepository = AppDataSource.getRepository(User);
const friendRequestRepository = AppDataSource.getRepository(FriendRequest);

async function allUserData(): Promise<User[]> {
  const allUsers = await userRepository.find();
  return allUsers;
}

async function addUser(email: string, passwordHash: string): Promise<User> {
  // 1) Create a new user object and set the properties
  let newUser = new User();
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

// Function that gets the users with stackSize greater than or equal to a certain number provided.
async function getUsersByStackSize(stack: number): Promise<User[]> {
  const viralUsers = await userRepository
    .createQueryBuilder('user')
    .where('stackSize >= :stack', { stack })
    .select(['user.email', 'user.userId', 'user.stackSize', 'user.joinedOn'])
    .getMany();

  return viralUsers;
}

// friend request model
async function addFriendRequest(sender: string, receiver: string): Promise<FriendRequest | null> {
  // Find the user with the given sender email
  const senderUser = await userRepository.findOne({ where: { email: sender } });

  // Find the user with the given receiver email
  const receiverUser = await userRepository.findOne({ where: { email: receiver } });

  // If either the sender or the receiver email is invalid, return null
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

export { allUserData, addUser, getUserByEmail, getUserById, getUsersByStackSize, addFriendRequest };
