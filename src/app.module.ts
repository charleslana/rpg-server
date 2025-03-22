import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ValidationInterceptor } from '@/helpers/interceptor/validation-interceptor';
import { TaskService } from '@/modules/task/task.service';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserAttributeModule } from '@/modules/user-attribute/user-attribute.module';
import { SocketModule } from '@/modules/socket/socket.module';
import { SwaggerJsonController } from '@/swagger.controller';
import { LocalMiddleware } from '@/middleware/local-middleware';
import { ConfigModule } from '@nestjs/config';
import { ClientValidationMiddleware } from '@/middleware/client-validation-middleware';
import { UserStatisticModule } from './modules/user-statistic/user-statistic.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 1 * 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot(),
    UserModule,
    AuthModule,
    UserAttributeModule,
    SocketModule,
    UserStatisticModule,
  ],
  controllers: [AppController, SwaggerJsonController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    TaskService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocalMiddleware).forRoutes('api-docs-json');
    consumer
      .apply(ClientValidationMiddleware)
      .exclude('/', '/api-docs', '/api-docs-json')
      .forRoutes('*');
  }
}
