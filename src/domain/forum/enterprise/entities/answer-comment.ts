import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {Optional} from "@/core/types/optional";
import {Comment, CommentProps} from "@/domain/forum/enterprise/entities/comment";


export interface AnswerCommentProps extends CommentProps{
    answerId: UniqueEntityID
}
export class AnswerComment extends Comment<AnswerCommentProps>{

    get answerId(){
        return this.props.answerId
    }


    static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityID){
        const answerComment = new AnswerComment({
            ...props,
            createdAt: new Date()
        }, id)


        return answerComment
    }
}
