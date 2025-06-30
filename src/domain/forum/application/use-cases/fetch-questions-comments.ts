
import {AnswersRepository} from "@/domain/forum/application/repositories/answers.repository";
import {Answer} from "@/domain/forum/enterprise/entities/answer";
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";
import {QuestionCommentsRepository} from "@/domain/forum/application/repositories/question-comments-repository";
import {Either, right} from "@/core/either";

interface FetchQuestionCommentsUseCaseRequest{
    questionId: string
    page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<null, {
    questionComments: QuestionComment[]
}>

export class FetchQuestionCommentsUseCase{
    constructor(
        private questionCommentsRepository: QuestionCommentsRepository,
    ){}

    async execute({
                      questionId,
                      page
                  } : FetchQuestionCommentsUseCaseRequest) : Promise<FetchQuestionCommentsUseCaseResponse>{

        const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, {page})
        return right({
            questionComments,
        })

    }
}