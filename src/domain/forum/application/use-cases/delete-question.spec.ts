import {CreateQuestionUseCase} from "@/domain/forum/application/use-cases/create-question";
import {beforeEach, describe, expect} from "vitest";
import {InMemoryQuestionsRepository} from "../../../../../test/repositories/in-memory-questions-repository";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {makeQuestion} from "../../../../../test/factories/make-question";
import {DeleteQuestionUseCase} from "@/domain/forum/application/use-cases/delete-question";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import {makeQuestionAttachment} from "../../../../../test/factories/make-question-attachment";
import {
    InMemoryQuestionAttachmentsRepository
} from "../../../../../test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete question by id', () => {

    beforeEach(() => {

        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)

        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to delete a question by id', async () =>{
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))
        await  inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1')
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            questionId: 'question-1',
            authorId: 'author-1'
        })

        expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question from another user', async () =>{
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))
        await  inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: 'question-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)

    })
})
