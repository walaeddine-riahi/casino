import { IsNotEmpty, IsString } from 'class-validator';

export class DecodeAccessTokenDto {
  @IsString()
  @IsNotEmpty()
  accessTokenString!: string;
}
