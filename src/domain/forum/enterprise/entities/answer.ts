import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {Optional} from "@/core/types/optional";
import {AnswerAttachmentList} from "@/domain/forum/enterprise/entities/answer-attachment-list";
import {AggregateRoot} from "@/core/entities/aggregate-root";
import {AnswerCreatedEvent} from "@/domain/forum/enterprise/events/answer-created-event";


export interface AnswerProps{
    content: string,
    authorId: UniqueEntityID,
    questionId: UniqueEntityID,
    attachments: AnswerAttachmentList,
    createdAt: Date,
    updatedAt?: Date | null
}
export class Answer extends AggregateRoot<AnswerProps> {

    get authorId(){
        return this.props.authorId
    }

    get questionId(){
        return this.props.questionId
    }
    get content(){
        return this.props.content
    }

    set content(content: string){
        this.props.content = content
        this.touch()
    }

    get attachments(){
        return this.props.attachments
    }

    set attachments(answerAttachmentList: AnswerAttachmentList){
        this.props.attachments = answerAttachmentList
        this.touch()
    }

    get createdAt(){
        return this.props.createdAt
    }
    get updatedAt(){
        return this.props.updatedAt
    }

    get excerpt(){
       return this.content.substring(0, 120).trimEnd().concat('...')
    }



    private touch(){
        this.props.updatedAt = new Date()
    }

    static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'>, id?: UniqueEntityID){
        const answer = new Answer({
            ...props,
            attachments: props.attachments ?? new AnswerAttachmentList(),
            createdAt: new Date()
        }, id)


        const isNewAnswer = !id

        if (isNewAnswer) {
            answer.addDomainEvent(new AnswerCreatedEvent(answer))
        }


        return answer
    }
}
