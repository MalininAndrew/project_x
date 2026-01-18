import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, UsersService]
})
export class CompanyModule {}
