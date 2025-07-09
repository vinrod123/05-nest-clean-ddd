
import {AnswerComment} from "@/domain/forum/enterprise/entities/answer-comment";
import {Either, right} from "@/core/either";
import { Injectable } from '@nestjs/common';
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answers-comments-repository';

interface FetchAnswerCommentsUseCaseRequest{
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, {
    answerComments: AnswerComment[]
}>

@Injectable()
export class FetchAnswerCommentsUseCase{
    constructor(
        private answerCommentsRepository: AnswerCommentsRepository,
    ){}

    async execute({
                      answerId,
                      page
                  } : FetchAnswerCommentsUseCaseRequest) : Promise<FetchAnswerCommentsUseCaseResponse>{

        const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {page})

        return right({
            answerComments,
        })

    }
}