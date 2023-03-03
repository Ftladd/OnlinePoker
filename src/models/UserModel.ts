import { AppDataSource } from '../dataSource';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

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

async function getUserById(userId: string): Promise<User | null> {
  const user = await userRepository.findOne({ where: { userId } });
  return user;
}

async function getViralUsers(): Promise<User[]> {
  const viralUsers = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :viralAmount', { viralAmount: 1000 })
    .select(['user.email', 'user.profileViews', 'userId'])
    .getMany();

  return viralUsers;
}

async function getusersByViews(minViews: number): Promise<User[]> {
  const viralUsers = await userRepository
    .createQueryBuilder('user')
    .where('profileViews >= :viralAmount', { minViews })
    .select(['user.email', 'user.userId', 'user.profileViews', 'user.joinedOn'])
    .getMany();

  return viralUsers;
}

export { addUser, getUserByEmail, getUserById, getViralUsers, getusersByViews };
