import {QuestionsRepository} from "@/domain/forum/application/repositories/questions-repository";
import {Question} from "@/domain/forum/enterprise/entities/question";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {Either, right} from "@/core/either";

interface FetchRecentQuestionsUseCaseRequest{
    page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<null, {
    questions: Question[]
}>
export class FetchRecentQuestionsUseCase{
    constructor(
        private questionRepository: QuestionsRepository,
    ){}

    async execute({
                      page
                  } : FetchRecentQuestionsUseCaseRequest) : Promise<FetchRecentQuestionsUseCaseResponse>{

        const questions = await this.questionRepository.findManyRecent({
            page
        })
        return right({
            questions,
        })
    }
}