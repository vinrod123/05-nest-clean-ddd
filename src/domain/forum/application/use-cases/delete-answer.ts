import {QuestionsRepository} from "@/domain/forum/application/repositories/questions-repository";
import {AnswersRepository} from "@/domain/forum/application/repositories/answers.repository";
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";

interface DeleteAnswerUseCaseRequest{
    answerId: string,
    authorId: string
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {}>

export class DeleteAnswerUseCase{
    constructor(
        private answersRepository: AnswersRepository,
    ){}

    async execute({
                      answerId,
                      authorId
                  } : DeleteAnswerUseCaseRequest) : Promise<DeleteAnswerUseCaseResponse>{

        const answer = await this.answersRepository.findById(answerId)

        if(!answer){
            return left(new ResourceNotFoundError())
        }

        if(authorId != answer.authorId.toString()){
            return left(new NotAllowedError())
        }

        await this.answersRepository.delete(answer)

        return right({})
    }
}