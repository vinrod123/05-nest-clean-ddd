
import {beforeEach, describe, expect} from "vitest";
import {InMemoryQuestionsRepository} from "../../../../../test/repositories/in-memory-questions-repository";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {makeQuestion} from "../../../../../test/factories/make-question";
import {DeleteAnswerUseCase} from "@/domain/forum/application/use-cases/delete-answer";
import {AnswersRepository} from "@/domain/forum/application/repositories/answers.repository";
import {InMemoryAnswersRepository} from "../../../../../test/repositories/in-memory-answers.repository";
import {makeAnswer} from "../../../../../test/factories/make-answer";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import {
    InMemoryAnswerAttachmentsRepository
} from "../../../../../test/repositories/in-memory-answer-attachments-repository";
import {makeQuestionAttachment} from "../../../../../test/factories/make-question-attachment";
import {makeAnswerAttachment} from "../../../../../test/factories/make-answer-attachment";

let inMemoryAnswerAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete answer by id', () => {

    beforeEach(() => {
        inMemoryAnswerAttachmentRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentRepository)
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to delete a answer by id', async () =>{
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))
        await inMemoryAnswersRepository.create(newAnswer)

        inMemoryAnswerAttachmentRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-1'
        })

        expect(inMemoryAnswersRepository.items).toHaveLength(0)
        expect(inMemoryAnswerAttachmentRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer from another user', async () =>{
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))
        await  inMemoryAnswersRepository.create(newAnswer)


        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})
