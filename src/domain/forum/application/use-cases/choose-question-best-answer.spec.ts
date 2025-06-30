
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import {InMemoryAnswersRepository} from "../../../../../test/repositories/in-memory-answers.repository";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository,
        )
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        )

        sut = new ChooseQuestionBestAnswerUseCase(
            inMemoryQuestionsRepository,
            inMemoryAnswersRepository,
        )
    })

    it('should be able to choose the question best answer', async () => {
        const question = makeQuestion()

        const answer = makeAnswer({
            questionId: question.id,
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        await sut.execute({
            answerId: answer.id.toString(),
            authorId: question.authorId.toString(),
        })

        expect(inMemoryQuestionsRepository.items[0].bestAnswerId).toEqual(answer.id)
    })

    it('should not be able to to choose another user question best answer', async () => {
        const question = makeQuestion({
            authorId: new UniqueEntityID('author-1'),
        })

        const answer = makeAnswer({
            questionId: question.id,
        })

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        const result = await sut.execute({
            answerId: answer.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})