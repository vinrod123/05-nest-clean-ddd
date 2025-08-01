import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import {AnswersRepository} from "@/domain/forum/application/repositories/answers.repository";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import { Injectable } from '@nestjs/common';

interface EditAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
    attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        answer: Answer
    }
>

@Injectable()
export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async execute({
                      authorId,
                      answerId,
                      content,
                      attachmentsIds,
                  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentAnswerAttachments =
            await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

        const answerAttachmentList = new AnswerAttachmentList(
            currentAnswerAttachments,
        )

        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id,
            })
        })

        answerAttachmentList.update(answerAttachments)

        answer.attachments = answerAttachmentList
        answer.content = content

        await this.answersRepository.save(answer)

        return right({
            answer,
        })
    }
}