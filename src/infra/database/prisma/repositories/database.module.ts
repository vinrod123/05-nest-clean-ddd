import { Module } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionsRepository } from '@/infra/database/prisma/repositories/prisma-questions-repository';
import {
  PrismaQuestionCommentsRepository
} from '@/infra/database/prisma/repositories/prisma-questions-comments-repository';
import {
  PrismaQuestionAttachmentsRepository
} from '@/infra/database/prisma/repositories/prisma-question-attachments-repository';
import { PrismaAnswersRepository } from '@/infra/database/prisma/repositories/prisma-answers-repository';
import { PrismaAnswerCommentsRepository } from '@/infra/database/prisma/repositories/prisma-answer-comments-repository';
import {
  PrismaAnswerAttachmentsRepository
} from '@/infra/database/prisma/repositories/prisma-answer--attachments-repository';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { PrismaStudentsRepository } from '@/infra/database/prisma/repositories/prisma-students-repository';


@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
    PrismaQuestionsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaAnswersRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswerAttachmentsRepository,
  ],
})
export class DatabaseModule {}