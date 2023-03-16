// type DatabaseConstraintError = {
//   type: 'unique' | 'check' | 'not null' | 'foreign key' | 'unknown';
//   columnName?: string;
//   message?: string;
// };

type NewUserRequest = {
  email: string;
  password: string;
  username: string;
};

type NewEmailBody = {
  userId: string;
  email: string;
};

type NewUsername = {
  userId: string;
  username: string;
};
