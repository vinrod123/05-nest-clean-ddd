import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {Optional} from "@/core/types/optional";
import {Comment, CommentProps} from "@/domain/forum/enterprise/entities/comment";


export interface QuestionCommentProps extends CommentProps{
    questionId: UniqueEntityID
}
export class QuestionComment extends Comment<QuestionCommentProps>{

    get questionId(){
        return this.props.questionId
    }


    static create(props: Optional<QuestionCommentProps, 'createdAt'>, id?: UniqueEntityID){
        const questionComment = new QuestionComment({
            ...props,
            createdAt: new Date()
        }, id)


        return questionComment
    }
}

