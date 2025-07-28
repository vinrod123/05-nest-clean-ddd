import {Entity} from "@/core/entities/entity";
import {UniqueEntityID} from "@/core/entities/unique-entity-i-d";


interface InstructorProps{
    name: string

}
export class Instructor extends Entity<InstructorProps>{

    static create(props: InstructorProps, id?: UniqueEntityID){
        const student = new Instructor(props, id)


        return student
    }
}