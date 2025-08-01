import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-i-d';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
          inMemoryStudentsRepository,
        )

        sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
    })

    it('should be able to delete a question comment', async () => {
        const questionComment = makeQuestionComment()

        await inMemoryQuestionCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })

        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user question comment', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityID('author-1'),
        })

        await inMemoryQuestionCommentsRepository.create(questionComment)

        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})