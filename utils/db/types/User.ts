export default interface User {
  _id?: string;
  email: string;
  username?: string;
  password?: string;
  image?: string;
  verified: boolean;
  createdAt: Date;
  verificationCode?: string;
  verificationCodeSetAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenSetAt?: Date;
}
