import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {Slug} from "@/domain/forum/enterprise/entities/value-objects/slug";
import dayjs from "dayjs";
import {Optional} from "@/core/types/optional";
import {AggregateRoot} from "@/core/entities/aggregate-root";
import {QuestionAttachmentList} from "@/domain/forum/enterprise/entities/question-attachment-list";
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

export interface QuestionProps{
    title: string,
    content: string,
    authorId: UniqueEntityID,
    attachments: QuestionAttachmentList,
    slug: Slug,
    bestAnswerId?: UniqueEntityID | null,
    createdAt: Date,
    updatedAt?: Date | null
}

export class Question  extends AggregateRoot<QuestionProps>{

    get title(){
        return this.props.title
    }

    get content(){
        return this.props.content
    }
    get authorId(){
        return this.props.authorId
    }
    get bestAnswerId(){
        return this.props.bestAnswerId
    }
    set attachments(attachments: QuestionAttachmentList){
        this.props.attachments = attachments
        this.touch()
    }

    get attachments(){
        return this.props.attachments
    }

    get createdAt(){
        return this.props.createdAt
    }
    get updatedAt(){
        return this.props.updatedAt
    }

    get slug() {
        return this.props.slug
    }

    set content(content: string){
        this.props.content = content
        this.touch()
    }

    set bestAnswerId(bestAnswerId: UniqueEntityID | undefined | null) {
        if (bestAnswerId === undefined || bestAnswerId === null) {
            return
        }

        if (this.props.bestAnswerId === undefined ||
        this.props.bestAnswerId === null ||
        !bestAnswerId.equals(this.props.bestAnswerId)
    ) {
            this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
        }
        this.props.bestAnswerId = bestAnswerId
        this.touch()
    }

    private touch(){
        this.props.updatedAt = new Date()
    }

    set title(title: string){
        this.props.title = title
        this.props.slug = Slug.createFromText(title)
        this.touch()
    }

    get isNew() : boolean{
        return dayjs().diff(this.createdAt, 'days') <= 3
    }

    static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityID){
        const question = new Question({
            ...props,
            slug: props.slug ?? Slug.createFromText(props.title),
            attachments: props.attachments ?? new QuestionAttachmentList(),
            createdAt: props.createdAt ?? new Date()
        }, id)


        return question
    }
}