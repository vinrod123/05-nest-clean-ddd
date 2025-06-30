import {CreateQuestionUseCase} from "@/domain/forum/application/use-cases/create-question";
import {beforeEach, describe, expect} from "vitest";
import {InMemoryQuestionsRepository} from "../../../../../test/repositories/in-memory-questions-repository";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {
    InMemoryQuestionAttachmentsRepository
} from "../../../../../test/repositories/in-memory-question-attachments-repository";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create question', () => {

    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to create question', async () =>{
        const result = await sut.execute({
            authorId: '1',
            title: '1',
            content: 'Nova questão',
            attachmentsIds: ['1', '2']
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('2')})
        ])
    })
})
