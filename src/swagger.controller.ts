import { Controller, Get, INestApplication } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

@ApiTags('Swagger JSON')
@Controller('api-docs-json')
export class SwaggerJsonController {
  @ApiOperation({
    summary: 'Retorna o Swagger JSON para a API',
  })
  @Get()
  getSwaggerJson(app: INestApplication): object {
    const config = new DocumentBuilder()
      .setTitle('API Example')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();

    return SwaggerModule.createDocument(app, config);
  }
}
