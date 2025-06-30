
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";
import {PaginationParams} from "@/core/repositories/pagination-params";

export interface QuestionCommentsRepository{
    create(id: QuestionComment) : Promise<void>
    findById(questionId: string) : Promise<QuestionComment | null>
    findManyByQuestionId(id: string, params: PaginationParams) : Promise<QuestionComment[]>
    delete(questionComment: QuestionComment) : Promise<void>
}