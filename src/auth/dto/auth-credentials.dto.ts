import { Expose } from 'class-transformer';
import { Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentialsDto {
  @Expose()
  id: string;

  managerName: string;

  @MinLength(4)
  @MaxLength(20)
  username?: string;

  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password is too weak!  Must be 8 characters long and contain At least one Capital Letter, Number, and Special Character (such as #, ?, !, @, %, $, #)`,
  })
  password: string;

  email?: string;

  yearJoined?: number;
}
