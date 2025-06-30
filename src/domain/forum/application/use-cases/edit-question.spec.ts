
import {beforeEach, describe, expect} from "vitest";
import {InMemoryQuestionsRepository} from "../../../../../test/repositories/in-memory-questions-repository";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {makeQuestion} from "../../../../../test/factories/make-question";
import {EditQuestionUseCase} from "@/domain/forum/application/use-cases/edit-question";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import {
    InMemoryQuestionAttachmentsRepository
} from "../../../../../test/repositories/in-memory-question-attachments-repository";
import {makeQuestionAttachment} from "../../../../../test/factories/make-question-attachment";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestioAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit question by id', () => {

    beforeEach(() => {

        inMemoryQuestioAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestioAttachmentsRepository)
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestioAttachmentsRepository)
    })

    it('should be able to edit a question by id', async () =>{
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))
        await  inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestioAttachmentsRepository.items.push(
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
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteúdo teste'
        })

        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('3')})
        ])
    })

    it('should not be able to delete a question from another user', async () =>{
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))
        await  inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-2',
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: []
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)


    })
})
