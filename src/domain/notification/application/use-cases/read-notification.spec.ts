import { ReadNotificationUseCase } from './read-notification'
import {makeNotification} from "../../../../../test/factories/make-notifications";
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-respository';
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Send Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
    })

    it('should be able to read a notification', async () => {
        const notification = makeNotification()

        inMemoryNotificationsRepository.create(notification)

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString(),
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
            expect.any(Date),
        )
    })

    it('should not be able to read a notification from another user', async () => {
        const notification = makeNotification({
            recipientId: new UniqueEntityID('recipient-1'),
        })

        inMemoryNotificationsRepository.create(notification)

        const result = await sut.execute({
            notificationId: notification.id.toString(),
            recipientId: 'recipient-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})