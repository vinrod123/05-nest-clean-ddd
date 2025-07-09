import { Module } from '@nestjs/common'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateQuestionController } from './controllers/create-question.controller'
import { FetchRecentQuestionsController } from '@/infra/http/controllers/fetch-recent-question.controller';
import { DatabaseModule } from '@/infra/database/prisma/repositories/database.module';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';

@Module({
  imports: [
    DatabaseModule, CryptographyModule
  ],
  providers:
    [CreateQuestionUseCase,
      FetchRecentQuestionsUseCase,
      RegisterStudentUseCase,
      AuthenticateStudentUseCase
    ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
})
export class HttpModule {}