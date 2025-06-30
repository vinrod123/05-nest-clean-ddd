import {PaginationParams} from "@/core/repositories/pagination-params";
import {QuestionAttachment} from "@/domain/forum/enterprise/entities/question-attachment";
import {QuestionAttachmentList} from "@/domain/forum/enterprise/entities/question-attachment-list";
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";

export interface QuestionAttachmentsRepository{
    findManyByQuestionId(questionId: string) : Promise<QuestionAttachment[]>
    deleteManyByQuestionId(questionId: string) : Promise<void>
}