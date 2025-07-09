import {QuestionsRepository} from "@/domain/forum/application/repositories/questions-repository";
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";
import { Injectable } from '@nestjs/common';

interface DeleteQuestionUseCaseRequest{
    questionId: string,
    authorId: string
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null >

@Injectable()
export class DeleteQuestionUseCase{
    constructor(
        private questionRepository: QuestionsRepository,
    ){}

    async execute({
                      questionId,
                      authorId
                  } : DeleteQuestionUseCaseRequest) : Promise<DeleteQuestionUseCaseResponse>{

        const question = await this.questionRepository.findById(questionId)

        if(!question){
            return left(new ResourceNotFoundError())
        }

        if(authorId != question.authorId.toString()){
            return left(new NotAllowedError())
        }

        await this.questionRepository.delete(question)

        return right(null)

    }
}