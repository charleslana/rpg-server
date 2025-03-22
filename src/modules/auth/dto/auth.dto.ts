import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserDto } from '@/modules/user/dto/user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto extends UserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}

export class GetAuthDto {
  @Expose()
  @ApiProperty({
    description: 'Access token received after login',
    example: 'some-access-token',
  })
  access_token: string;
}
