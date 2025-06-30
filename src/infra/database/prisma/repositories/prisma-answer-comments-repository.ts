import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { AnswersCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswersCommentsRepository
{
  findManyByAnswerId(
    id: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<AnswerComment | null> {
    throw new Error("Method not implemented.");
  }

  create(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(answerComment: AnswerComment): Promise<void> {
    throw new Error("Method not implemented.");
  }
}