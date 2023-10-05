import { Buffer } from 'buffer';

export class Base64 {
  static encode(data: string): string {
    return Buffer.from(data, 'utf-8').toString('base64');
  }

  static decode(encodeString: string): string {
    return Buffer.from(encodeString, 'base64').toString('utf-8');
  }
}
