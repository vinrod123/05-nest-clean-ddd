
import {AnswersRepository} from "@/domain/forum/application/repositories/answers.repository";
import {Answer} from "@/domain/forum/enterprise/entities/answer";
import {Either, right} from "@/core/either";

interface FetchQuestionsAnswersUseCaseRequest{
    questionId: string
    page: number
}

type FetchQuestionsAnswersUseCaseResponse = Either<null, {
    answers: Answer[]
}>

export class FetchQuestionsAnswersUseCase{
    constructor(
        private answersRepository: AnswersRepository,
    ){}

    async execute({
        questionId,
                      page
                  } : FetchQuestionsAnswersUseCaseRequest) : Promise<FetchQuestionsAnswersUseCaseResponse>{

        const answers = await this.answersRepository.findManyByQuestionId(questionId, {page})
        return right({
            answers,
        })

    }
}