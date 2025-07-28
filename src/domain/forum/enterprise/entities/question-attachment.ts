import {Entity} from "@/core/entities/entity";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";

export interface QuestionAttachmentProps {
    questionId: UniqueEntityID
    attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps>{
    get questionId(){
        return this.props.questionId
    }

    get attachmentId(){
        return this.props.attachmentId
    }

    static create(props: QuestionAttachmentProps, id?: UniqueEntityID){
        const question = new QuestionAttachment(props, id)
        return question
    }

}