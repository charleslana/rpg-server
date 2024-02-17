import cors from 'cors';
import errorMiddleware from 'middleware/errorMiddleware';
import express, { Request, Response } from 'express';
import HandlerSuccess from 'handler/HandlerSuccess';
import http from 'http';
import logger from 'utils/logger';
import rateLimit from 'express-rate-limit';
import routes from 'route';
import { configureSockets } from 'websocket';
import { CronJobService } from 'service/CronjobService';
import { errors } from 'celebrate';
import { instrument } from '@socket.io/admin-ui';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: true,
      message: 'Muitas solicitações deste IP. Tente novamente após 1 minuto',
    },
  })
);

app.use(routes);

app.use(errors());

app.use(errorMiddleware);

app.use((request: Request, response: Response) => {
  logger.info(`Route ${request.url} not found`);
  return new HandlerSuccess('Rota não encontrada', 404).toJSON(response);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

configureSockets(io);

const start = async () => {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect().then(() => logger.info('Banco de dados conectado com sucesso'));
    const port = process.env.PORT || 8080;
    const address = process.env.ADDRESS || 'localhost';
    server.listen({ port: port, host: address });
    logger.info(`Servidor conectado na porta ${port}`);
    const cron = new CronJobService();
    cron.start();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
};

start();
