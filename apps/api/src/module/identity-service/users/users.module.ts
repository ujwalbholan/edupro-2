import { Module } from '@nestjs/common';
import { UserService } from './application/users.service';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
