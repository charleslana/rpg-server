import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { LocalMiddleware } from './middleware/local-middleware';

export function setup(app: INestApplication): INestApplication {
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
    }),
  );

  const swaggerPath = 'api-docs';
  // eslint-disable-next-line @typescript-eslint/unbound-method
  app.use(`/${swaggerPath}`, new LocalMiddleware().use);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  app.use(`/api-docs-json`, new LocalMiddleware().use);

  const config = new DocumentBuilder()
    .setTitle('Konline API')
    .setDescription('API documentation Konline rpg server')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'API Documentation',
    swaggerOptions: {
      url: `/api-docs-json`,
    },
  });

  return app;
}
