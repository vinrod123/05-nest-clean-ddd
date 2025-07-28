
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
    InMemoryAnswerCommentsRepository
} from '../../../../../test/repositories/in-memory-answers-comments-repository';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
          inMemoryStudentsRepository,
        )

        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = makeAnswerComment()

        await inMemoryAnswerCommentsRepository.create(answerComment)

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })

        expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user answer comment', async () => {
        const answerComment = makeAnswerComment({
            authorId: new UniqueEntityId('author-1'),
        })

        await inMemoryAnswerCommentsRepository.create(answerComment)

        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})