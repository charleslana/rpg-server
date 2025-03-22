import { AuthGuard } from '../auth/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { PageDto } from '@/dto/page.dto';
import { plainToInstance } from 'class-transformer';
import { Request as RequestExpress, Response } from 'express';
import { RoleEnum } from '@prisma/client';
import { RoleGuard } from '../auth/role.guard';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto/update-user.dto';
import { UserPaginatedDto } from './dto/user.paginated.dto';
import { UserService } from './user.service';
import { UserSocketExistsGuard } from '../auth/user.socket.exists.guard';
import { GetUserDto, GetUserExposeDto } from './dto/get-user.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { FindOneParams } from '@/modules/find-one.params';
import {
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('User')
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
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @Post()
  public async createUser(
    @Body() createUserDto: CreateUserDto,
    @Request() req: RequestExpress,
  ) {
    this.logger.log(`createUser: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(createUserDto.email)}`);
    const user = await this.userService.create(createUserDto);
    return plainToInstance(GetUserDto, user);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [GetUserDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, new RoleGuard([RoleEnum.admin]))
  @Get()
  public async getUsers(@Request() req: RequestExpress): Promise<GetUserDto[]> {
    this.logger.log(`getUsers: Request made to ${req.url}`);
    const users = await this.userService.getAll();
    return plainToInstance(GetUserDto, users);
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'Successfully deleted user' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, new RoleGuard([RoleEnum.admin]))
  @Delete(':id')
  public async deleteUser(
    @Param() params: FindOneParams,
    @Res() res: Response,
    @Request() req: RequestExpress,
  ) {
    this.logger.log(`deleteUser: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(params)}`);
    const { id } = params;
    const response = await this.userService.exclude(id);
    return res.status(response.statusCode).json(response.toJson());
  }

  @ApiOperation({ summary: 'Update user password' })
  @ApiBody({ type: UpdateUserPasswordDto })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('change-password')
  public async updateUserPassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @Request() req: RequestExpress,
  ) {
    this.logger.log(`updateUserPassword: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(req.user.sub)}`);
    updateUserPasswordDto.id = req.user.sub;
    const user = await this.userService.updateUserPassword(
      updateUserPasswordDto,
    );
    return plainToInstance(GetUserDto, user);
  }

  @ApiOperation({ summary: 'Get current logged-in user' })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, UserSocketExistsGuard)
  @Get('me')
  public async getMe(@Request() req: RequestExpress) {
    this.logger.log(`getMe: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(req.user.sub)}`);
    const userId = req.user.sub;
    const user = await this.userService.get(userId);
    return plainToInstance(GetUserDto, user);
  }

  @ApiOperation({ summary: 'Filter users with pagination' })
  @ApiBody({ type: FilterUserDto })
  @ApiResponse({
    status: 200,
    type: UserPaginatedDto,
    description: 'Paginated user data',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('filter')
  public async filterUsersPaginated(
    @Query() page: PageDto,
    @Body() filterUserDto: FilterUserDto,
    @Request() req: RequestExpress,
  ): Promise<UserPaginatedDto<GetUserExposeDto>> {
    this.logger.log(`filterUsersPaginated: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(page)}`);
    this.logger.log(`Data sent: ${JSON.stringify(filterUserDto)}`);
    const usersPaginated = await this.userService.filterUsersPaginated(
      page,
      filterUserDto,
    );
    return plainToInstance(UserPaginatedDto<GetUserExposeDto>, usersPaginated);
  }

  @ApiOperation({ summary: 'Update user nickname' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, type: GetUserDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('change-nickname')
  async updateNickname(
    @Body() updateUserDto: UpdateUserDto,
    @Request() req: RequestExpress,
  ) {
    this.logger.log(`updateUserNickname: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(updateUserDto)}`);
    this.logger.log(`Data sent: ${JSON.stringify(req.user.sub)}`);
    updateUserDto.userId = req.user.sub;
    const user = await this.userService.updateUserNickname(updateUserDto);
    return plainToInstance(GetUserDto, user);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, type: GetUserExposeDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  public async getUser(
    @Param() params: FindOneParams,
    @Request() req: RequestExpress,
  ) {
    this.logger.log(`getUser: Request made to ${req.url}`);
    this.logger.log(`Data sent: ${JSON.stringify(params)}`);
    const { id } = params;
    const user = await this.userService.get(id);
    return plainToInstance(GetUserExposeDto, user);
  }
}
