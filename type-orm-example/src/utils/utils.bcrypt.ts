import * as bcrypt from 'bcrypt';

export class Bcrypt {
    public static SALT: number = 12;

    static encodePassword(password: string): string {
        return bcrypt.hashSync(password, this.SALT);
    }

    static compare(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }
}