
import {QuestionCommentsRepository} from "@/domain/forum/application/repositories/question-comments-repository";
import {QuestionComment} from "@/domain/forum/enterprise/entities/question-comment";
import {AnswersCommentsRepository} from "@/domain/forum/application/repositories/answers-comments-repository";
import {AnswerComment} from "@/domain/forum/enterprise/entities/answer-comment";
import {PaginationParams} from "@/core/repositories/pagination-params";

export class InMemoryAnswersCommentRepository implements AnswersCommentsRepository {

    public items: AnswerComment[] = []

    async create(answerComment: AnswerComment){
        this.items.push(answerComment)
    }

    async findById(id: string): Promise<AnswerComment | null> {
        const answerComment = this.items.find((item) => item.id.toString() == id)

        if(!answerComment){
            throw null
        }

        return answerComment
    }

    async delete(answerComment: AnswerComment){
        const itemIndex = this.items.findIndex(item => item.id === answerComment.id)
        this.items.splice(itemIndex, 1)
    }

    async findManyByAnswerId(answerId: string, {page}: PaginationParams) {
        const answerComments = this.items.filter(item => item.answerId.toString() == answerId)
            .slice((page - 1) * 20, page * 20)
        return answerComments
    }
}