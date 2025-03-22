import { Injectable } from '@nestjs/common';
import { RoomInterface } from './interface/room.interface';
import { UserInterface } from './interface/user.interface';

@Injectable()
export class SocketRoomService {
  private readonly rooms: RoomInterface[] = [];

  public addRoom(room: RoomInterface): RoomInterface {
    this.rooms.push(room);
    return room;
  }

  public removeRoom(id: string): void {
    const index = this.rooms.findIndex((room) => room.id === id);
    if (index !== -1) {
      this.rooms.splice(index, 1);
    }
  }

  public getAllRooms(): RoomInterface[] {
    return this.rooms;
  }

  public getRoom(id: string): RoomInterface | undefined {
    return this.rooms.find((room) => room.id === id);
  }

  public updateRoomOwnerId(roomId: string, newOwnerId: number): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.ownerId = newOwnerId;
    }
  }

  public getLastUserExcept(
    roomId: string,
    excludedUserId: string,
  ): UserInterface | undefined {
    const room = this.getRoom(roomId);
    if (room) {
      const usersExceptExcluded = room.users.filter(
        (user) => user.id !== excludedUserId,
      );
      if (usersExceptExcluded.length > 0) {
        return usersExceptExcluded[usersExceptExcluded.length - 1];
      }
    }
    return undefined;
  }

  public removeUserFromRoom(roomId: string, userId: string): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.users = room.users.filter((user) => user.id !== userId);
      if (room.users.length === 0) {
        this.removeRoom(roomId);
      }
    }
  }

  public updateRoomIdToLastUserId(roomId: string): void {
    const room = this.getRoom(roomId);
    if (room && room.users.length > 0) {
      const lastUser: UserInterface = room.users[room.users.length - 1];
      room.id = lastUser.id;
    }
  }

  public isRoomOwner(roomId: string, userOriginalId: number): boolean {
    const room = this.getRoom(roomId);
    return room ? room.ownerId === userOriginalId : false;
  }

  public updateRoomId(oldId: string, newId: string): void {
    const roomIndex = this.rooms.findIndex((room) => room.id === oldId);
    if (roomIndex !== -1) {
      this.rooms[roomIndex].id = newId;
    }
  }

  public hasUserInAnyRoom(userId: string): boolean {
    return this.rooms.some((room) => this.isUserInRoom(room, userId));
  }

  public hasUserOriginalIdInAnyRoom(userId: number): boolean {
    return this.rooms.some((room) => this.isUserOriginalIdInRoom(room, userId));
  }

  public addUserToRoom(roomId: string, user: UserInterface): void {
    const room = this.getRoom(roomId);
    if (room) {
      room.users.push(user);
    }
  }

  public updateUserWatchInRoom(
    roomId: string,
    userId: string,
    watch: boolean,
  ): void {
    const room = this.getRoom(roomId);
    if (room) {
      const userToUpdate = room.users.find((user) => user.id === userId);
      if (userToUpdate) {
        userToUpdate.watch = watch;
      }
    }
  }

  public getRoomByUser(userId: string): RoomInterface | undefined {
    return this.rooms.find((room) =>
      room.users.some((user) => user.id === userId),
    );
  }

  private isUserInRoom(room: RoomInterface, userId: string): boolean {
    return room.users.some((user) => user.id === userId);
  }

  private isUserOriginalIdInRoom(
    room: RoomInterface,
    originalId: number,
  ): boolean {
    return room.users.some((user) => user.originalId === originalId);
  }
}
