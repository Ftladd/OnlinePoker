// type DatabaseConstraintError = {
//   type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
//   columnName?: string;
//   message?: string;
// };

type NewUserRequest = {
  username: string;
  email: string;
  password: string;
};

type NewEmailBody = {
  userId: string;
  email: string;
};

type NewUsername = {
  userId: string;
  username: string;
};

type UserIdParam = {
  userId: string;
};
