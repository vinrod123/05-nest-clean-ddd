import { makeAnswer } from 'test/factories/make-answer'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import {InMemoryAnswersRepository} from "../../../../../test/repositories/in-memory-answers.repository";
import {InMemoryAnswersCommentRepository} from "../../../../../test/repositories/in-memory-answers-comments-repository";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswersCommentRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        )
        inMemoryAnswerCommentsRepository = new InMemoryAnswersCommentRepository()

        sut = new CommentOnAnswerUseCase(
            inMemoryAnswersRepository,
            inMemoryAnswerCommentsRepository,
        )
    })

    it('should be able to comment on answer', async () => {
        const answer = makeAnswer()

        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: answer.authorId.toString(),
            content: 'Comentário teste',
        })

        expect(inMemoryAnswerCommentsRepository.items[0].content).toEqual(
            'Comentário teste',
        )
    })
})