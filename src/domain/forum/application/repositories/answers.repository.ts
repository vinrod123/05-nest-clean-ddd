import {Answer} from "@/domain/forum/enterprise/entities/answer";
import {Question} from "@/domain/forum/enterprise/entities/question";
import {PaginationParams} from "@/core/repositories/pagination-params";


export interface  AnswersRepository{
    create(answer: Answer): Promise<void>
    delete(answer: Answer) : Promise<void>
    findById(id: string) : Promise<Answer | null>
    save(answer: Answer) : Promise<void>
    findManyByQuestionId(questionId: string, params: PaginationParams) : Promise<Answer[]>
}