import {Entity} from "@/core/entities/entity";
import {UniqueEntityId} from "@/core/entities/unique-entity-id";
import {a} from "vitest/dist/chunks/suite.d.FvehnV49";

export interface AttachmentProps {
    title: string
    url: string
}

export class Attachment extends Entity<AttachmentProps>{
    get title(){
        return this.props.title
    }

    get url(){
        return this.props.url
    }

    static create(props: AttachmentProps, id?: UniqueEntityId){
        const attachment = new Attachment(props, id)
        return attachment
    }
}