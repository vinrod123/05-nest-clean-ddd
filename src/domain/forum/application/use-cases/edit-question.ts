import {QuestionsRepository} from "@/domain/forum/application/repositories/questions-repository";
import {Question} from "@/domain/forum/enterprise/entities/question";
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import {QuestionAttachmentsRepository} from "@/domain/forum/application/repositories/question-attachments-repository";
import {QuestionAttachmentList} from "@/domain/forum/enterprise/entities/question-attachment-list";
import {QuestionAttachment} from "@/domain/forum/enterprise/entities/question-attachment";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import { Injectable } from '@nestjs/common';

interface EditQuestionUseCaseRequest{
    title: string
    questionId: string
    authorId: string
    content: string
    attachmentsIds: string[]
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
    question: Question
}>

@Injectable()
export class EditQuestionUseCase{
    constructor(
        private questionRepository: QuestionsRepository,
        private questionAttachmentsRepository: QuestionAttachmentsRepository
    ){}

    async execute({
                      title,
                      authorId,
                        content,
        questionId,
        attachmentsIds
                  } : EditQuestionUseCaseRequest) : Promise<EditQuestionUseCaseResponse>{

        const question = await this.questionRepository.findById(questionId)

        if(!question){
            return left(new ResourceNotFoundError())
        }

        if(authorId != question.authorId.toString()){
            return left(new NotAllowedError())
        }

        const currentQuestionAttachment = await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

        const questionAttachmentList =  new QuestionAttachmentList(currentQuestionAttachment)

        const questionAttachments = attachmentsIds.map( attachmentId => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                questionId: question.id
            })
        })

        questionAttachmentList.update(questionAttachments)
        question.attachments = questionAttachmentList

        question.title = title
        question.content = content

        await this.questionRepository.save(question)

        return right({
            question
        })

    }
}