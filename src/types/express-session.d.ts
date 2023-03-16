import 'express-session';

declare module 'express-session' {
  export interface Session {
    clearSession(): Promise<void>; // DO NOT MODIFY THIS!

    // NOTES: Add your app's custom session properties here:
    authenticatedUser: {
      userId: string;
      email: string;
    };
    isLoggedIn: boolean;
    // logInAttempts: number;
    // logInTimeout: Date;
  }
}
