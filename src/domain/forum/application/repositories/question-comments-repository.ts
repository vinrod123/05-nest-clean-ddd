import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export abstract class QuestionCommentsRepository {
    abstract findById(id: string): Promise<QuestionComment | null>
    abstract findManyByQuestionId(
      questionId: string,
      params: PaginationParams,
    ): Promise<QuestionComment[]>

    abstract create(questionComment: QuestionComment): Promise<void>
    abstract delete(questionComment: QuestionComment): Promise<void>
    abstract findManyByQuestionIdWithAuthor(
      questionId: string,
      params: PaginationParams,
    ): Promise<CommentWithAuthor[]>
}