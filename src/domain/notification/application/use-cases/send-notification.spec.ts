
import { SendNotificationUseCase } from './send-notification'
import {InMemoryNotificationsRepository} from "../../../../../test/repositories/in-memory-notifications-respository";

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
        sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
    })

    it('should be able to send a notification', async () => {
        const result = await sut.execute({
            recipientId: '1',
            title: 'Nova notificação',
            content: 'Conteúdo da notificação',
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items[0]).toEqual(
        result.value?.notification,
    )
    })
})