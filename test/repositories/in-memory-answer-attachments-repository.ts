
import {QuestionAttachmentsRepository} from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";
import {AnswerAttachmentsRepository} from "@/domain/forum/application/repositories/answer-attachments-repository";
import {AnswerAttachment} from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {

    public items: AnswerAttachment[] = []

    async findManyByAnswerId(answerId: string) {
        const answerAttachments = this.items.filter(item => item.answerId.toString() == answerId)
        return answerAttachments
    }

    async deleteManyByAnswerId(answerId: string){
        const answerAttachments = this.items.filter(item => item.answerId.toString() != answerId)
        this.items = answerAttachments
    }

    async createMany(attachments: AnswerAttachment[]): Promise<void> {
        this.items.push(...attachments)
    }

    async deleteMany(attachments: AnswerAttachment[]): Promise<void> {
        const answerAttachments = this.items.filter((item) => {
            return !attachments.some((attachment) => attachment.equals(item))
        })

        this.items = answerAttachments
    }
}