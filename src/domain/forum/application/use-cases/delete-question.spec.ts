import { DeleteQuestionUseCase } from './delete-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachment-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-i-d';
import { makeQuestionAttachment } from '../../../../../test/factories/make-question-attachment';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository =
          new InMemoryQuestionAttachmentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
          inMemoryQuestionAttachmentsRepository,
          inMemoryAttachmentsRepository,
          inMemoryStudentsRepository,
        )

        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
    })

    it.skip('should be able to delete a question', async () => {
        const newQuestion = makeQuestion(
          {
              authorId: new UniqueEntityID('author-1'),
          },
          new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentsRepository.items.push(
          makeQuestionAttachment({
              questionId: newQuestion.id,
              attachmentId: new UniqueEntityID('1'),
          }),
          makeQuestionAttachment({
              questionId: newQuestion.id,
              attachmentId: new UniqueEntityID('2'),
          }),
        )

        await sut.execute({
            questionId: 'question-1',
            authorId: 'author-1',
        })

        expect(inMemoryQuestionsRepository.items).toHaveLength(0)
        expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question from another user', async () => {
        const newQuestion = makeQuestion(
          {
              authorId: new UniqueEntityID('author-1'),
          },
          new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: 'question-1',
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})