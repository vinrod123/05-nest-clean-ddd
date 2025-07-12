import { Either, left, right } from '@/core/either'

import { Injectable } from '@nestjs/common'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed';
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found';

interface DeleteAnswerCommentUseCaseRequest {
    authorId: string
    answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteAnswerCommentUseCase {
    constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

    async execute({
                      authorId,
                      answerCommentId,
                  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
        const answerComment =
          await this.answerCommentsRepository.findById(answerCommentId)

        if (!answerComment) {
            return left(new ResourceNotFoundError())
        }

        if (answerComment.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        await this.answerCommentsRepository.delete(answerComment)

        return right(null)
    }
}