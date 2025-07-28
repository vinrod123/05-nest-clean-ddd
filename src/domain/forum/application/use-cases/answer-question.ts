import { Answer } from '../../enterprise/entities/answer'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import {Either, right} from "@/core/either";
import {AnswersRepository} from "@/domain/forum/application/repositories/answers.repository";
import {UniqueEntityId} from "@/core/entities/unique-entity-id";
import { Injectable } from '@nestjs/common';

interface AnswerQuestionUseCaseRequest {
    authorId: string
    questionId: string
    attachmentsIds: string[]
    content: string
}

type AnswerQuestionUseCaseResponse = Either<
    null,
    {
        answer: Answer
    }
>

@Injectable()
export class AnswerQuestionUseCase {
    constructor(private answersRepository: AnswersRepository) {}

    async execute({
                      authorId,
                      questionId,
                      content,
                      attachmentsIds,
                  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityId(authorId),
            questionId: new UniqueEntityId(questionId),
        })

        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                answerId: answer.id,
            })
        })

        answer.attachments = new AnswerAttachmentList(answerAttachments)

        await this.answersRepository.create(answer)

        return right({
            answer,
        })
    }
}