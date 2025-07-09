import {QuestionsRepository} from "@/domain/forum/application/repositories/questions-repository";
import {Question} from "@/domain/forum/enterprise/entities/question";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {QuestionCommentsRepository} from "@/domain/forum/application/repositories/question-comments-repository";
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import { Injectable } from '@nestjs/common';

interface DeleteQuestionCommentUseCaseRequest{
    authorId: string
    questionCommentId: string
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null >

@Injectable()
export class DeleteQuestionCommentUseCase{
    constructor(
        private questionCommentsRepository: QuestionCommentsRepository
    ){}

    async execute({
                      authorId,
                      questionCommentId
                  } : DeleteQuestionCommentUseCaseRequest) : Promise<DeleteQuestionCommentUseCaseResponse>{

        const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

        if(!questionComment){
            return left(new ResourceNotFoundError())
        }

        if(questionComment.authorId.toString() !== authorId){
            return left(new NotAllowedError())
        }


        await this.questionCommentsRepository.delete(questionComment)

        return right(null)
    }
}