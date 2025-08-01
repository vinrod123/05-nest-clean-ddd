import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import {InMemoryAnswersRepository} from "../../../../../test/repositories/in-memory-answers.repository";
import {FetchQuestionsAnswersUseCase} from "@/domain/forum/application/use-cases/fetch-questions-answers";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionsAnswersUseCase

describe('Fetch Question Answers', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
            inMemoryAnswerAttachmentsRepository,
        )
        sut = new FetchQuestionsAnswersUseCase(inMemoryAnswersRepository)
    })

    it('should be able to fetch question answers', async () => {
        await inMemoryAnswersRepository.create(
            makeAnswer({
                questionId: new UniqueEntityID('question-1'),
            }),
        )
        await inMemoryAnswersRepository.create(
            makeAnswer({
                questionId: new UniqueEntityID('question-1'),
            }),
        )
        await inMemoryAnswersRepository.create(
            makeAnswer({
                questionId: new UniqueEntityID('question-1'),
            }),
        )

        const result = await sut.execute({
            questionId: 'question-1',
            page: 1,
        })

        expect(result.value?.answers).toHaveLength(3)
    })

    it('should be able to fetch paginated question answers', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswersRepository.create(
                makeAnswer({
                    questionId: new UniqueEntityID('question-1'),
                }),
            )
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2,
        })

        expect(result.value?.answers).toHaveLength(2)
    })
})
