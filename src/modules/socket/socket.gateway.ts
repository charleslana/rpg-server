import { instrument } from '@socket.io/admin-ui';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({
  cors: {
    origin: [
      'http://localhost:8090',
      'http://localhost:4000',
      'http://localhost:4001',
      '*',
    ],
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
