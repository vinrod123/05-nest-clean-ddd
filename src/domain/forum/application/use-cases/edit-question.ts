import { Either, left, right } from '@/core/either'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found';
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed";
import { UniqueEntityID } from '@/core/entities/unique-entity-i-d'

interface EditQuestionUseCaseRequest {
    authorId: string
    questionId: string
    title: string
    content: string
    attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
      question: Question
  }
>

@Injectable()
export class EditQuestionUseCase {
    constructor(
      private questionsRepository: QuestionsRepository,
      private questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) {}

    async execute({
                      authorId,
                      questionId,
                      title,
                      content,
                      attachmentsIds,
                  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentQuestionAttachments =
          await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

        const questionAttachmentList = new QuestionAttachmentList(
          currentQuestionAttachments,
        )

        const questionAttachments = attachmentsIds.map((attachmentId) => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                questionId: question.id,
            })
        })

        questionAttachmentList.update(questionAttachments)

        question.attachments = questionAttachmentList
        question.title = title
        question.content = content

        await this.questionsRepository.save(question)

        return right({
            question,
        })
    }
}