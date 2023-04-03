import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    // NOTES: Add your app's custom session properties here:
    authenticatedUser: {
      userId: string;
      username: string;
      email: string;
    };
    isLoggedIn: boolean;
    coins: number;
    // logInAttempts: number;
    // logInTimeout: Date;
  }
}
