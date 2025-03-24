import { instrument } from '@socket.io/admin-ui';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import * as dotenv from 'dotenv';

dotenv.config();

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
  : [];

@WebSocketGateway({
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly socketService: SocketService) {}

  onModuleInit() {
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
  }

  public handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket, this.server);
  }
}
