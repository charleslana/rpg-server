export default class HandlerError {
  constructor(message: string, statusCode = 400, key = 'NO_KEY', value: unknown | null = null) {
    this.error = true;
    this.key = key;
    this.value = value;
    this.message = message;
    this.statusCode = statusCode;
  }

  public readonly error?: boolean;
  public readonly key: string;
  public readonly value: unknown | null;
  public readonly message: string;
  public readonly statusCode: number;
}
