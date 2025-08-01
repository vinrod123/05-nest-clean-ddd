
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import {Either, left, right} from "@/core/either";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import { Injectable } from '@nestjs/common';

interface ReadNotificationUseCaseRequest {
    recipientId: string
    notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        notification: Notification
    }
>

@Injectable()
export class ReadNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async execute({
                      recipientId,
                      notificationId,
                  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
        const notification = await this.notificationsRepository.findById(
            notificationId,
        )

        if (!notification) {
            return left(new ResourceNotFoundError())
        }

        if (recipientId !== notification.recipientId.toString()) {
            return left(new NotAllowedError())
        }

        notification.read()

        await this.notificationsRepository.save(notification)

        return right({ notification })
    }
}