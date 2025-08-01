
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found';
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';

interface ChooseQuestionBestAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
      question: Question
  }
>

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
    constructor(
      private questionsRepository: QuestionsRepository,
      private answersRepository: AnswersRepository,
    ) {}

    async execute({
                      answerId,
                      authorId,
                  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        const question = await this.questionsRepository.findById(
          answer.questionId.toString(),
        )

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)

        return right({
            question,
        })
    }
}
