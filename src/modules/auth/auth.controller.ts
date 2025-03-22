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
  Response,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  Request as RequestExpress,
  Response as ResponseExpress,
} from 'express';
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DisableEndpointGuard } from '@/modules/disable-endpoint-guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'authenticate user', deprecated: true })
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
  @UseGuards(DisableEndpointGuard)
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

  @ApiOperation({ summary: 'authenticate user v2' })
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
    schema: {
      example: {
        message: 'Login bem-sucedido',
      },
    },
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
  @Post('v2/login')
  public async signInWithCookie(
    @Body() authDto: AuthDto,
    @Request() req: RequestExpress,
    @Response() res: ResponseExpress,
  ) {
    this.logger.log(`signInWithCookie: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(authDto.email)}`);

    const auth = await this.authService.signIn(authDto);

    res.cookie('access_token', auth.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
    });
    return res.json({ message: 'Login bem-sucedido' });
  }
}
