import { AuthDto, GetAuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Request as RequestExpress } from 'express';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'authenticate user' })
  @ApiBody({ type: AuthDto })
  @ApiHeader({
    name: 'client_id',
    required: true,
    description: 'Client ID for authentication',
  })
  @ApiHeader({
    name: 'client_secret',
    required: true,
    description: 'Client Secret for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: GetAuthDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    schema: {
      example: {
        message: 'Invalid credentials',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async signIn(
    @Body() authDto: AuthDto,
    @Request() req: RequestExpress,
  ) {
    this.logger.log(`signIn: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(authDto.email)}`);
    const auth = await this.authService.signIn(authDto);
    return plainToInstance(GetAuthDto, auth);
  }
}
