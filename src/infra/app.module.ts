import { Module } from "@nestjs/common";
import { CreateAccountController } from "@/infra/http/controllers/create-account.controller";
import { ConfigModule } from '@nestjs/config';
import { evenSchema } from './even';
import { AuthModule } from '@/infra/auth/auth.module';
import { AuthenticateController } from '@/infra/http/controllers/authenticate.controller';
import { CreateQuestionController } from '@/infra/http/controllers/create-question.controller';
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-question.controller';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { HttpModule } from '@/infra/http/http.module';

@Module({
  imports: [ConfigModule.forRoot({
    validate: env => evenSchema.parse(env),
    isGlobal: true
  }),
  AuthModule,
  HttpModule],
  controllers: [CreateAccountController, AuthenticateController, CreateQuestionController, FetchRecentQuestionsController]
})
export class AppModule {}
