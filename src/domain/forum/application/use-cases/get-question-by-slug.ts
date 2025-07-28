import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {Either, left, right} from "@/core/either";
import { Injectable } from '@nestjs/common';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

interface GetQuestionBySlugUseCaseRequest {
    slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        question: QuestionDetails
    }
>

@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(private questionsRepository: QuestionsRepository) {}

    async execute({
                      slug,
                  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
      const question = await this.questionsRepository.findDetailsBySlug(slug)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        return right({
            question,
        })
    }
}