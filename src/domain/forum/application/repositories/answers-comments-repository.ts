
import {AnswerComment} from "@/domain/forum/enterprise/entities/answer-comment";
import {PaginationParams} from "@/core/repositories/pagination-params";
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";

export interface AnswersCommentsRepository{
    findById(id: string) : Promise<AnswerComment | null>
    create(answersComment: AnswerComment) : Promise<void>
    delete(answersComment: AnswerComment) : Promise<void>
    findManyByAnswerId(id: string, params: PaginationParams) : Promise<AnswerComment[]>
}