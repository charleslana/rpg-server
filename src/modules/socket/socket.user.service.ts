import { Injectable } from '@nestjs/common';
import { UserInterface } from './interface/user.interface';

@Injectable()
export class SocketUserService {
  private readonly users: UserInterface[] = [];

  public addUser(user: UserInterface): void {
    if (!this.userExists(user.id)) {
      this.users.push(user);
    }
  }

  public removeUser(id: string): void {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  public getAllUsers(): UserInterface[] {
    return this.users;
  }

  public getUser(id: string): UserInterface | undefined {
    return this.users.find((user) => user.id === id);
  }

  public updateUserName(id: string, newName: string): void {
    const user = this.getUser(id);
    if (user) {
      user.name = newName;
    }
  }

  public updateUserOriginalId(id: string, originalId: number): void {
    const user = this.getUser(id);
    if (user) {
      user.originalId = originalId;
    }
  }

  public userOriginalIdExists(originalId: number): boolean {
    return this.users.some((user) => user.originalId === originalId);
  }

  private userExists(id: string): boolean {
    return this.users.some((user) => user.id === id);
  }
}
