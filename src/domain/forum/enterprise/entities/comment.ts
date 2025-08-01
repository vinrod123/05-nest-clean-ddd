import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";
import {Entity} from "@/core/entities/entity";


export interface CommentProps{
    authorId: UniqueEntityID
    content: string
    createdAt: Date
    updatedAt?: Date | null
}
export abstract class Comment<Props extends CommentProps> extends Entity<Props>{

    get authorId(){
        return this.props.authorId
    }
    get content(){
        return this.props.content
    }
    get createdAt(){
        return this.props.createdAt
    }
    get updatedAt(){
        return this.props.updatedAt
    }

    set content(content: string){
        this.props.content = content
        this.touch()
    }

    private touch(){
        this.props.updatedAt = new Date()
    }
}
