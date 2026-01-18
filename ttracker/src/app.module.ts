import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { StatusesModule } from './statuses/statuses.module';
import { TaskModule } from './task/task.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { UsersProjectRoleModule } from './users-project-role/users-project-role.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true
    }),
    PrismaModule,
    UsersModule,
    ProjectsModule,
    StatusesModule,
    TaskModule,
    CommentsModule,
    AuthModule,
    UsersProjectRoleModule,
    CompanyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
