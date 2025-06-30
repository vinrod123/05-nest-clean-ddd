import {QuestionsRepository} from "@/domain/forum/application/repositories/questions-repository";
import {Question} from "@/domain/forum/enterprise/entities/question";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {QuestionCommentsRepository} from "@/domain/forum/application/repositories/question-comments-repository";
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";
import {AnswersCommentsRepository} from "@/domain/forum/application/repositories/answers-comments-repository";
import {Either, left, right} from "@/core/either";
import {ResourceNotFoundError} from "@/domain/forum/application/use-cases/errors/resource-not-found";
import {NotAllowedError} from "@/domain/forum/application/use-cases/errors/not-allowed";

interface DeleteAnswerCommentUseCaseRequest{
    authorId: string
    answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>
export class DeleteAnswerCommentUseCase{
    constructor(
        private answerCommentsRepository: AnswersCommentsRepository
    ){}

    async execute({
                      authorId,
                      answerCommentId
                  } : DeleteAnswerCommentUseCaseRequest) : Promise<DeleteAnswerCommentUseCaseResponse>{

        const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

        if(!answerComment){
            return left(new ResourceNotFoundError())
        }

        if(answerComment.authorId.toString() !== authorId){
            return left(new NotAllowedError())
        }


        await this.answerCommentsRepository.delete(answerComment)

        return right(null)
    }
}