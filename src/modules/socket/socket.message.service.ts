import { Injectable } from '@nestjs/common';
import { MessageInterface } from './interface/message.interface';

@Injectable()
export class SocketMessageService {
  private readonly messages: MessageInterface[] = [];

  public addMessage(message: MessageInterface): void {
    this.messages.push(message);
  }

  public getLastMessage(): MessageInterface | undefined {
    return this.messages[this.messages.length - 1];
  }
}
