import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import {
    SendNotificationUseCase,
    SendNotificationUseCaseRequest,
    SendNotificationUseCaseResponse,
} from '../use-cases/send-notification'
import { makeQuestion } from 'test/factories/make-question'
import { waitFor } from 'test/utils/wait-for'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAnswersRepository } from "../../../../../test/repositories/in-memory-answers.repository";
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-respository'
import { InMemoryAttachmentsRepository } from '../../../../../test/repositories/in-memory-attachment-repository';
import { MockInstance } from 'vitest';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  ({
       ...args
   }: SendNotificationUseCaseRequest) => Promise<SendNotificationUseCaseResponse>
>

describe('On Answer Created', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository =
          new InMemoryQuestionAttachmentsRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
          inMemoryQuestionAttachmentsRepository,
          inMemoryAttachmentsRepository,
          inMemoryStudentsRepository,
        )
        inMemoryAnswerAttachmentsRepository =
          new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(
          inMemoryAnswerAttachmentsRepository,
        )
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sendNotificationUseCase = new SendNotificationUseCase(
          inMemoryNotificationsRepository,
        )

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
    })

    it('should  send a notification when an answer is created', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        inMemoryQuestionsRepository.create(question)
        inMemoryAnswersRepository.create(answer)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})