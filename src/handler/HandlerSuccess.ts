import { Response } from 'express';

export default class HandlerSuccess {
  constructor(message: string, statusCode = 200, key = 'NO_KEY', value: unknown | null = null) {
    this.error = false;
    this.key = key;
    this.value = value;
    this.message = message;
    this.statusCode = statusCode;
  }

  public readonly error: boolean;
  public readonly key: string;
  public readonly value: unknown | null;
  public readonly message: string;
  public readonly statusCode: number;

  toJSON(response: Response) {
    return response.status(this.statusCode).json({
      error: this.error,
      key: this.key,
      value: this.value,
      message: this.message,
    });
  }
}
