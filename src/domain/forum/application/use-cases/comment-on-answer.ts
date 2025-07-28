
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {AnswersRepository} from "@/domain/forum/application/repositories/answers.repository";
import {AnswerComment} from "@/domain/forum/enterprise/entities/answer-comment";
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import { Injectable } from '@nestjs/common';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository';

interface CommentOnAnswerUseCaseRequest{
    authorId: string
    answerId: string
    content: string
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError,{
    answerComment: AnswerComment
}>

@Injectable()
export class CommentOnAnswerUseCase{
    constructor(
        private answersRepository: AnswersRepository,
        private answersCommentsRepository: AnswerCommentsRepository
    ){}

    async execute({
                      authorId,
                      answerId,
                      content
    } : CommentOnAnswerUseCaseRequest) : Promise<CommentOnAnswerUseCaseResponse>{

        const question = await this.answersRepository.findById(answerId)

        if(!question){
            return left(new ResourceNotFoundError())
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            content

        })

        await this.answersCommentsRepository.create(answerComment)

        return right({
            answerComment
        })
    }
}