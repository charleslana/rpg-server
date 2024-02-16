import { Server } from 'socket.io';

export function configureSockets(io: Server) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  io.on('connection', socket => {});
}
