import * as bcrypt from 'bcrypt';

export class Bcrypt {
  public static SALT_ROUND: number;

  static encodePassword(password: string): string {
    const res = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(Bcrypt.SALT_ROUND),
    );
    return res;
  }

  static compare(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
